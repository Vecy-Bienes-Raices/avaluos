# BITÁCORA DE ERRORES Y REPARACIONES (JanIA Project)
>
> Documento vivo para rastrear, evidenciar y exterminar bugs recurrentes.

## 🔴 ERRORES ACTIVOS (Prioridad Alta)

### 1. [UX/AI] Alucinación de Enlaces (Grave)

- **Síntoma:** JanIA muestra texto como `[Enlace a la Política...]` en lugar de un link clickeable real.
- **Causa:** El modelo ignora la instrucción de usar `/politicas` y genera su propio placeholder genérico.
- **Solución Propuesta:** Inyectar el link como una constante absoluta en el Prompt de Sistema ("SIEMPRE usa: ...").
- **ESTADO:** 🟢 COMPLETADO. Se inyectaron links absolutos (netlify.app) para Privacidad y Términos por separado.

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
