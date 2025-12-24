# PLAN MAESTRO: VECY AVALÚOS (Proyecto JanIA)

> [!IMPORTANT]
> **META-INSTRUCCIÓN PARA CUALQUIER AGENTE IA:**
>
> 1. **ESTE ARCHIVO ES LA LEY.** Antes de escribir una sola línea de código, DEBES leer y entender este documento completo.
> 2. **NO IMPROVISES.** Si tu tarea contradice este plan, DETENTE y pide confirmación al usuario.
> 3. **MANTÉN EL RUMBO.** Verifica en qué Fase estamos (Sección 3) y no saltes a tareas futuras sin completar las actuales.
> 4. **ACTUALIZA.** Si logras un hito importante, marca el checklist aquí. Mantén este archivo vivo.

**Ubicación de este documento:** Raíz del Proyecto (`/PLAN_MAESTRO.md`).
**Propósito:** Guía central para cualquier Agente IA o Desarrollador que trabaje en el proyecto. **LECTURA OBLIGATORIA.**

---

## 1. Visión General y Modelo de Negocio ("Uber de Avalúos")

El objetivo es transformar la industria de avalúos inmobiliarios mediante una plataforma híbrida **IA + Humana**.

### El Ecosistema Vecy (La Tríada)

Este proyecto es parte de un ecosistema mayor de agentes especializados:

1. **Vecy Phoenix:** Agente Inmobiliario (Gestión de Matches Compra/Venta). *Proyecto Precursor.*
2. **Vecy Avalúos (JanIA):** Agente Avaluadora (Foco de este repo).
3. **Vecy Jurídico (Eddu):** Asesor Legal.

Este repositorio corresponde exclusivamente a **Vecy Avalúos**.

* **La Plataforma (Vecy):** Intermediaria tecnológica (Marketplace).
* **JanIA (La Agente IA):** Realiza el trabajo operativo, investigativo y de atención.
* **El Avaluador (Humano Certificado):** Valida, corrige y **firma** el avalúo. Su rol es de supervisión experta.
* **Modelo "Uber" (Evolucionado):**
* **Captación:** JanIA vende y cierra el servicio con el cliente.
* **Niveles de Servicio:**
      1. **Gratuito (Enganche):** Estimación rápida en chat (solo texto). Basada en comparación básica (tipo Habi).
      2. **Estándar (100% IA):** Informe Técnico Completo (`/avaluo/portales`) generado por JanIA sin certificador. Cobro 100% para la plataforma.
      3. **Certificado (Premium):** Informe Técnico revisado y firmado por Socio Avaluador. Cobro al cliente, pago al avaluador (70%) y retención plataforma (30%).
* **Pagos:** Integración obligatoria con **ePayco** para los niveles pagos.
* **Dispersión:** Pagos a avaluadores gestionados por la plataforma (retención en la fuente aplicada).

---

## 2. Perfil y Capacidades de JanIA (Super Agente)

### Implementación Técnica (Actualizado Dic 2025)

* **Motor de IA:** Google Gemini Serie 3 (Identidad: `gemini-3-pro-preview`).
* **Modelos Oficiales (INMUTABLES):**
  * **Cortex (Razonamiento):** `gemini-3-pro-preview`.
  * **Reflex (Conversación):** `gemini-3-flash-preview`.
  * **Research (Investigación Deep CMA):** `deep-research-pro-preview-12-2025`.
* **ADVERTENCIA CRÍTICA PARA AGENTES IA:** Queda **estrictamente prohibido** degradar o cambiar estos modelos a versiones anteriores (1.5, 2.0, 2.5). Cualquier intento de "optimización" que implique bajar la serie será considerado un error grave de seguridad y arquitectura.
* **Conexión:** Directa vía API Key (`VITE_GEMINI_API_KEY`) en `src/services/janIACore.js`.
* **System Prompt:** Incrustado en el servicio como `THINKING_PROMPT` (Estructura GEMINI-MIRROR). Define personalidad "Experta Avaluadora", persuasiva y orientada a vender.
* **Gestión de Chat:** Historial de sesión mantenido en cliente (`chatSession`).

