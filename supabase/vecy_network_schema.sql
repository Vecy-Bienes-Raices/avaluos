-- ==========================================
-- VECY NETWORK DATABASE SCHEMA (PHASE 2)
-- ==========================================
-- 1. EXTEND PROFILES TABLE
-- Add columns to support the referral system and wallet
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS referrer_code TEXT;
-- Index for fast lookup of referral codes
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
-- 2. CREATE REFERRALS TABLE
-- Tracks every successful referral event (Sale)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES public.profiles(id) NOT NULL,
    -- Who invited
    referred_id UUID REFERENCES public.profiles(id) NOT NULL,
    -- Who bought
    plan_type TEXT NOT NULL,
    -- 'cafe', 'esmeralda', 'oro'
    commission_amount NUMERIC NOT NULL,
    -- Amount earned by referrer
    status TEXT DEFAULT 'pending',
    -- 'pending', 'paid', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index for queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
-- 3. CREATE PAYOUTS TABLE
-- Tracks cashout requests from users
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'requested',
    -- 'requested', 'processed', 'rejected'
    bank_info JSONB,
    -- Optional: to store snapshot of bank details
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
-- 4. FUNCTION TO GENERATE REFERRAL CODES
-- Generates a unique code like "JANIA-A1B2"
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TRIGGER AS $$
DECLARE new_code TEXT;
name_part TEXT;
BEGIN -- Extract first name or use clean default
IF NEW.full_name IS NOT NULL THEN name_part := UPPER(
    SUBSTRING(
        regexp_replace(NEW.full_name, '[^a-zA-Z]', '', 'g')
        FROM 1 FOR 4
    )
);
ELSE name_part := 'VECY';
END IF;
-- Generate random suffix and combine
-- Loop to ensure uniqueness (rare collision case)
LOOP new_code := name_part || '-' || UPPER(
    SUBSTRING(
        MD5(RANDOM()::TEXT)
        FROM 1 FOR 4
    )
);
BEGIN
UPDATE public.profiles
SET referral_code = new_code
WHERE id = NEW.id;
EXIT;
-- Exit loop if update succeeds (unique constraint satisfied)
EXCEPTION
WHEN unique_violation THEN -- Retry with new random suffix
END;
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 5. TRIGGER FOR NEW PROFILES
-- NOTE: In Supabase, usually profiles are created via a trigger on auth.users.
-- We need a trigger on profiles to generate the code AFTER insert if it doesn't exist.
-- Adjusting logic: The most robust way is to update the referral code on insert.
-- Trigger function to set it BEFORE INSERT or UPDATE if null
CREATE OR REPLACE FUNCTION set_referral_code() RETURNS TRIGGER AS $$
DECLARE new_code TEXT;
name_part TEXT;
done BOOLEAN := FALSE;
BEGIN IF NEW.referral_code IS NOT NULL THEN RETURN NEW;
END IF;
-- Extract part of name/email
IF NEW.full_name IS NOT NULL
AND LENGTH(NEW.full_name) > 0 THEN name_part := UPPER(
    SUBSTRING(
        regexp_replace(NEW.full_name, '[^a-zA-Z]', '', 'g')
        FROM 1 FOR 4
    )
);
ELSIF NEW.email IS NOT NULL THEN name_part := UPPER(
    SUBSTRING(
        regexp_replace(NEW.email, '[^a-zA-Z]', '', 'g')
        FROM 1 FOR 4
    )
);
ELSE name_part := 'VECY';
END IF;
-- Generate
WHILE NOT done LOOP new_code := name_part || '-' || UPPER(
    SUBSTRING(
        MD5(RANDOM()::TEXT)
        FROM 1 FOR 4
    )
);
-- Check uniqueness manually to avoid exception if possible, or just let unique constraint handle it in app
-- For trigger, we try to set it.
-- Simple heuristic:
NEW.referral_code := new_code;
done := TRUE;
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create Trigger
DROP TRIGGER IF EXISTS tr_set_referral_code ON public.profiles;
CREATE TRIGGER tr_set_referral_code BEFORE
INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_referral_code();
-- 6. BACKFILL EXISTING PROFILES
-- Run this once to generate codes for current users
DO $$
DECLARE rec RECORD;
new_c TEXT;
base_n TEXT;
BEGIN FOR rec IN
SELECT *
FROM public.profiles
WHERE referral_code IS NULL LOOP IF rec.full_name IS NOT NULL THEN base_n := UPPER(
        SUBSTRING(
            regexp_replace(rec.full_name, '[^a-zA-Z]', '', 'g')
            FROM 1 FOR 4
        )
    );
ELSE base_n := 'VECY';
END IF;
new_c := base_n || '-' || UPPER(
    SUBSTRING(
        MD5(RANDOM()::TEXT)
        FROM 1 FOR 4
    )
);
UPDATE public.profiles
SET referral_code = new_c
WHERE id = rec.id;
END LOOP;
END $$;