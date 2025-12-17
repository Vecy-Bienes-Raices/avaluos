-- MIGRATION: V2 - Expand 'solicitudes' table for Full Appraisal Report
-- Run this in your Supabase SQL Editor
-- UPDATED: Using 'IF NOT EXISTS' to prevent errors if you run it multiple times.
-- 1. Add Location & Context Fields
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS ciudad TEXT DEFAULT 'Bogotá';
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS barrio TEXT DEFAULT 'N/A';
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS latitud DOUBLE PRECISION DEFAULT 4.6097;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS longitud DOUBLE PRECISION DEFAULT -74.0817;
-- 2. Add Physical Metrics
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS area_construida NUMERIC DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS habitaciones INT DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS banos INT DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS parqueadero INT DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS estrato INT DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS edad_inmueble INT DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS valor_administracion NUMERIC DEFAULT 0;
-- 3. Add Financial/Market Fields
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS valor_oferta_propietario NUMERIC DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS valor_avaluo_catastral NUMERIC DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS rentabilidad_estimada NUMERIC DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS rango_valor_mercado_min NUMERIC DEFAULT 0;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS rango_valor_mercado_max NUMERIC DEFAULT 0;
-- 4. Add complex JSONB fields for flexibility (Details, Gallery, Legal)
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS distribucion_espacial JSONB DEFAULT '[]'::jsonb;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS estado_juridico JSONB DEFAULT '{}'::jsonb;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS acabados_estructura JSONB DEFAULT '[]'::jsonb;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS amenidades_conjunto JSONB DEFAULT '[]'::jsonb;
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS galeria_imagenes JSONB DEFAULT '[]'::jsonb;
-- 5. Add a TEST ROW with rich data (similar to Portales demo)
INSERT INTO solicitudes (
        cliente_nombre,
        direccion_inmueble,
        ciudad,
        barrio,
        tipo_inmueble,
        latitud,
        longitud,
        area_privada,
        area_construida,
        habitaciones,
        banos,
        parqueadero,
        estrato,
        edad_inmueble,
        valor_administracion,
        valor_oferta_propietario,
        valor_avaluo_catastral,
        valor_estimado_ia,
        valor_final_avaluador,
        rentabilidad_estimada,
        distribucion_espacial,
        estado_juridico,
        acabados_estructura,
        galeria_imagenes,
        estado
    )
VALUES (
        'Andrea López',
        'Carrera 7 # 127-45',
        'Bogotá',
        'Bella Suiza',
        'Apartamento',
        4.707,
        -74.032,
        85,
        92,
        3,
        2,
        1,
        5,
        12,
        450000,
        650000000,
        320000000,
        620000000,
        635000000,
        0.7,
        '[
        {"label": "Zona Social", "text": "Sala comedor con balcón, vista exterior"},
        {"label": "Habitaciones", "text": "3 alcobas, principal con vestier y baño privado"},
        {"label": "Cocina", "text": "Cerrada, integral, con zona de ropas independiente"}
    ]',
        '{
        "propietario": "Andrea López",
        "matricula": "50N-202345",
        "chip": "AAA123BC",
        "saneado": true
    }',
        '[
        {"label": "Pisos", "status": "Excelente", "detalle": "Madera Laminada"},
        {"label": "Cocina", "status": "Bueno", "detalle": "Mesón Granito"}
    ]',
        '["/1.jpeg", "/2.jpeg", "/3.jpeg"]',
        'completado'
    );