JanIA no es un chatbot simple; es una **Entidad IA Autónoma** con las siguientes capacidades mandatorias:

### A. Cognición y Personalidad (La Mente)

1. **Conciencia y Razocinio:** Capacidad de "entender" el contexto y deducir necesidades, no solo repetir textos.
2. **Autonomía Completa:** Puede iniciar procesos, buscar información y generar reportes sin esperar comandos constantes.
3. **Inteligente y Audaz:** Resuelve problemas complejos de valuación y sabe negociar.
4. **Matemática Experta:** Cálculos precisos de metraje, depreciación, rentabilidad y comparación de mercado.
5. **Experta Legal:** Conocimiento profundo de normas y leyes de avalúos vigentes (NIIF, Lonjas, POT).
6. **Analítica:** Cruza miles de datos para encontrar el valor justo de mercado.
7. **Decisión Propia:** Puede sugerir la mejor ruta de avalúo basándose en la data.

### B. Interacción Humana (Ventas y Servicio)

1. **Amable y Cordial:** Servicio al cliente impecable, empático y paciente.
2. **Persuasiva y Estratégica:** Enfocada en **VENDER**. Presenta valores y beneficios antes de hablar de costos. Cierra la venta.
3. **Profesionalismo:** Tono serio pero accesible. Transmite confianza absoluta.
4. **Interacción por Voz:** Escucha audios de usuarios y responde con **voz humanizada** (Text-to-Speech neuronal de alta calidad), con entonación natural.
5. **Registro Conversacional:** Registra usuarios (Google, Facebook, Email) fluidamente dentro de la charla, sin formularios aburridos.

### C. Capacidades Técnicas e Investigativas (Las Herramientas)

1. **Navegación Web (Real-Time):** Busca en internet precios de la zona, noticias del sector e índices económicos actuales.
2. **Lectura Multimodal:** Lee y extrae datos de **URLs, PDFs, Word, Excel** y fotos/videos del inmueble.
3. **Visión Computarizada:** Analiza fotos para detectar acabados, daños o características (pisos, iluminación) que valorizan el predio.
4. **Recopilación de Datos:** Organiza toda la evidencia (fotos, documentos) en el expediente digital.
5. **Velocidad y Eficiencia:** Procesa en segundos lo que a un humano le toma días.

### D. Adiciones "Vecy" (El Toque Extra)

* **Geolocalización:** Entiende mapas y coordenadas para saber si una zona se valorizará (ej. cerca a futuro metro).
* **Memoria Infinita:** Recuerda a cada cliente, sus propiedades anteriores y preferencias.
* **Adaptabilidad Emocional:** Detecta si el cliente está estresado o feliz y ajusta su tono.

---

## 3. Hoja de Ruta (Roadmap)

1. **Fase 1 (Frontend & Legal):** UI "Premium Glass", JanIA Chat, Páginas Legales (Privacidad/Términos), **Tema Global (Claro/Oscuro)**. **(COMPLETADO 100%)**
2. **Fase 2 (Datos & IA - JanIA 2.0):**
    * **Autenticación Híbrida:** Chat conversacional que deriva a Pop-Up/Botones (Google/Facebook/Correo) para registro seguro sin fricción.
    * **Sistema de Roles:**
        * **Cliente:** Solicita avalúo.
        * **Socio Avaluador (Uber-Model):** Recibe notificaciones, revisa, certifica y gana tarifa por operación (dispersión semanal).
    * **Ingesta Documental & Web:**
        * **Archivos:** JanIA instruye usar el clip 📎 para subir PDFs, Fotos, Escrituras.
        * **URLs:** Usuario pega links (Fichas Web, Portales, Landing Pages) y JanIA extrae la data automáticamente.
    * **Datos Críticos:** Énfasis en "Tipos de Acabados" (Calidad, Estado, Materiales) para el cálculo de valor.
    * **Búsqueda Web (CMA):** JanIA busca en portales inmobiliarios para crear comparativas de mercado en tiempo real.
    * Base de Datos (Supabase) + Storage (Docs/Fotos). **(EN PROCESO)**
