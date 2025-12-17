import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Static Data for the "Portales" Demo
const DEMO_DATA = {
    id: 'portales',
    cliente_nombre: 'Jani Alves Souza',
    cliente_fecha: '10 Diciembre 2025',
    direccion_inmueble: 'Carrera 65 # 167 - 18, Interior 6, Bogotá D.C.',
    ciudad: 'Bogotá',
    tipo_inmueble: 'Casa',
    area_privada: 72,
    valor_estimado_ia: 375000000,
    valor_final_avaluador: 375000000,
    estado: 'completado',
    // Extra fields for the template (mocked for now for dynamic rows)
    habitaciones: 4,
    banos: 2,
    parqueadero: 1,
    lat: 4.749, // Approx location
    lng: -74.062
};

export const useAvaluo = (id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvaluo = async () => {
            setLoading(true);
            try {
                // Scenario 1: Demo Page
                if (!id || id === 'portales') {
                    // Simulate network delay for "realism" or just instant
                    setData(DEMO_DATA);
                    setLoading(false);
                    return;
                }

                // Scenario 2: Supabase Data
                // Ensure id is a number (Supabase bigint)
                if (isNaN(id)) {
                    throw new Error('ID de avalúo inválido');
                }

                const { data: dbData, error: dbError } = await supabase
                    .from('solicitudes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (dbError) throw dbError;

                if (dbData) {
                    // Normalize DB data to match Template expectations
                    setData({
                        ...dbData,
                        cliente_fecha: new Date(dbData.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
                        valor_final_avaluador: dbData.valor_final_avaluador || dbData.valor_estimado_ia,
                        // Ensure numeric fields are numbers (Supabase might return strings for numeric types sometimes, but usually fine)
                        lat: dbData.latitud || 4.6097, // Fallback to Bogotá center if missing
                        lng: dbData.longitud || -74.0817
                    });
                } else {
                    throw new Error('Avalúo no encontrado');
                }

            } catch (err) {
                console.error('Error fetching avaluo:', err);
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAvaluo();
    }, [id]);

    return { data, loading, error };
};
