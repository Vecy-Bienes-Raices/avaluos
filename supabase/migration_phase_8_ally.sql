-- MIGRATION PHASE 8: Ally Workflow & Chat Integration
-- Author: JanIA Engineer
-- Date: 2025-12-29
-- Context: Enable 'Visto Bueno' flow and link appraisals to chats for notifications.
-- 1. ADD COLUMNS TO APPRAISALS
ALTER TABLE public.appraisals
ADD COLUMN IF NOT EXISTS is_human_reviewed BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS review_notes TEXT,
    ADD COLUMN IF NOT EXISTS chat_id UUID;
-- Direct link to the conversation
-- 2. INDEX FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appraisals_chat ON public.appraisals(chat_id);
-- 3. STORAGE FOR REPORTS (If not exists)
-- We need a bucket 'appraisals' for final PDF reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('appraisals', 'appraisals', true) ON CONFLICT (id) DO NOTHING;
-- Policy: Allies can upload reports
CREATE POLICY "Allies can upload reports" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (
        bucket_id = 'appraisals'
        AND (
            auth.role() = 'service_role'
            OR auth.uid() IN (
                SELECT id
                FROM public.profiles
                WHERE role = 'ally'
                    OR role = 'admin'
            )
        )
    );
-- Policy: Users can read their own reports
CREATE POLICY "Users can read own reports" ON storage.objects FOR
SELECT TO authenticated USING (bucket_id = 'appraisals');
-- Simplified (Real prod needs path match owner)