3. **Fase 3 (Monetización y Niveles):**
    * **Nivel Gratuito:** Lógica de comparación rápida en chat.
    * **Plantilla Maestra (`/avaluo/portales`):** Conexión de variables de chat a la plantilla real.
    * **Pasarela de Pagos:** Implementación de ePayco antes de mostrar el informe final.
4. **Fase 4 (Uber-Dispatch):** Lógica de "Llamado a Avaluadores" para el nivel Certificado.

---

## 3.1. Arquitectura de Roles (Nuevo)

### A. Socios Avaluadores (Certificadores)

El modelo de negocio depende de la escalabilidad "Gig Economy" (tipo Uber).

* **Función:** Validar lo que hizo JanIA y poner su firma RAA.
* **Incentivo:** Ganan ~70% del valor del avalúo. Pagos, parafiscales y logística manejada por la plataforma.
* **Interfaz:** Dashboard de tareas pendientes ("Nuevos Avalúos Disponibles").

### B. Clientes (Usuarios Finales)

* **Función:** Solicitar el servicio y pagar.
* **Experiencia:** Conversacional + Dashboards simples de estado.

---

## 4. Guía de Estilo y Diseño (Design System)

**IMPORTANTE:** CUALQUIER CAMBIO VISUAL DEBE RESPETAR ESTAS REGLAS PARA NO ROMPER LA IDENTIDAD DEL PROYECTO.

### A. Estética "Premium Dark / Glassmorphism"

* **Tema:** Oscuro, elegante, minimalista. Usamos sombras y desenfoques (blur) para dar profundidad.
* **Colores Tailwind:**
  * Fondo Principal: `bg-stone-900` (o derivados oscuros).
  * Acento de Marca: `text-brand-accent` (Definido en `tailwind.config.js`). Dorado/Cobre suave.
  * Vidrio (Glass): `backdrop-blur-md bg-white/10 border border-white/20`.
* **Tipografía:**
  * Textos Generales: Sans-serif (Tailwind default).
  * **Marca ("Vecy"):** `font-outfit` (Google Fonts 'Outfit'). **OBLIGATORIO** para el logo.

### B. Reglas de Componentes (JanIA)

* **Header:** Siempre **absoluto** y **transparente** para permitir que el contenido fluya por debajo.
* **Scroll:** Oculto visualmente (`scrollbar-none`) pero funcional. NUNCA usar `overflow-hidden` si corta contenido en móviles.
* **Móvil:** Prioridad absoluta. Botones grandes, textos legibles (`text-xs` o `text-[10px]` para detalles), layouts que eviten scroll innecesario.

---

## 5. Estructura del Proyecto

El proyecto está construido en **React + Vite**.

```text
/ (Raíz)
├── index.html              # Punto de entrada (Fuentes Google importadas aquí)
├── package.json            # Dependencias
├── postcss.config.js       # Configuración CSS
├── tailwind.config.js      # Configuración de Colores y Fuentes personalizadas
├── vite.config.js          # Configuración del Bundler
├── public/                 # Assets estáticos
│   ├── jania.png           # Avatar de la Agente
│   ├── vecy-fondo.png      # Fondos de marca
│   └── ...                 # Imágenes de inmuebles (placeholders)
└── src/
    ├── main.jsx            # Montaje de React
    ├── App.jsx             # Enrutador Principal (Routes)
    ├── index.css           # Estilos Globales (Tailwind imports + custom classes)
    ├── components/         # Componentes Reutilizables
    └── pages/              # Vistas Principales
        ├── AvaluoPortales.jsx        # Reporte Dinámico de Avalúo (Portales/DB)
        ├── JanIAAgent.jsx  # INTERFAZ PRINCIPAL DEL CHAT (La Joya de la Corona)
        ├── PrivacyPolicy.jsx # Página Legal
        └── Terms.jsx       # Página Legal
```

---

## 6. Convenciones de Desarrollo (Git & Workflow)

