# Reporte de Auditoría del Proyecto y Esquema de Arquitectura

## 1. Resumen Ejecutivo

El proyecto **Vecy Avalúos** es una aplicación web moderna de valoración inmobiliaria impulsada por IA, construida con tecnologías de vanguardia: **React, Vite, Tailwind CSS y Supabase**.

**Veredicto:** El núcleo de la aplicación es sólido y potente. Sin embargo, el código carga con un "peso muerto" significativo: una arquitectura de backend en Python heredada que ya es **obsoleta**. Actualmente, el frontend (la parte visual) es autosuficiente y se comunica directamente con la base de datos (Supabase) y la IA (Gemini), haciendo innecesario el código Python antiguo.

---

Así está conformado hoy tu sistema. La "magia" ocurre completamente en el navegador del usuario y en la nube, sin servidores intermedios propios.

### 🏛️ Árbol Genealógico del Proyecto (Estructura de Archivos Vitales)

Esta estructura muestra solo lo esencial. Si algo no está aquí, probablemente sea secundario o configuración.

```
VECY-AVALUOS/
├── .env                    # [CONFIDENCIAL] Llaves de API (Supabase, Gemini, Maps) - ¡NO BORRAR!
├── index.html              # Puerta de entrada de la aplicación
├── package.json            # Lista de dependencias (React, Vite, SDKs)
├── PLAN_MAESTRO.md         # Bitácora Sagrada del desarrollo (LEER PRIMERO)
├── PROJECT_AUDIT_REPORT.md # Este archivo (Mapa del tesoro para IAs)
│
├── public/                 # Archivos estáticos
│   ├── jania.png           # Avatar de la agente
│   └── ... (imágenes)
│
├── src/                    # ❤️ CORAZÓN DEL CÓDIGO
│   ├── main.jsx            # Punto de montaje de React
│   ├── App.jsx             # Enrutador principal
│   │
│   ├── components/         # Bloques de LEGO visuales
│   │   ├── VecyPhoenix/    # Sistema de Diseño (Botones, Estilos)
│   │   ├── reports/        # Plantillas PDF (CafeReport, etc.)
│   │   │   └── CafeReport.jsx # Plantilla activa para descargas
│   │   └── ...
│   │
│   ├── pages/
│   │   └── JanIAAgent.jsx  # 🧠 CEREBRO VISUAL: Interfaz del Chat
│   │       # Aquí vive la lógica de UI, el chat, y la activación de descargas PDF.
│   │
│   └── services/           # ⚙️ MOTORES (Lógica Pura - Sin UI)
│       ├── janIACore.js    # MENTE MAESTRA: Conecta con Gemini AI.
│       │   # Controla la personalidad, memoria y llamadas a herramientas.
│       │
│       ├── pricingService.js # CALCULADORA: Lógica financiera 2026.
│       │   # Única fuente de verdad para precios de avalúos.
│       │
│       ├── ragService.js     # MEMORIA: Búsqueda vectorial en Supabase.
│       │   # Busca normas POT y valores de referencia.
│       │
│       ├── historyService.js # HISTORIAL: Guarda chats en Supabase.
│       └── epaycoService.js  # PAGOS: Pasarela de ePayco.
│
└── supabase/               # Base de Datos
    └── migrations/         # Esquema SQL (Tablas y Funciones)
```

---

## 3. Guía de Conexiones: ¿Cómo fluye la información?

Para evitar romper el código, entiende este flujo:

1. **El Usuario** escribe en el chat (`JanIAAgent.jsx`).
2. **JanIAAgent** envía el texto a **`janIACore.js`**.
3. **janIACore** "piensa" usando **Gemini Pro (Google AI)**.
4. Si se necesita calcular precios:
    * **janIACore** llama a la herramienta interna `pricing_calculator`.
    * Esta herramienta ejecuta **`pricingService.js`**. ¡NUNCA llama a ningún backend externo!
5. Si se necesita entregar un reporte:
    * **JanIAAgent** detecta que el precio está listo.
    * Activa la renderización de **`CafeReport.jsx`**.
    * Usa **`@react-pdf/renderer`** para generar el binario PDF en el navegador.
    * El usuario descarga el archivo generado localmente.

### ⚠️ ZONAS DE PELIGRO (NO TOCAR SIN SABER)

* ❌ **NO CREAR CARPETAS BACKEND**: No intentes crear servidores Node.js o Python. Todo es *Serverless*.
* ❌ **NO CAMBIAR LÓGICA DE PRECIOS EN EL CHAT**: El chat solo *muestra* precios, el cálculo real está en `pricingService.js`.
* ❌ **NO MODIFICAR `.env` SIN RESPALDO**: Si borras las llaves, JanIA muere instantáneamente.

---

## 4. Diagrama de Arquitectura (Mermaid)

