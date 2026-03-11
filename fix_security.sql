-- 🛡️ SCRIPT DE SEGURIDAD VECY AVALÚOS
-- Este script activa la seguridad RLS (Row Level Security) en las tablas marcadas en rojo.
-- Copia y Pega esto en el Editor SQL de Supabase y dale "Run".
-- 1. PROTEGER TABLA 'counters' (Contadores de visitas/turnos)
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
-- Política de Lectura (Pública): Permitir a todos ver contadores (para mostrar número de visitas)
CREATE POLICY "Public Read Counters" ON counters FOR
SELECT USING (true);
-- Política de Escritura (Service Role/Anon): Permitir actualizaciones (ej: incrementar contador)
-- Idealmente solo functions, pero anon para MVP suele necesitarlo si no hay edge functions. 
-- *Mejor* : Solo Service Role si la lógica es server-side. Si es client-side increment, anon.
-- Asumimos client-side increment via RPC o directo por ahora:
CREATE POLICY "Public Increment Counters" ON counters FOR
UPDATE USING (true);
-- 2. PROTEGER TABLA 'payouts' (Pagos a Referidos)
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
-- Política de Lectura: Solo el usuario dueño puede ver sus pagos
-- Asume que hay un campo 'user_id' o 'wallet_id' vinculado. 
-- Si no hay user_id standard, limitamos a Service Role (Admin).
CREATE POLICY "Admin View Payouts" ON payouts FOR
SELECT TO service_role USING (true);
-- Si el usuario necesita verlos, descomentar y ajustar campo:
-- CREATE POLICY "User View Own Payouts" ON payouts FOR SELECT USING (auth.uid() = user_id);
-- 3. PROTEGER TABLA 'referrals' (Red de Referidos)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
-- Política de Lectura: Public o User?
-- Referidos suelen ser data semi-privada.
CREATE POLICY "User View Own Referrals" ON referrals FOR
SELECT USING (auth.uid() = referrer_id);
-- Permitir inserción abierta (Registro de referidos)
CREATE POLICY "Public Create Referral" ON referrals FOR
INSERT WITH CHECK (true);
-- Permitir lectura pública de códigos (si se necesita validar 'referred_by')
CREATE POLICY "Public Validate Referral Code" ON referrals FOR
SELECT USING (true);
-- 4. CONFIRMACIÓN
SELECT 'Seguridad Activada Correctamente 🚀' as status;