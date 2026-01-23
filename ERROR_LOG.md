# BITÁCORA DE ERRORES Y REPARACIONES (JanIA Project)
>
> Documento vivo para rastrear, evidenciar y exterminar bugs recurrentes.

## 🔴 ERRORES ACTIVOS (Prioridad Alta)

### 1. [CRÍTICO] ePayco "Amount Type" Error

- **Síntoma:** El modal de pago mostraba un error o cargaba infinito al intentar procesar pagos con miles (ej. 50.000).
- **Causa:** La API de ePayco recibía el monto como string formateado ("$50.000") en lugar de un número entero limpio.
- **Solución:** Se implementó limpieza estricta: `Number(str.replace(/[^0-9.-]+/g, ""))`.
- **ESTADO:** 🟢 SOLUCIONADO (Deep Intervention).

### 2. [UX] Amnesia de Invitado a Usuario

- **Síntoma:** Al registrarse, JanIA olvidaba lo que el usuario le había contado como invitado.
- **Causa:** El proceso de `updateUserIdentity` reseteaba el historial o no fusionaba el contexto.
- **Solución:** Implementación de "Brain Sync" en `janIACore.js`.
- **ESTADO:** 🟢 SOLUCIONADO. Historial unificado.

### 3. [UX] Ceguera Temporal (Vision Loss)

- **Síntoma:** JanIA "veía" la imagen en el turno 1, pero si el usuario preguntaba algo en el turno 2, decía "no veo ninguna imagen".
- **Solución:** Implementación de `vision_buffer` permanente en la clase Core.
- **ESTADO:** 🟢 SOLUCIONADO.

### 2. [DEV/React] "Ghost Syntax" por Inyección Markdown (Crítico)

- **Síntoma:** Error `Unterminated JSX contents` o `Module declaration...` en `Perfil.jsx` sin causa aparente en la lógica.
- **Causa:** El asistente insertó bloques de código markdown (```javascript) DIRECTAMENTE dentro del archivo `.jsx` durante una edición automatizada, corrompiendo la sintaxis.
- **Solución:**
  1. Limpieza manual y profunda del archivo.
  2. Implementación de `GlassAvatar` para reemplazar bloques de imagen antiguos.
- **ESTADO:** 🟢 COMPLETADO. Archivo reescrito y verificado.

### 3. [UX/Flow] Interrogatorio Robótico

- **Síntoma:** JanIA pide 4 datos a la vez (Tipo, Dirección, Área, Estrato). Cuando el usuario da uno, vuelve a pedir los otros 3 mecánicamente.
- **Causa:**
  1. Condición de carrera (`Race Condition`) en auto-save.
  2. **BLOQUEO SILENCIOSO DE RLS:** La política de Supabase permitía `INSERT` pero bloqueaba `DELETE` silenciosamente (retornaba `count: 0` sin error).
- **Solución:**
  1. Implementación de "Atomic Resets" (`crypto.randomUUID()`).
  2. Implementación de nueva política RLS: `Users can delete own chats`.
  3. Validación estricta en código: Si `count === 0` -> Lanzar Error.
- **ESTADO:** 🟢 COMPLETADO Y VERIFICADO. Eliminación real confirmada.

### 3. [SYS] Inteligencia Superficial ("Bot Tonto")

- **Síntoma:** El análisis de archivos es pobre o genérico.
- **Acción:** Se activó "Protocolo de Súper-Inteligencia" en el Prompt.
  - Extracción profunda (Matrículas, Coeficientes, Acabados).
  - Lógica Matemática (Precio/m2).
  - Auto-aprendizaje de contexto.

---

## 🟢 REPARACIONES COMPLETADAS (Histórico)

- [x] **Fuga de JSON:** Se eliminó la salida de código `{...}` en el chat.
- [x] **Flickering UI:** Se estabilizó el Avatar Header (eliminados filtros pesados).
- [x] **Persistencia:** Conexión establecida con Supabase (Storage/DB).
- [x] **Enlaces Reales:** Privacidad y Términos ahora apuntan a las URLs de producción.

---

## 🛠️ PRÓXIMA INTERVENCIÓN TÉCNICA

- Monitoreo de la capacidad de extracción de datos de JanIA con documentos complejos.

### 4. [LOGIC/Async] Race Condition en Historial

- **Síntoma:** El historial no mostraba el último chat inmediatamente.
- **Causa:** La petición `getUserChats` se disparaba antes de que `saveChatToHistory` (Supabase) completara su escritura.
- **Solución:** Se añadió `await` estricto en el guardado antes de refrescar el estado.
- **ESTADO:** 🟢 SOLUCIONADO. Sincronización perfecta.

### 5. [API/Model] 'Mensaje sin contenido' (Gemini 3 Validation)

- **Síntoma:** El chat mostraba "Mensaje sin contenido" inmediatamente después de activar los modelos Gemini 3.
- **Causa:** Los modelos `gemini-3-pro-preview` requieren una "Thought Signature" (firma de pensamiento) en el retorno de las llamadas de función para validar la consistencia del razonamiento. Al no enviarla, la API rechazaba la respuesta, resultando en texto vacío.
- **Solución:** Implementación del protocolo `thought_signature` en `prompts.js` y `janIACore.js` para pasar explícitamente el hash de razonamiento entre Cortex y Reflex.
- **ESTADO:** 🟢 SOLUCIONADO.

### 6. [LOGIC] JanIA Lost / JSON Parse Error

- **Síntoma:** JanIA dejaba de responder o se "perdía" en el flujo cuando Cortex generaba un JSON inválido.
- **Causa:** Falta de manejo de errores en `_activateCortex`.
- **Solución:** Se implementó un `SAFE PLAN` de contingencia en `janIACore.js`.
- **ESTADO:** 🟢 SOLUCIONADO. Recuperación automática.