```mermaid
graph TD
    subgraph CLIENTE_NAVEGADOR ["Frontend (Lo que ve el usuario)"]
        UI[JanIAAgent.jsx (Chat UI)]
        PDF[Generador PDF (React-PDF)]
        
        subgraph CEREBRO_LOCAL ["src/services/"]
            Core[janIACore.js (Orquestador IA)]
            Pricing[pricingService.js (Calculadora)]
            Service_RAG[ragService.js (Memoria)]
        end
        
        UI --> Core
        Core --> Pricing
        Core --> Service_RAG
        UI -.-> PDF : Descarga Directa
    end

    subgraph NUBE_SERVICIOS ["Servicios Externos (API)"]
        Supabase[(Supabase: BD & Auth)]
        Gemini[Google Gemini AI (Cerebro)]
        Maps[Google Maps (Ubicación)]
    end

    Core <--> Gemini
    Core <--> Maps
    Service_RAG <--> Supabase
    
    style PDF fill:#ffcccc,stroke:#d32f2f
    style Core fill:#e1f5fe,stroke:#0277bd
    style Pricing fill:#e8f5e9,stroke:#2e7d32
```

---

## 3. Propuestas y Justificación Detallada

A continuación explico **qué** propongo, **por qué** es necesario y **para qué** sirve cada acción.

### A. Eliminar la carpeta `backend/`

* **¿Qué es?**: Una carpeta que contiene scripts de Python (`main.py`, `pdf_generator.py`).
* **¿Por qué eliminarla?**: Porque tu proyecto actual es una "Single Page Application" (SPA) que usa JavaScript para todo. Esos archivos Python son restos de una versión anterior y **no se están ejecutando**. Tenerlos ahí solo confunde a cualquier desarrollador (o IA) que trabaje en el proyecto, haciéndoles creer que hay un servidor Python que mantener.
* **¿Para qué?**: Para limpiar el proyecto, reducir su tamaño y evitar errores futuros donde alguien intente "arreglar" un servidor que ni siquiera debería existir. **Resultado:** Un código más limpio y profesional.

### B. Verificar la Generación de PDF

* **¿Qué es?**: La función que permite al usuario descargar su avalúo o carta de oferta.
* **¿Por qué verificarlo?**: En la versión antigua, Python generaba el PDF. Al eliminar Python, debemos estar 100% seguros de que el *nuevo* sistema (React) está haciendo ese trabajo. En mi revisión vi librerías de PDF instaladas, pero necesito confirmar que el botón de descarga realmente funciona.
* **¿Para qué?**: Para asegurar que una función crítica (entregar el documento) funcione antes de salir al aire. Si vendes un plan "Oro" y el cliente no puede bajar su PDF, es un fallo crítico.

### C. Limpieza de Scripts de Desarrollo

* **¿Qué es?**: Archivos en `scripts/` como `test_rag.js`.
* **¿Por qué mantenerlos (pero revisar)?**: Son útiles para probar la IA sin abrir la web, pero no deben subir a producción.
* **¿Para qué?**: Mantener herramientas útiles para nosotros, los desarrolladores, pero separadas del código que usa el cliente final.

---

## 4. Análisis Detallado de Archivos (Inventario)

### Directorio Raíz

| Archivo | Función | Estado | Acción Recomendada |
| :--- | :--- | :--- | :--- |
| `.env` | Guarda las llaves secretas (API Keys). | **Crítico** | Conservar y proteger. |
| `PLAN_MAESTRO.md` | La bitácora y plan de vuelo del proyecto. | **Crítico** | Mantener actualizado siempre. |
| `backend/` | Código antiguo de servidor. | **OBSOLETO** | **ELIMINAR**. |

### Directorio Fuente (`src/`) - El Corazón del Proyecto

| Archivo | Función | Estado | Acción Recomendada |
| :--- | :--- | :--- | :--- |
| `services/janIACore.js` | El cerebro de JanIA. Conecta con Gemini. | **Vital** | Proteger. Es la joya del proyecto. |
| `services/pricingService.js` | Calcula precios (Esmeralda/Oro). | **Vital** | Conservar. Lógica financiera correcta. |
| `pages/JanIAAgent.jsx` | La pantalla principal del chat. | **Vital** | Conservar. |
| `components/reports/` | Plantillas visuales de los reportes. | **Revisión** | Verificar que se conviertan a PDF correctamente. |

---

## 5. ¿Qué falta para salir al aire? (Checklist de Lanzamiento)

1. [ ] **Limpieza**: Ejecutar la eliminación de la carpeta `backend`.
2. [ ] **Prueba de Fuego (PDF)**: Simular una compra/generación de reporte y ver si descarga el archivo PDF correctamente usando las librerías de React (`@react-pdf/renderer` o `react-to-pdf`).
    * *Nota:* Si esto falla, debó construir el generador de PDF en JavaScript rápidamente.
3. [ ] **Pagos**: Confirmar que la llave de ePayco en `.env` sea la de producción (no pruebas) cuando decidas lanzar.
4. [ ] **Build**: Ejecutar el comando de construcción final para asegurar que no hay errores ocultos.

**Conclusión:** Estás a un 95% del lanzamiento. El 5% restante es eliminar la basura (Python) y confirmar que la entrega del producto (PDF) funciona sin ese código antiguo.
