-- Add final_report_url column to appraisals table if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'appraisals'
        AND column_name = 'final_report_url'
) THEN
ALTER TABLE public.appraisals
ADD COLUMN final_report_url TEXT;
END IF;
END $$;