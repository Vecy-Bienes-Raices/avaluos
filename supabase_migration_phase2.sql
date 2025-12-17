-- MIGRATION PHASE 2: Roles, Profiles, and Expanded Property Data
-- 1. Create PROFILES table (Linked to Auth)
-- This table extends the default Supabase 'auth.users' table to store custom data.
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text,
    full_name text,
    phone text,
    role text default 'client' check (role in ('client', 'valuer', 'admin')),
    is_verified boolean default false,
    -- For Valuers (RAA Certification)
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
-- 2. Enable RLS (Row Level Security) on Profiles
alter table public.profiles enable row level security;
-- Policy: Users can see their own profile
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
-- Policy: Users can update their own profile
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
-- 3. Automatic Trigger for New Users
-- When a user signs up (Google/FB/Email), automatically create a row in 'profiles'.
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, email, full_name, role)
values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        'client'
    );
return new;
end;
$$ language plpgsql security definer;
-- Trigger execution
create or replace trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
-- 4. Expand 'solicitudes' Table for new requirements
alter table public.solicitudes
add column if not exists source_url text,
    -- To store the pasted URL (e.g., netlify app)
add column if not exists acabados_detalles jsonb default '{}'::jsonb,
    -- Detailed specific finishes (Quality, State)
add column if not exists documentos_estado jsonb default '{
    "escrituras": false, 
    "certificado_libertad": false, 
    "predial": false
}'::jsonb;
-- To track which docs have been uploaded via the Clip 📎
-- 5. Valuer Specific Fields (Uber Model)
alter table public.solicitudes
add column if not exists avaluador_asignado_id uuid references public.profiles(id),
    -- Who is working on it?
add column if not exists comision_plataforma numeric default 30.0;
-- % we keep (30%)