-- MIGRATION PHASE 7: Pricing Automation
-- Author: JanIA Engineer
-- Date: 2025-12-29
-- Context: Automate total_price calculation based on Plan Type and Property Area.
-- 1. ADD PROPERTY_AREA TO APPRAISALS
-- Necessary for the pricing formula: (area * 2000)
ALTER TABLE public.appraisals
ADD COLUMN IF NOT EXISTS property_area NUMERIC DEFAULT 0;
-- 2. CREATE PRICING FUNCTION
CREATE OR REPLACE FUNCTION public.fn_calculate_total_price() RETURNS TRIGGER AS $$ BEGIN -- Lógica de Precios
    -- Plan CAFÉ: Siempre Gratis (0)
    IF NEW.plan_type = 'cafe' THEN NEW.total_price := 0;
-- Plan ESMERALDA: (Area * 2000) + 50.000
ELSIF NEW.plan_type = 'esmeralda' THEN -- Validación básica para evitar nulls
IF NEW.property_area IS NULL
OR NEW.property_area < 0 THEN NEW.property_area := 0;
END IF;
NEW.total_price := (NEW.property_area * 2000) + 50000;
-- Plan ORO: (Area * 2000) + 50.000 + 250.000
-- Total Fixed: 300.000
ELSIF NEW.plan_type = 'oro' THEN IF NEW.property_area IS NULL
OR NEW.property_area < 0 THEN NEW.property_area := 0;
END IF;
NEW.total_price := (NEW.property_area * 2000) + 300000;
END IF;
-- RETURN NEW row with updated price
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 3. CREATE TRIGGER
-- Executes BEFORE INSERT to set the price automatically
DROP TRIGGER IF EXISTS tr_set_appraisal_price ON public.appraisals;
CREATE TRIGGER tr_set_appraisal_price BEFORE
INSERT
    OR
UPDATE ON public.appraisals FOR EACH ROW EXECUTE FUNCTION public.fn_calculate_total_price();