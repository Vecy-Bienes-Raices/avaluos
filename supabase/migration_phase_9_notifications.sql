-- MIGRATION PHASE 9: Notification Triggers
-- Context: Connect appraisals table changes to the Edge Function 'notify-ally'.
-- 1. Enable pg_net extension (Required to make HTTP requests from SQL)
CREATE EXTENSION IF NOT EXISTS pg_net;
-- 2. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.fn_notify_ally_on_assignment() RETURNS TRIGGER AS $$ BEGIN -- Check conditions: Status waiting_ally AND Plan Oro AND Ally Assigned
    IF NEW.status = 'waiting_ally'
    AND NEW.plan_type = 'oro'
    AND NEW.ally_id IS NOT NULL THEN -- Make HTTP POST request to the Edge Function
    -- REPLACE [YOUR_PROJECT_REF] with your actual Supabase Project Reference
    -- REPLACE [ANON_KEY] or [SERVICE_ROLE_KEY] with your key
    PERFORM net.http_post(
        url := 'https://[YOUR_PROJECT_REF].supabase.co/functions/v1/notify-ally',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}',
        body := json_build_object(
            'record',
            row_to_json(NEW),
            'old_record',
            row_to_json(OLD),
            'type',
            TG_OP
        )::text
    );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 3. Create the Trigger
DROP TRIGGER IF EXISTS tr_notify_ally ON public.appraisals;
CREATE TRIGGER tr_notify_ally
AFTER
INSERT
    OR
UPDATE ON public.appraisals FOR EACH ROW EXECUTE FUNCTION public.fn_notify_ally_on_assignment();
/* 
 INSTRUCCIONES DE DESPLIEGUE (EJECUTAR EN TERMINAL):
 1. Login: npx supabase login
 2. Deploy: npx supabase functions deploy notify-ally
 3. Secrets: npx supabase secrets set ONESIGNAL_APP_ID=tu_app_id ONESIGNAL_API_KEY=tu_api_key
 */