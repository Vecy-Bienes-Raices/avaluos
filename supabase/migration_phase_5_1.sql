-- MIGRATION: PHASE 5.1 LEGAL REFORM
-- PURPOSE: Add 'accepted_terms' to profiles to track user consent for RAG/Vectors.
-- 1. Add column if it doesn't exist
alter table public.profiles
add column if not exists accepted_terms boolean default false;
-- 2. Update RLS (Optional, but good practice to ensure users can update their own profile)
-- Assuming checking 'true' on the UI updates this row.
create policy "Users can update own profile terms" on public.profiles for
update to authenticated using (id = auth.uid()) with check (id = auth.uid());