-- MIGRATION PHASE 6 (DEFINITIVE): Plans, Legal Validity, and Roles
-- Author: JanIA Engineer
-- Date: 2025-12-29
-- Context: 
-- Plan ORO = Certified RAA (Legal Validity).
-- Plan ESMERALDA = Human Review (No Legal Validity).
-- Plan CAFE = Digital Survey (Free).
-- 1. UPDATE PROFILES TABLE
-- Roles: admin, client, ally (validador)
DO $$ BEGIN -- Políticas aceptadas (para no preguntar siempre)
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'policies_accepted'
) THEN
ALTER TABLE public.profiles
ADD COLUMN policies_accepted BOOLEAN DEFAULT false;
END IF;
-- Número RAA (Solo Aliados/Peritos)
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'raa_number'
) THEN
ALTER TABLE public.profiles
ADD COLUMN raa_number TEXT;
END IF;
-- Verificación de Aliado
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'is_verified'
) THEN
ALTER TABLE public.profiles
ADD COLUMN is_verified BOOLEAN DEFAULT false;
END IF;
-- Verificar Rol (Si no existe, se crea con default client)
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
        AND column_name = 'role'
) THEN
ALTER TABLE public.profiles
ADD COLUMN role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client', 'ally'));
END IF;
END $$;
-- 2. CREATE APPRAISALS TABLE (Pedidos / Servicios)
CREATE TABLE IF NOT EXISTS public.appraisals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- Relaciones
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ally_id UUID REFERENCES public.profiles(id) ON DELETE
    SET NULL,
        -- Asignado a Perito/Aliado (NULL si es Café)
        -- Definición del Plan
        plan_type TEXT NOT NULL CHECK (plan_type IN ('cafe', 'esmeralda', 'oro')),
        -- BLINDAJE LEGAL & CERTIFICACIÓN
        -- Solo Plan ORO debe tener estos en TRUE
        is_certified_raa BOOLEAN DEFAULT false,
        -- ¿Tiene firma RAA?
        has_legal_validity BOOLEAN DEFAULT false,
        -- ¿Es válido ante jueces/bancos?
        -- REVISIÓN HUMANA
        -- Plan Esmeralda y Oro requieren esto
        requires_human_review BOOLEAN DEFAULT false,
        -- Económico
        total_price NUMERIC DEFAULT 0,
        -- 0 para Café, Valor calculado para otros
        -- Estado del servicio
        status TEXT DEFAULT 'pending' CHECK (
            status IN (
                'pending',
                'processing',
                'completed',
                'cancelled',
                'payment_failed'
            )
        )
);
-- 3. INDEXES & RLS
CREATE INDEX IF NOT EXISTS idx_appraisals_client ON public.appraisals(client_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_ally ON public.appraisals(ally_id);
ALTER TABLE public.appraisals ENABLE ROW LEVEL SECURITY;
-- Clientes ven sus propios avalúos
CREATE POLICY "Clients can view own appraisals" ON public.appraisals FOR
SELECT USING (auth.uid() = client_id);
-- Clientes pueden crear pedidos
CREATE POLICY "Clients can create appraisal requests" ON public.appraisals FOR
INSERT WITH CHECK (auth.uid() = client_id);
-- Aliados ven los asignados
CREATE POLICY "Allies can view assigned appraisals" ON public.appraisals FOR
SELECT USING (auth.uid() = ally_id);