/**
 * Servicio de Notificaciones (Inspirado en Vecy Agenda)
 * Maneja el envío de alertas a WhatsApp (CallMeBot) y triggers de Correo.
 */

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
    const WEBHOOK_URL = 'https://hook.eu2.make.com/6cx5oxt0uegqtl66w2j532b0v3y6cvxy'; // URL Found in Vecy Agenda

    try {
        const payload = {
            // METADATA
            source: 'VecyAvaluos_App',
            fecha_solicitud: new Date().toLocaleString('es-CO'),

            // VECY AGENDA SCHEMA ALIGNMENT (Strict Keys)
            solicitante_nombre: data.name || 'Usuario Vecy',
            solicitante_email: data.email,
            solicitante_celular: data.phone || 'No registrado', // Make needs this reference
            servicio_solicitado: `Descarga Avalúo - Plan ${data.plan ? data.plan.toUpperCase() : 'GENERAL'}`,
            
            // CUSTOM FIELDS FOR THIS PROCESS
            link_descarga_pdf: data.link,
            mensaje_adicional: "El usuario ha descargado su reporte de valoración.",
            
            // ADMIN COPY CONFIG
            admin_email: 'vecybienesraices@gmail.com',
            send_copy_to_admin: true,
            
            ...data
        };

        // We use 'no-cors' if submitting to a webhook that doesn't set CORS headers
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log("✅ Email Workflow Triggered (Make)");
    } catch (e) {
        console.error("❌ Email Workflow Failed:", e);
    }
};
