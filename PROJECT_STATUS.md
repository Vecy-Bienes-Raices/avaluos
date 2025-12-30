# PROJECT STATUS: VECY AVALÚOS (La Verdad Inmediata)

> **ESTADO DEL PROYECTO: 🟢 OPERATIVO Y ESTABLE (GOLD CANDIDATE)**
> *Última actualización: 29 de Diciembre, 2025*

## 1. Contexto Activo (Sprint Actual)

* **Objetivo Cumplido:** Ecosistema Completo (Perfil + Precios + Persistencia Blindada).
* **Foco Actual:** Verificación visual final (Mobile typography & Glass variants).
* **Siguiente Paso:** Despliegue a Producción y Pruebas de Carga.

## 2. Últimos 5 Cambios Críticos (¡LEER ANTES DE TOCAR CÓDIGO!)

1. **Smart PDF Generator PRO:** Backend (FastAPI) + Frontend implementation for Plan Esmeralda reports.
2. **2026 Pricing Update:** Updated logic for new SMMLV ($1,750,905) and Plan Oro rules.
3. **Global Modals System:** Replaced native alerts with a premium Glass UI modal system.
4. **Secure Avatar Upload:** Fixed RLS policies and implemented modal feedback for uploads.
5. **PROTOCOL ANTI-ZOMBIE:** Solución a resurrección de chats borrados (Atomic Resets).
6. **MOTOR DE PRECIOS:** Tarifas dinámicas en tiempo real.
7. **PERFIL DE USUARIO:** Nueva ruta `/perfil` con historial y descargas.
8. **VECY THEME:** Sistema de diseño centralizado (`src/theme/VecyTheme.js`).

## 3. Deuda Técnica / Alertas

* ⚠️ **Supervisión de Sintaxis:** Validar siempre que `JanIAAgent.jsx` termine correctamente con `export default JanIAAgent;` tras las ediciones.
* ⚠️ **RLS Supabase:** Si las subidas fallan en el futuro, verificar permisos de bucket primero.

## 4. Comandos Vitales

* `npm run dev` (Puerto 5701)
* Supabase Dashboard (Gestión de Buckets y Auth)