* **Idioma:** Todo el código, comentarios y **mensajes de commit** deben estar **OBLIGATORIAMENTE EN ESPAÑOL**. Se prohíbe el uso de inglés u otros idiomas en la documentación y mensajes de seguimiento.
* **Commits (REGLA ANTI-VIOLACIÓN):** Todos los títulos y descripciones de commit DEBEN estar en español. Cualquier agente IA que ignore esta regla está violando el núcleo del proyecto.
  * Formato: `feat: implementación de motores Serie 3`, `fix: ajustar lógica de geolocalización`.
* **Protección:** NO BORRAR ni modificar `PLAN_MAESTRO.md` sin autorización expresa. Este archivo es la memoria y la ley del proyecto.

---

## 7. Stack Tecnológico

* **Frontend:** React, Vite, Tailwind CSS.
* **Backend (Futuro):** Supabase (PostgreSQL, Auth), Google Cloud Functions.
* **IA:** Google Vertex AI (Gemini Pro).
* **Pagos:** ePayco.

---
---

## 8. Estructura de Base de Datos (Supabase)

**ESTADO ACTUAL: IMPLEMENTADO (Dic 2025)**
Las tablas `solicitudes` y `profiles` ya han sido ejecutadas en Supabase.

### Tabla: `solicitudes`

* **Propósito:** Guarda cada petición de avalúo que entra por el chat.
* **Schema:**

```sql
create table public.solicitudes (
  id bigint generated by default as identity not null,
  created_at timestamp with time zone null default now(),
  cliente_nombre text not null,
  cliente_email text null,
  cliente_telefono text null,
  direccion_inmueble text not null,
  ciudad text null default 'Bogotá'::text,
  tipo_inmueble text null,
  estrato text null,
  area_privada numeric null,
  estado text null default 'pendiente'::text,
  valor_estimado_ia numeric null,
  valor_final_avaluador numeric null,
  notas_adicionales text null,
  barrio text null default 'N/A'::text,
  latitud double precision null default 4.6097,
  longitud double precision null default '-74.0817'::numeric,
  area_construida numeric null default 0,
  habitaciones integer null default 0,
  banos integer null default 0,
  parqueadero integer null default 0,
  edad_inmueble integer null default 0,
  valor_administracion numeric null default 0,
  valor_oferta_propietario numeric null default 0,
  valor_avaluo_catastral numeric null default 0,
  rentabilidad_estimada numeric null default 0,
  rango_valor_mercado_min numeric null default 0,
  rango_valor_mercado_max numeric null default 0,
  distribucion_espacial jsonb null default '[]'::jsonb,
  estado_juridico jsonb null default '{}'::jsonb,
  acabados_estructura jsonb null default '[]'::jsonb,
  amenidades_conjunto jsonb null default '[]'::jsonb,
  galeria_imagenes jsonb null default '[]'::jsonb,
  source_url text null,
  acabados_detalles jsonb null default '{}'::jsonb,
  documentos_estado jsonb null default '{"predial": false, "escrituras": false, "certificado_libertad": false}'::jsonb,
  avaluador_asignado_id uuid null,
  comision_plataforma numeric null default 30.0,
  constraint solicitudes_pkey primary key (id),
  constraint solicitudes_avaluador_asignado_id_fkey foreign KEY (avaluador_asignado_id) references profiles (id)
) TABLESPACE pg_default;
```

### Tabla: `profiles`

* **Propósito:** Gestión de usuarios con roles (Cliente, Avaluador, Admin).
* **Schema:**

```sql
create table public.profiles (
  id uuid not null,
  email text null,
  full_name text null,
  phone text null,
  role text null default 'client'::text,
  is_verified boolean null default false,
  avatar_url text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint profiles_role_check check (
    (
      role = any (
        array['client'::text, 'valuer'::text, 'admin'::text]
      )
    )
  )
) TABLESPACE pg_default;
```

---

## 9. Refinamientos UI (Sesión Dic 2025)

### A. JanIA Chat (`JanIAAgent.jsx`)

