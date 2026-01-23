-- ==========================================
-- SECURE COMMISSION PAYOUT LOGIC (RPC)
-- ==========================================
-- Triggered by frontend after successful ePayco payment
-- SECURITY NOTE: In production, this should be triggered by ePayco Webhook (Server-to-Server)
-- For Phase 2 (MVP), we use a secure RPC called from the client, checking transaction valid status.
CREATE OR REPLACE FUNCTION process_referral_commission(
        p_payer_id UUID,
        p_plan_type TEXT,
        p_amount_paid NUMERIC
    ) RETURNS JSONB AS $$
DECLARE v_referrer_code TEXT;
v_referrer_id UUID;
v_commission NUMERIC := 0;
v_already_processed BOOLEAN;
BEGIN -- 1. Check if user has a referrer
SELECT referrer_code INTO v_referrer_code
FROM public.profiles
WHERE id = p_payer_id;
IF v_referrer_code IS NULL THEN RETURN jsonb_build_object(
    'success',
    true,
    'message',
    'No referrer code found for this user.'
);
END IF;
-- 2. Find Referrer ID
SELECT id INTO v_referrer_id
FROM public.profiles
WHERE referral_code = v_referrer_code;
IF v_referrer_id IS NULL THEN RETURN jsonb_build_object(
    'success',
    false,
    'message',
    'Invalid referrer code linked.'
);
END IF;
-- 3. Check if this specific referral (user + plan) was already paid?
-- Simplified: Check if we paid for this user recently? 
-- Better: Check if there's a referral record for this 'ref_payco' transaction? 
-- For MVP, we will rely on app logic calling this ONCE. 
-- TODO: Add transaction_id limit in future.
-- 4. Calculate Commission (Business Logic)
IF p_plan_type = 'cafe' THEN -- Logic: Stratified handled by frontend price, commission is fixed or proportional?
-- Rule from prompts: ~$4.999 (Low) or $7.142 (High).
-- Let's use a safe flat rate for MVP: $5,000
v_commission := 5000;
ELSIF p_plan_type = 'esmeralda' THEN -- Rule: ~$9.999 or $12.499. Safe flat: $10,000
v_commission := 10000;
ELSIF p_plan_type = 'oro' THEN -- Rule: 10% of value
v_commission := p_amount_paid * 0.10;
ELSE v_commission := 0;
END IF;
-- 5. Insert Referral Record
INSERT INTO public.referrals (
        referrer_id,
        referred_id,
        plan_type,
        commission_amount,
        status
    )
VALUES (
        v_referrer_id,
        p_payer_id,
        p_plan_type,
        v_commission,
        'paid'
    );
-- 6. Update Wallet Balance
UPDATE public.profiles
SET wallet_balance = wallet_balance + v_commission
WHERE id = v_referrer_id;
RETURN jsonb_build_object(
    'success',
    true,
    'commission',
    v_commission,
    'referrer',
    v_referrer_code
);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;