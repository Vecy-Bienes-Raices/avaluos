# HANDOVER PROMPT: VECY AVALÚOS (GOLD CANDIDATE)

**Current State:** 🟢 STABLE / GOLD CANDIDATE
**Last Sprint Goal:** Smart PDF Generator, 2026 Pricing, Global Modals.

## 🚨 CRITICAL CONTEXT FOR NEXT AGENT

1. **Hybrid Architecture (Frontend + Backend):**
    * **Frontend:** React (Vite) runs on `http://localhost:5701` (Use `npm run dev`).
    * **Backend:** Python (FastAPI) runs on `http://0.0.0.0:8000` (Use `python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload`).
    * **IMPORTANT:** Both servers MUST be running for the application to work fully (specifically PDF generation).

2. **Global Modals System (NEW):**
    * Native `alert()` is BANNED.
    * Use `import { useModal } from '../context/ModalContext'` and `const { showModal } = useModal()`.
    * Example: `showModal({ title: 'Hi', message: 'Msg', type: 'success' })`.

3. **PDF Generation:**
    * Located in `backend/pdf_generator.py`.
    * Uses `FPDF2` and `Matplotlib`.
    * Endpoint: `POST http://localhost:8000/generate-pdf/`.

4. **2026 Pricing:**
    * `SMMLV_2026` = $1,750,905.
    * Logic is mirrored in `src/services/pricingService.js` AND `backend/pricing_logic.py`. Keep them strictly synchronized.

5. **Supabase Policies:**
    * If "Bucket not found" errors appear, run `fix_avatars_bucket_v2.sql`.

## 📌 IMMEDIATE NEXT STEPS

1. **Deployment:** Configure production build and environment variables.
2. **Stress Testing:** Verify PDF generation with multiple concurrent requests.
3. **Mobile Polish:** Check font sizes and padding on small screens (GlassAvatar specifically).

---
*Maintain the "Premium Glass" aesthetic and the "Vecina JanIA" personality at all costs.*
