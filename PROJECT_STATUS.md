# PROJECT STATUS: VECY AVALÚOS (La Verdad Inmediata)

> **ESTADO DEL PROYECTO: 🟢 LISTO PARA PRODUCCIÓN (GOLD)**
> *Última actualización: 30 de Diciembre, 2025 (Deep Intervention)*

## 1. Contexto Activo (Sprint Actual)

* **Objetivo Cumplido:** Sidebar UI, Fix de Historial y Estrategia de Leads.
* **Foco Actual:** DESPLIEGUE FINAL (Netlify).
* **Siguiente Paso:** Monitoreo de producción.

## 2. Últimos 5 Cambios Críticos (¡LEER ANTES DE TOCAR CÓDIGO!)

1. **JanIA Brain Sync:** Unificación de memoria Invitado -> Usuario. El historial ya no se pierde al loguearse.
2. **Permanent Vision:** Implementación de Buffer Visual. JanIA recuerda y "ve" los documentos adjuntos en cada turno.
3. **ePayco Hard Fix:** Sanitización estricta de montos (`Number()`) para evitar el error de "String with dots".
4. **Onboarding Script:** Estandarización del saludo inicial para solicitar enlaces/documentos proactivamente.
5. **Sidebar Polish:** Modo Incógnito con íconos oscuros y standarización visual.
6. **Smart PDF Generator PRO:** Backend (FastAPI) + Frontend implementation for Plan Esmeralda reports.
7. **Global Modals System:** Replaced native alerts with a premium Glass UI modal system.
8. **Vecy Network V2.1 (Unlimited Model):** Pivoted from "Free Appraisal" to "Unlimited Earnings". Implemented detailed commission breakdown in Dashboard.
9. **Smart Pricing Overlay:** interactive "Stratum Selector" inside `PricingCards.jsx` ensures accurate billing ($29k vs $49k) without page reloads.
10. **Referral Auto-Gen:** Robust fallback in `Perfil.jsx` to auto-generate and save referral codes for legacy users (Fixes "Generando...").
11. **Dynamic Chat Titling:** Integrated `gemini-3-flash` to generate contextual chat titles in Sidebar history.
12. **Dashboard Cashout Fix:** Restored `handleCashout` function in `Perfil.jsx` (`showModal`).
13. **Anti-Tech UX (Child-Proof):** Implemented explicit "Select Stratum" buttons and "Direct WhatsApp Share" in Dashboard, removing copy-paste friction and ambiguity.
14. **Business Vision UI:** Deployed premium "Network Marketing" section in `/planes`. Visualizes commissions, break-even point (6 refs), and legacy income to recruit affiliates.
15. **Visual Polish:** Refactored `GlassAvatar` component to ensure profile pictures fill the circular container perfectly (0% gap), improving UI elegance.
16. **Interactive Image Cropper:** Evolved the Avatar solution. Implemented a WhatsApp-style Cropper Modal (`react-easy-crop`). Users can now zoom, drag, and fit their photo perfectly inside the circle before uploading. The ultimate fix for "gap" issues.
17. **Standardized Chat Titles:** Strict "Code + Address" format enforced (e.g. "AP KRA 96 # 73-49"). AI now detects property type (AP, CA, LT) and address to generate clean, organized record titles automatically.

## 3. Deuda Técnica / Alertas

* ⚠️ **Supervisión de Sintaxis:** Validar siempre que `JanIAAgent.jsx` termine correctamente con `export default JanIAAgent;` tras las ediciones.
* ⚠️ **RLS Supabase:** Si las subidas fallan en el futuro, verificar permisos de bucket primero.

## 4. Comandos Vitales

* `npm run dev` (Puerto 5701)
* Supabase Dashboard (Gestión de Buckets y Auth)
