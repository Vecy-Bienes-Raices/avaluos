// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';
import { encode, decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const {
      user_name,
      user_email,
      user_phone,
      property_summary,
      plan,
      ref_payco
    } = payload;

    // 1. Init Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Get Next ID (Secure Sequence)
    const { data: idData, error: idError } = await supabase.rpc('get_next_solicitud_id');
    if (idError) throw idError;
    const ticketId = idData;

    // 3. RETRIEVE REPORT PDF (From Client Generation)
    // en lugar de generar un recibo genérico, descargamos el reporte profesional que hizo el cliente
    let pdfBuffer;
    const reportUrl = payload.pdf_link; // Client sends this

    if (reportUrl) {
      console.log("📥 Fetching Report PDF from:", reportUrl);
      const reportRes = await fetch(reportUrl);
      if (!reportRes.ok) throw new Error("Failed to fetch report PDF");
      const blob = await reportRes.blob();
      pdfBuffer = new Uint8Array(await blob.arrayBuffer());
    } else {
      // FALLBACK: Generate simple receipt if no link provided
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      page.drawText('RECIBO DE PAGO - VECY AVALÚOS', { x: 50, y: height - 50, size: 18, font: timesRomanFont });
      page.drawText(`Ref: ${ref_payco}`, { x: 50, y: height - 80, size: 12, font: timesRomanFont });
      pdfBuffer = await pdfDoc.save();
    }

    // 4. (SKIP UPLOAD) - The file is already uploaded by client. 
    // We just attach it.


    // 5. Send Email (Nodemailer)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: Deno.env.get('GMAIL_USER'),
        pass: Deno.env.get('GMAIL_APP_PASSWORD'),
      },
    });

    // HTML Template Premium VECY (Dark/Gold Theme)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #1a1a1a; margin: 0; padding: 0; color: #e5e5e5; }
          .container { max-width: 600px; margin: 40px auto; background-color: #2C2420; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #4a3b32; }
          .header { background: linear-gradient(135deg, #2C2420 0%, #1a1a1a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
          .logo-text { color: #D4AF37; font-size: 28px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .content { padding: 40px 30px; }
          .title { color: #ffffff; font-size: 24px; margin-bottom: 20px; font-weight: 300; }
          .card { background-color: rgba(255,255,255,0.05); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; }
          .row:last-child { border-bottom: none; margin-bottom: 0; }
          .label { color: #888; font-size: 12px; text-transform: uppercase; }
          .value { color: #fff; font-weight: 500; font-size: 14px; text-align: right; }
          .btn { display: list-item; list-style: none; background: linear-gradient(90deg, #D4AF37 0%, #B8860B 100%); color: #000; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; text-align: center; margin: 30px auto; width: fit-content; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }
          .footer { background-color: #151515; padding: 30px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #333; }
          .highlight { color: #D4AF37; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Logo -->
          <div class="header">
            <h1 class="logo-text">💎 VECY AVALÚOS</h1>
            <p style="color: #888; font-size: 12px; margin-top: 5px;">INTELIGENCIA INMOBILIARIA</p>
          </div>

          <!-- Body -->
          <div class="content">
            <h2 class="title">Hola, <span class="highlight">${user_name}</span></h2>
            <p style="line-height: 1.6; color: #ccc;">
              Tu solicitud de valoración ha sido procesada con éxito. Hemos generado un informe técnico detallado basado en la inteligencia de mercado de Vecy.
            </p>

            <!-- Details Card -->
            <div class="card">
              <div class="row">
                <span class="label">PLAN ADQUIRIDO</span>
                <span class="value" style="color: #D4AF37;">${plan.toUpperCase()}</span>
              </div>
               <div class="row">
                <span class="label">TICKET ID</span>
                <span class="value">#${ticketId}</span>
              </div>
              <div class="row">
                <span class="label">REFERENCIA PAGO</span>
                <span class="value">${ref_payco}</span>
              </div>
              <div class="row" style="display: block; margin-top: 10px;">
                <span class="label" style="display: block; margin-bottom: 5px;">INMUEBLE ANALIZADO</span>
                <span class="value" style="text-align: left; display: block; line-height: 1.4;">${property_summary}</span>
              </div>
            </div>

            <!-- Download Button -->
             ${reportUrl ? `<a href="${reportUrl}" class="btn">📥 DESCARGAR INFORME OFICIAL</a>` : ''}
            
            <p style="text-align: center; font-size: 12px; color: #666; margin-top: 30px;">
              *El archivo PDF también se encuentra adjunto a este correo.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2025 Vecy Bienes Raíces. Todos los derechos reservados.</p>
            <p>Bogotá, Colombia • www.vecy.co</p>
            <p style="margin-top: 10px; color: #444;">Este es un mensaje automático generado por JanIA (Tu Asistente IA).</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Vecy Avalúos" <vecybienesraices@gmail.com>',
      to: user_email,
      cc: 'vecybienesraices@gmail.com', // Admin copy CONFIRMED
      subject: `💎 Tu Avalúo Plan ${plan.toUpperCase()} está listo - Ticket #${ticketId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Avaluo_Vecy_${ticketId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // 6. WhatsApp Notification (CallMeBot)
    console.log("📱 [Edge] Checking WhatsApp requirements:", { hasKey: !!Deno.env.get('CALLMEBOT_API_KEY'), hasPhone: !!user_phone });
    const callMeBotKey = Deno.env.get('CALLMEBOT_API_KEY');

    if (callMeBotKey && user_phone) {
      try {
        const shortSummary = property_summary ? property_summary.substring(0, 100) + (property_summary.length > 100 ? '...' : '') : 'Sin detalles';
        const adminMsg = `🔔 *NUEVA VENTA VECY* \n👤 *Cliente:* ${user_name}\n💎 *Plan:* ${plan}\n🏠 *Inmueble:* ${shortSummary}\n💰 *Ref:* ${ref_payco}\n📄 *Ver Reporte:* ${reportUrl || 'Adjunto en correo'}`;
        console.log("📱 [Edge] Sending WhatsApp to:", adminMsg);
        const adminUrl = `https://api.callmebot.com/whatsapp.php?phone=+573166569719&text=${encodeURIComponent(adminMsg)}&apikey=${callMeBotKey}`;
        const waRes = await fetch(adminUrl);
        console.log("📱 [Edge] WhatsApp Status:", waRes.status);
      } catch (waErr) {
        console.error("⚠️ [Edge] WhatsApp Failed:", waErr);
      }
    } else {
      console.log("⚠️ [Edge] Skipping WhatsApp (Missing Key or Phone)");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Proceso completado',
        ticketId,
        pdfUrl: reportUrl || '' // FIXED: Use reportUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error: any) {
    console.error("❌ Critical Error Sending Email:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown Error', details: error }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
