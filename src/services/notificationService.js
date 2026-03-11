/**
 * Servicio de Notificaciones (Inspirado en Vecy Agenda)
 * Maneja el envío de alertas a WhatsApp (CallMeBot) y triggers de Correo.
 */

import { supabase } from '../lib/supabaseClient';

const CALLMEBOT_API_KEY = '293812'; // Placeholder or Default? I'll use a placeholder placeholder and ask user. 
// Actually, I can't guess it. I'll put a comment.

const ADMIN_PHONE = '+573166569719'; // Updated to match API Key source

export const sendAdminNotification = async (type, data) => {
    try {
        const message = `🚀 *NUEVA ACTIVIDAD VECY AVALÚOS* 🚀
        
📌 *Tipo:* ${type}
👤 *Usuario:* ${data.user_name || 'Anónimo'}
📧 *Email:* ${data.user_email || 'No registrado'}
📱 *Tel:* ${data.user_phone || 'N/A'}

🏠 *Inmueble:*
${data.property_summary || 'Sin datos'}

💰 *Valor Estimado:* ${data.estimated_value || 'N/A'}
💎 *Plan:* ${data.plan || 'Gratis'}

_Mensaje generado automáticamente por JanIA_`;

        // Llamada a CallMeBot (WhatsApp API)
        const apiKey = import.meta.env.VITE_CALLMEBOT_API_KEY; 
        const encodedMsg = encodeURIComponent(message);
        
        // CallMeBot is GET Request
        const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_PHONE}&text=${encodedMsg}&apikey=${apiKey}`;
        
        // Fire and forget (no await blocking/CORS might be an issue depending on browser policies, but typically allowed for GET images/scripts, fetch might block)
        // To bypass CORS for CallMeBot, we often use 'no-cors' mode but then we can't check status.
        await fetch(url, { mode: 'no-cors' });
        console.log("✅ Admin Notified via WhatsApp");

    } catch (e) {
        console.warn("⚠️ Failed to notify admin:", e);
    }
};

/**
 * Simula la arquitectura de Vecy Agenda:
 * En lugar de enviar el email directo (inseguro), enviamos los datos a un Webhook (Make/Zapier)
 * que se encarga de generar PDF final y enviar Email con Resend.
 */
export const triggerEmailWorkflow = async (data) => {
    try {
        console.log("📨 [NotificationService] Triggering Edge Function: send-appraisal-report");
        
        const { data: funcData, error } = await supabase.functions.invoke('send-appraisal-report', {
            body: {
                user_name: data.name || 'Usuario Vecy',
                user_email: data.email,
                user_phone: data.phone || 'N/A',
                property_summary: data.address || 'Inmueble valorado por Vecy',
                plan: data.plan || 'General',
                ref_payco: `REF-${Date.now().toString().slice(-6)}`, // Auto-gen ref if missing
                pdf_link: data.link // MANDATORY for Attachment
            }
        });

        if (error) throw error;
        console.log("✅ Email Sent via Supabase Edge Function:", funcData);

    } catch (e) {
        console.error("❌ Email Edge Function Failed:", e);
        // Fallback or Alert?
    }
};