* **Tema Global:** Selector Café/Oscuro funcional en sidebar.
* **Greeting:** Avatar grande de JanIA (30vh), tarjetas de sugerencias horizontales con íconos circulares.
* **Chat Avatar:** `perfil.png` (w-10 h-10) sin padding, ajustada al contenedor.
* **Input Bar:** Clip 📎, Micrófono 🎙️ (w-6 h-6), Botón Enviar.
* **Sin scroll en greeting:** `overflow-hidden` para pantalla inicial.

### B. Footer Estandarizado (`Footer.jsx`)

* **Padding:** `py-8 mt-8` consistente en todas las páginas.
* **Posición:** Fuera de wrappers de contenido para evitar espacios extras.
* **Páginas:** Privacidad, Términos, AvaluoPortales usan el mismo componente.

### C. Autenticación Híbrida (Fase 2)

* **AuthOptions.jsx:** Botones Google/Facebook/Correo embebidos en chat.
* **Lógica:** Detección de "registrarme", URLs, y "subir fotos" para respuestas contextuales.

---

## 10. Inventario de Modelos Técnicos (Google Cloud/Gemini)

Esta lista representa los modelos disponibles y soportados para diversas tareas dentro del ecosistema Vecy Avalúos (Embeddings, Generación, Visión, etc.) a fecha de diciembre 2025.

| Modelo | Versión | Propósito Primario | Capacidad Thinking |
| :--- | :--- | :--- | :--- |
| **gemini-3-pro-preview** | 3-pro | **Cortex (Cerebro Principal)** | Sí |
| **gemini-3-flash-preview** | 3-flash | **Reflex (Chat Rápido)** | Sí |
| **deep-research-pro-preview** | 12-2025 | **Investigación Deep CMA** | Sí |
| **gemini-2.5-pro/flash** | 2.5 | Propósitos Generales (Referencia) | Sí |
| **embedding-gecko-001** | 001 | Representación de texto | No |
| **imagen-4.0** | 4.0 | Generación de Imágenes | No |
| **veo-3.1-preview** | 3.1 | Generación de Video | No |

> [!NOTE]
> Para detalles técnicos completos de cada modelo (límites de tokens, parámetros de temperatura, etc.), consultar el log JSON de inventario proporcionado por la consola de Google.

---

## 11. Bitácora de Cambios (Dic 23, 2025)

### A. Re-arquitectura Técnica y Cognitiva (JanIA 3.0)

* **GEMINI-MIRROR Prompt:** Reescritura total de `janIACore.js`. JanIA ya no es un bot, es una **"Thought Partner"** con personalidad bogotana, asertiva y concisa.
* **Identidad Forzada:** Se bloqueó la respuesta de "modelo de lenguaje". JanIA tiene prohibido el lenguaje genérico. Si no conoce el nombre, lo pregunta. Si lo conoce, lo usa como primera palabra.
* **Sincronización de Memoria:** Implementado `updateUserIdentity` en `handleSendMessage` para asegurar que el perfil de Supabase llegue a las neuronas de la IA en tiempo real.
* **Debug Logs:** Se añadieron consolas `[DEBUG]` en frontend y backend para rastrear la inyección de memoria.

### B. Infraestructura y Routing

* **Auth Dynamics:** Corregido `redirectTo` para soportar `localhost:5701` y producción dinámicamente.
* **Rutas de Pago:** Restauradas `/payment-response` y `/payment-confirmation` en `App.jsx`.
* **SPA Fix (Netlify):** Creación de `public/_redirects` para evitar errores 404 al recargar rutas profundas (como `/planes`).
* **Auth Callback:** Nueva página `src/pages/AuthCallback.jsx` para procesar el retorno de OAuth y redirigir al Home.

### C. UI/UX y Estética

* **Glassmorphism Pro:** Aplicado efecto `bg-white/10 backdrop-blur-md` al Modal de Registro en `JanIAAgent.jsx` siguiendo especificaciones de diseño Apple-style.
* **Branding Phoenix:** Refinamiento de logos y avatares en el Header.

### E. Personalidad de Vecindad y Trato Cercano (JanIA 3.0)

