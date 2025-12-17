# PLAN MAESTRO: VECY AVALÚOS (Proyecto JanIA)

**Ubicación de este documento:** Raíz del Proyecto (`/PLAN_MAESTRO.md`).
**Propósito:** Guía central para cualquier Agente IA o Desarrollador que trabaje en el proyecto. **LECTURA OBLIGATORIA.**

---

## 1. Visión General y Modelo de Negocio ("Uber de Avalúos")

El objetivo es transformar la industria de avalúos inmobiliarios mediante una plataforma híbrida **IA + Humana**.

* **La Plataforma (Vecy):** Intermediaria tecnológica (Marketplace).
* **JanIA (La Agente IA):** Realiza el trabajo operativo, investigativo y de atención.
* **El Avaluador (Humano Certificado):** Valida, corrige y **firma** el avalúo. Su rol es de supervisión experta.
* **Modelo "Uber":**
  * **Captación:** JanIA vende y cierra el servicio con el cliente.
  * **Asignación:** El avalúo pre-procesado se ofrece a avaluadores certificados (Gig Economy).
  * **Monetización:** Cobramos el 100% al cliente. Retenemos **20-30% de comisión** por tecnología/plataforma.
  * **Dispersión:** Pago del remanente (70-80%) al avaluador mediante **pagos masivos semanales** (vía ePayco/Pasarela).

---

## 2. Perfil y Capacidades de JanIA (Super Agente)

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

1. **Fase 1 (Frontend & Legal):** UI "Premium Glass", JanIA Chat, Páginas Legales (Privacidad/Términos). **(COMPLETADO)**
2. **Fase 2 (Datos & IA):** Base de Datos (Supabase) **(EN PROCESO)**, Conexión a Google Vertex AI, RAG para investigación de precios.
3. **Fase 3 (Avalúos Real):** Generación de PDFs, Panel de Avaluador, Firmas Digitales.
4. **Fase 4 (Pagos):** Integración ePayco y pagos masivos semanales.

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
        ├── Home.jsx        # Landing Page / Reporte Avalúo
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

La "memoria" del proyecto. Todas las tablas deben usar `snake_case`.

### Tabla: `solicitudes` (El corazón del negocio)

Guarda cada petición de avalúo que entra por el chat de JanIA.

* `id` (BigInt, PK): Identificador único.
* `created_at` (Timestamp): Fecha de creación.
* `cliente_nombre` (Text): Nombre del solicitante.
* `direccion_inmueble` (Text): Ubicación exacta.
* `tipo_inmueble` (Text): Casa, Apto, Bodega, etc.
* `area_privada` (Numeric): Metraje en m2.
* `estado` (Text): `pendiente`, `en_proceso`, `completado`.
* `valor_estimado_ia` (Numeric): El pre-avalúo calculado por JanIA.
* `valor_final_avaluador` (Numeric): El valor certificado por el humano.

---

*Última actualización: Diciembre 2025 - Agente Gemini*
