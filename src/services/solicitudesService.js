import { supabase } from '../lib/supabaseClient';

export const crearSolicitud = async (datos) => {
    try {
        const { data, error } = await supabase
            .from('solicitudes')
            .insert([
                {
                    created_at: new Date(),
                    ...datos
                }
            ])
            .select();

        if (error) {
            console.error('Error al crear solicitud en Supabase:', error);
            return null;
        }

        console.log('✅ Solicitud creada exitosamente:', data);
        return data[0]; // Retorna el objeto creado
    } catch (err) {
        console.error('Error inesperado al crear solicitud:', err);
        return null;
    }
};

export const obtenerMisSolicitudes = async (userId) => {
    if (!userId) return [];
    try {
        const { data, error } = await supabase
            .from('solicitudes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error al obtener solicitudes:', error);
            return [];
        }

        return data;
    } catch (err) {
        console.error('Error inesperado al obtener solicitudes:', err);
        return [];
    }
};

/**
 * SEGMENTO 7: El Botón Mágico de "Visto Bueno"
 * Ejecuta: Subida de PDF, Actualización DB, Notificación Chat
 */
export const approveAppraisal = async (appraisalId, allyId, pdfBlob) => {
    console.log("🚀 Iniciando Protocolo de Aprobación:", appraisalId);
    try {
        // 1. UPLOAD PDF TO STORAGE
        const fileName = `final_reports/${appraisalId}_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
            .from('appraisals')
            .upload(fileName, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (uploadError) throw new Error('Fallo subiendo PDF: ' + uploadError.message);

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('appraisals')
            .getPublicUrl(fileName);

        // 2. UPDATE APPRAISAL STATUS
        const { data: appraisal, error: dbError } = await supabase
            .from('appraisals')
            .update({
                status: 'completed',
                is_human_reviewed: true,
                final_report_url: publicUrl
            })
            .eq('id', appraisalId)
            // .eq('ally_id', allyId) // Security check (optional if trust UI)
            .select('chat_id, plan_type') // Need chat_id for notification
            .single();

        if (dbError) throw new Error('Fallo actualizando DB: ' + dbError.message);

        // 3. NOTIFY USER VIA CHAT (JanIA Injection)
        if (appraisal.chat_id) {
            const { data: chat } = await supabase
                .from('chats')
                .select('messages, metadata')
                .eq('id', appraisal.chat_id)
                .single();

            if (chat) {
                const newMessages = [...chat.messages, {
                    id: Date.now(),
                    role: 'assistant', // JanIA habla
                    type: 'bot',
                    text: `¡Listo, vecino! 🌟\n\nTu informe ya fue validado por nuestro experto.\n\nPuedes descargarlo aquí o verlo en tu perfil.`,
                    attachments: [{ name: 'Informe_Final_Vecy.pdf', url: publicUrl, preview: 'https://cdn-icons-png.flaticon.com/512/337/337946.png' }] // Mock icon
                }];

                await supabase
                    .from('chats')
                    .update({ 
                        messages: newMessages, 
                        updated_at: new Date()
                    })
                    .eq('id', appraisal.chat_id);
            }
        }

        return { success: true, url: publicUrl };

    } catch (error) {
        console.error("❌ Error en Aprobación:", error);
        return { success: false, error: error.message };
    }
};