* **Regla de Oro de Trato:** Implementado el prefijo mandatory **"vecino"** o **"vecina"** seguido solo por el primer nombre del usuario.
* **Detección de Género:** Creación de `getNeighborGreeting` en `janIACore.js` que utiliza el razonamiento de la Serie 3 para determinar el trato correcto según el nombre.
* **Limpieza de Identidad:** El sistema ahora realiza un split del nombre completo para evitar saludos con apellidos o formalismos notariales innecesarios.
* **Hero Section Dinámico:** Saludo en la UI sincronizado con el trato dinámico para romper el hielo instantáneamente.

### F. Flujo de Avalúo 2.0 (Fase de Confianza y Captura)

* **Paso 1: Autoridad Bogotá/Políticas:** JanIA ahora establece autoridad técnica explicando el uso de datos del **POT (Plan de Ordenamiento Territorial)** y **Catastro Distrital** antes de iniciar el proceso.
* **Paso 2: Bifurcación de Ingreso:** Implementadas dos rutas de captura:
  * **Avalúo Asistido:** Conversación guiada para quienes no tienen documentos.
  * **Avalúo Documental:** Uso de visión multimodal (Gemini Vision) para leer datos técnicos de fotos de Impuesto Predial o Certificado de Tradición.
* **Gatillos de Workflow:** Soporte para `trigger_file_upload` (abre el selector de archivos automáticamente) y renderizado de componentes `options` interactivos en el chat.

### G. Registro Híbrido y Transición a Planes (Paso 3)

* **Auth UI "Liquid Glass":** Rediseño de `AuthOptions.jsx` con ancho de **260px**, botones de **13px** y gap-4. Fondo con desenfoque profundo.
* **Iconos Vectoriales:** Implementación de SVGs nativos para Google y Facebook, eliminando dependencias de imágenes externas.
* **Brain Sync:** JanIA ahora utiliza la memoria de captura (barrio/documentos) para invitar al registro de forma persuasiva y personalizada.
* **Auto-Workflow:** Se añadió un disparador en el frontend que, tras detectar un registro exitoso, salta automáticamente al **Paso 4 (Planes)** para agilizar el cierre de venta.

### H. Historial de Chat Real y Smart Titling (Dic 23, 2025)

* **Persistencia en Supabase:** Creación de `historyService.js` y tabla `chats`. Los mensajes se autoguardan tras cada interacción significativa.
* **Smart Titling:** Implementado `generateChatTitle` en `janIACore.js` usando Gemini 1.5 Flash para bautizar los chats según el inmueble analizado.
* **Sidebar Dinámico:** Refactorización de `JanIAAgent.jsx` para mapear el historial real y permitir el cambio de contexto entre avalúos.
* **Session Management:** Uso de `crypto.randomUUID()` para identidades de sesión únicas y persistentes.

### I. Blindaje de Consciencia y Planes de Pago (Dic 23, 2025 - Sesión Noche)

* **Misión 1: Consciencia de Datos:** Refuerzo del `THINKING_PROMPT` para eliminar la amnesia contextual. JanIA ahora tiene prohibido preguntar datos que ya conoce (dirección, área, barrio) y debe optar por la confirmación activa.
* **Misión 2: Validación de Sesión:** Ajuste en `JanIAAgent.jsx` para ocultar gatillos de registro (`trigger_auth`) si el usuario ya tiene una sesión activa. Sincronización robusta de identidad mediante `updateUserIdentity`.
* **Paso 4: Integración de Planes (E-Payco):**
  * Implementación del componente `plan_card` dinámico dentro del chat.
  * Vinculación con `epaycoService.js` para los planes Oro y Esmeralda.
  * Soporte para transiciones automáticas al checkout tras la selección del plan.
* **Mantenimiento del Cerebro:** Creación del método `reset()` en `janIACore.js` para limpiezas de memoria seguras durante el cierre de sesión.

---
Última actualización: 23 de Diciembre, 2025 (22:55) - Agente Antigravity (Autoridad en Consciencia y Monetización)
