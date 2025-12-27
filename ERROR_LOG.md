# BITÁCORA DE ERRORES Y REPARACIONES (JanIA Project)
>
> Documento vivo para rastrear, evidenciar y exterminar bugs recurrentes.

## 🔴 ERRORES ACTIVOS (Prioridad Alta)

### 1. [UX/AI] Alucinación de Enlaces (Grave)

- **Síntoma:** JanIA muestra texto como `[Enlace a la Política...]` en lugar de un link clickeable real.
- **Causa:** El modelo ignora la instrucción de usar `/politicas` y genera su propio placeholder genérico.
- **Solución Propuesta:** Inyectar el link como una constante absoluta en el Prompt de Sistema ("SIEMPRE usa: ...").
- **ESTADO:** 🟢 COMPLETADO. Se inyectaron links absolutos (netlify.app) para Privacidad y Términos por separado.

### 2. [UX/Flow] Interrogatorio Robótico

- **Síntoma:** JanIA pide 4 datos a la vez (Tipo, Dirección, Área, Estrato). Cuando el usuario da uno, vuelve a pedir los otros 3 mecánicamente.
- **Causa:** El prompt de "Recopilar datos" es demasiado agresivo y trata de llenar todos los campos faltantes en un solo turno.
- **Solución Propuesta:** Regla de "UNA PREGUNTA A LA VEZ". Si falta info, pedir solo la siguiente más crítica (Dirección), no toda la lista.
- **ESTADO:** 🟢 COMPLETADO. Prompt ajustado a "Interacción Uno a Uno".

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
