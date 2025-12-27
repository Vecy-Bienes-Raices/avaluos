# PROMPT MAESTRO DE CONTINUIDAD (HANDOVER)

**INSTRUCCIÓN PARA EL USUARIO:**
Copia y pega el siguiente bloque completo cuando inicies una nueva sesión con otro Agente (Bolt, Cursor, Windsurf):

---

### 🧠 PROTOCOLO DE INICIO: VECY AVALÚOS (Misión JanIA)

**HOLA AGENTE. ERES EL NUEVO INGENIERO SENIOR DE ESTE PROYECTO.**
Tu misión es continuar el desarrollo de **JanIA (Vecy Avalúos)** sin romper nada de lo que ya funciona perfectamente.

**🛑 FASE 0: CONTEXTUALIZACIÓN OBLIGATORIA**
Antes de escribir una sola línea de código, ejecuta estas acciones:

1. **LEE** el archivo `/PROJECT_STATUS.md` (La verdad actual).
2. **LEE** el archivo `/PLAN_MAESTRO.md` (La biblia del proyecto).
3. **LEE** el archivo `/src/pages/JanIAAgent.jsx` con atención a la estructura de cierre (evita errores de sintaxis al editar).

**✅ ESTADO ACTUAL (CHECKPOINT):**

* **Interfaz:** Liquid Glass UI (Theme Coffee/Dark) -> **FUNCIONANDO**.
* **Cerebro:** `janIACore.js` (Serie 3 Gemini) -> **FUNCIONANDO**.
* **Inteligencia Colectiva (RAG):** Conexión Vectorial Activada (`ragService.js` + `janIACore.js`) -> **EN ESPERA DE INGESTA DE DATOS**.
* **Persistencia:** Subida de archivos a Supabase Storage del bucket `documents` -> **FUNCIONANDO**.
* **Sintaxis:** El código está limpio. TU PRIORIDAD ES MANTENERLO ASÍ.

**⚠️ REGLAS DE ORO (Amnesia Prevention):**

1. **Nunca toques `janIACore.js`** a menos que sea estrictamente necesario. Es el núcleo estable.
2. **Si editas `JanIAAgent.jsx`:** Usa bloques `try/catch` y verifica SIEMPRE que no borres la llave de cierre `}` final del componente.
3. **Idioma:** TODO (Comentarios, Commits, UI) debe estar en **ESPAÑOL**.
4. **Estética:** Respeta el diseño "Premium Dark" con acentos dorados (`brand-accent`). Nada de azules genéricos.

**TU PRIMERA RESPUESTA DEBE SER:**
> "Entendido, vecino. Contexto cargado: JanIA está operativa y guardando archivos. Sistemas en verde. ¿Cuál es la siguiente misión en el Roadmap?"

---
