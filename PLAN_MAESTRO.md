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

* **Motor de IA:** Google Gemini Flash (`gemini-flash-latest`). (Modelo estándar verificado).
* **Conexión:** Directa vía API Key (`VITE_GEMINI_API_KEY`) en `src/services/janiaService.js`.
* **System Prompt:** Incrustado en el servicio. Define personalidad "Experta Avaluadora", persuasiva y orientada a vender.
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

8. **Amable y Cordial:** Servicio al cliente impecable, empático y paciente.
9. **Persuasiva y Estratégica:** Enfocada en **VENDER**. Presenta valores y beneficios antes de hablar de costos. Cierra la venta.
10. **Profesionalismo:** Tono serio pero accesible. Transmite confianza absoluta.
11. **Interacción por Voz:** Escucha audios de usuarios y responde con **voz humanizada** (Text-to-Speech neuronal de alta calidad), con entonación natural.
12. **Registro Conversacional:** Registra usuarios (Google, Facebook, Email) fluidamente dentro de la charla, sin formularios aburridos.

### C. Capacidades Técnicas e Investigativas (Las Herramientas)

13. **Navegación Web (Real-Time):** Busca en internet precios de la zona, noticias del sector e índices económicos actuales.
14. **Lectura Multimodal:** Lee y extrae datos de **URLs, PDFs, Word, Excel** y fotos/videos del inmueble.
15. **Visión Computarizada:** Analiza fotos para detectar acabados, daños o características (pisos, iluminación) que valorizan el predio.
16. **Recopilación de Datos:** Organiza toda la evidencia (fotos, documentos) en el expediente digital.
17. **Velocidad y Eficiencia:** Procesa en segundos lo que a un humano le toma días.

### D. Adiciones "Vecy" (El Toque Extra)

* **Geolocalización:** Entiende mapas y coordenadas para saber si una zona se valorizará (ej. cerca a futuro metro).
* **Memoria Infinita:** Recuerda a cada cliente, sus propiedades anteriores y preferencias.
* **Adaptabilidad Emocional:** Detecta si el cliente está estresado o feliz y ajusta su tono.

---

## 3. Hoja de Ruta (Roadmap)

* **Geolocalización:** Entiende mapas y coordenadas para saber si una zona se valorizará (ej. cerca a futuro metro).
* **Memoria Infinita:** Recuerda a cada cliente, sus propiedades anteriores y preferencias.
* **Adaptabilidad Emocional:** Detecta si el cliente está estresado o feliz y ajusta su tono.

---

## 3. Hoja de Ruta (Roadmap)

1. **Fase 1 (Frontend & Legal):** UI "Premium Glass", JanIA Chat, Páginas Legales (Privacidad/Términos), **Tema Global (Claro/Oscuro)**. **(COMPLETADO 100%)**

## 3. Hoja de Ruta (Roadmap)

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

* **Idioma:** Todo el código, comentarios y **mensajes de commit** deben estar en **ESPAÑOL** (o inglés técnico si es código duro, pero la documentación en Español).
* **Commits:** Usar formato convencional en español si es posible, o claro.
  * Ejemplo: `feat: ajustar diseño movil header`, `fix: corregir error de scroll`.
* **Protección:** NO BORRAR ni modificar `PLAN_MAESTRO.md` sin autorización expresa. Este archivo es la memoria del proyecto.

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

*Última actualización: Diciembre 2025 - Agente Gemini*
