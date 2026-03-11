-- 1. Tabla para llevar el conteo de solicitudes/tickets
CREATE TABLE IF NOT EXISTS counters (
    name TEXT PRIMARY KEY,
    current_value BIGINT DEFAULT 1000
);
-- Inicializar el contador de solicitudes si no existe
INSERT INTO counters (name, current_value)
VALUES ('solicitudes', 1000) ON CONFLICT (name) DO NOTHING;
-- 2. Función segura para obtener el siguiente ID
-- SECURITY DEFINER: Se ejecuta con permisos de admin, permitiendo a usuarios anonimos obtener ID sin darles acceso directo a la tabla.
CREATE OR REPLACE FUNCTION get_next_solicitud_id() RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE next_val BIGINT;
BEGIN -- Actualizar e incrementar atómicamente
UPDATE counters
SET current_value = current_value + 1
WHERE name = 'solicitudes'
RETURNING current_value INTO next_val;
RETURN next_val;
END;
$$;
-- 3. Crear Bucket para Reportes (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('reportes', 'reportes', true) ON CONFLICT (id) DO NOTHING;
-- Política de Storage: Permitir lectura pública de reportes
CREATE POLICY "Reportes Públicos" ON storage.objects FOR
SELECT USING (bucket_id = 'reportes');
-- Política de Storage: Permitir subida solo a usuarios autenticados (o anon con lógica backend)
-- En este caso, la Edge Function usará la Service Role Key, saltándose las políticas RLS, 
-- pero definimos una básica para el bucket.