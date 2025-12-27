# PROJECT STATUS: VECY AVALÚOS (La Verdad Inmediata)

> **ESTADO DEL PROYECTO: 🟢 OPERATIVO Y ESTABLE**
> *Última actualización: 27 de Diciembre, 2025*

## 1. Contexto Activo (Sprint Actual)

* **Objetivo Cumplido:** Restauración de Interfaz de Agente + Persistencia Real de Archivos.
* **Foco Actual:** Verificación funcional completa y limpieza de código.
* **Siguiente Paso:** Implementación de lógica de Dispatch (Asignación de Avaluadores) y reforzamiento de RLS.

## 2. Últimos 5 Cambios Críticos (¡LEER ANTES DE TOCAR CÓDIGO!)

1. **FIX CRÍTICO SINTAXIS:** Se reparó `JanIAAgent.jsx` (llaves de cierre faltantes y texto fantasma "Explain and Fix"). **NO AGREGAR CÓDIGO SIN VERIFICAR CIERRES DE LLAVES.**
2. **PERSISTENCIA SUPABASE:** La función `uploadChatFile` ya guarda archivos reales en el bucket `documents` usando el UUID del usuario.
3. **INTERFAZ RELOADED:** Se restauraron componentes perdidos (`PricingCards`, `ReactMarkdown`, `AuthOptions`) tras el fallo de sintaxis.
4. **MEMORIA DE CONTEXTO:** JanIA ahora reconoce archivos subidos y los integra en su memoria sin alucinaciones.
5. **INTELIGENCIA COLECTIVA (RAG):** Se implementó `ragService` y la conexión neuronal. JanIA ahora consulta la "Memoria Vectorial" antes de pensar.
6. **PUERTO 5701 BLINDADO:** Se configuró `package.json` para obligar el uso del puerto 5701.

## 3. Deuda Técnica / Alertas

* ⚠️ **Supervisión de Sintaxis:** Validar siempre que `JanIAAgent.jsx` termine correctamente con `export default JanIAAgent;` tras las ediciones.
* ⚠️ **RLS Supabase:** Si las subidas fallan en el futuro, verificar permisos de bucket primero.

## 4. Comandos Vitales

* `npm run dev` (Puerto 5701)
* Supabase Dashboard (Gestión de Buckets y Auth)
