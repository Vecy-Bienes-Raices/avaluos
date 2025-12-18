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
