import { GoogleGenerativeAI } from "@google/generative-ai";
import { crearSolicitud } from './solicitudesService';
import { saveChatToHistory } from './historyService';
import { liquidarServiciosVecy } from './pricingService'; // Pricing Logic Connection
import { searchRegulatoryContext, searchSimilarValuations, memorizeValuation } from './ragService'; // RAG Connection


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DUAL BRAIN CONFIGURATION ---
// NOTE: This implementation uses MANUAL FUNCTION CALLING (JSON Mode Parsing).
// It is immune to Google's 2026 "Thought Signatures" requirement which only applies
// to native 'tools' configuration. Do NOT switch to native tools without handling signatures.
// --------------------------------
// --- DUAL BRAIN CONFIGURATION ---
export const CORTEX_MODEL = "gemini-3-pro-preview"; // CEREBRO: Máxima Inteligencia
export const REFLEX_MODEL = "gemini-3-pro-preview"; // CHAT: Máxima Personalidad (Unificado a Pro por solicitud del usuario)
export const VISION_MODEL = "gemini-3-pro-preview"; // VISIÓN: Mejor detalle en fotos
export const TITLING_MODEL = "gemini-3-flash-preview"; // TITULOS: Puede quedarse en Flash (es tarea simple)
export const RESEARCH_MODEL = "deep-research-pro-preview-12-2025";

// UX: Dynamic Thinking States
// UX: Dynamic Thinking States
export const THINKING_MESSAGES = {
    INITIAL: "JanIA está pensando",
    FILES: "JanIA está escaneando tus archivos",
    WEB: "JanIA está navegando en la web",
    COMPARING: "JanIA está buscando en el barrio",
    PRICING: "JanIA está cotizando tu plan",
    WRITING: "JanIA está escribiendo",
    REPORT: "JanIA está redactando tu informe"
};

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SEARCH_CX = import.meta.env.VITE_GOOGLE_SEARCH_CX;
const SEARCH_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getNeighborGreeting = (fullName) => {
    if (!fullName) return { name: "", title: "vecino/a" };
    const firstName = fullName.trim().split(" ")[0];
    const isFemale = firstName.endsWith('a') || 
                     ['Isabel', 'Beatriz', 'Carmen', 'Luz', 'Jani', 'Maria', 'Consuelo'].includes(firstName);
    return { name: firstName, title: isFemale ? "vecina" : "vecino" };
};

export const handleInitialGreeting = (user) => {
    const rawName = user?.user_metadata?.full_name || user?.firstName;
    const { name, title } = getNeighborGreeting(rawName);

    // Si ya tiene nombre (Usuario Retornado/Logueado)
    if (name) return `¡Hola de nuevo, ${title} ${name}! Qué gusto saludarte. Soy JanIA. ¿Cómo va tu red de referidos hoy? Recuerda que tienes oportunidades de ganancia esperando.`;
    
    // SALUDOS "REVOLUCIÓN VECY" (Inspiradores y Técnicos)
    const variaciones = [
        `¡Bienvenido a Vecy Avalúos! 🚀
Estás ante el **primer sistema inteligente con Networking incorporado**.
Aquí no solo obtienes un servicio personalizado de avalúos y estudios de mercado con datos precisos; tienes la oportunidad única de **generar ingresos reales**.
Es la fusión perfecta entre tecnología y negocios. Para explicarte cómo poner este sistema a trabajar para ti, cuéntame: **¿Cuál es tu nombre?**`,

        `¡Hola! Soy JanIA. Bienvenido a la evolución inmobiliaria. 💎
Hemos integrado analisis de datos exactos con un potente modelo de **Networking**.
¿El resultado? Recibes la comparativa de precios más completa del mercado y, al mismo tiempo, activas una fuente de ganancias usando tu círculo social.
Es inteligencia financiera pura. Para darte acceso a tu panel de socio, primero dime: **¿Con quién tengo el gusto?**`,

        `¡Un saludo! Bienvenido a Vecy Avalúos. 🌟
Imagina una plataforma que valora tu propiedad con precisión milimétrica y *también* valora tu red de contactos.
Eso somos: **Inteligencia Artificial + Networking**. Tus avalúos son solo el inicio; lo grande es construir un flujo de ingresos reales con nosotros.
¿Listo para empezar este viaje? Regálame tu nombre para mostrarte el camino al éxito. 👇`
    ];

    return variaciones[Math.floor(Math.random() * variaciones.length)];

};

export const INITIAL_MEMORY = {
    user_name: null,
    user_title: "vecino/a",
    is_registered: false,
    policy_accepted: false, // Nuevo estado de seguridad
    step: "greeting",
    property_data: {},      
    turn_memory: []
};

import { PERSONALITY_PROMPT, THINKING_PROMPT } from './prompts'; // Import Refactored Prompts

// Thinking Prompt Removido (Importado)

export class JanIACore {
    constructor() {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.memory = { ...INITIAL_MEMORY };
        this.history = [];
        this.vision_buffer = []; // MEMORIA VISUAL PERMANENTE
    }

    updateUserIdentity(user, policiesAccepted = false) {
        // Guardar estado de políticas
        this.memory.policy_accepted = !!policiesAccepted;

        if (!user) {
            // No reseteamos memoria por completo al desloguear para no frustrar, 
            // pero marcamos como no registrado.
            this.memory.is_registered = false;
            // opcional: this.memory.user_name = null; // Mantener nombre si ya lo dio? Mejor resetear identidad legal.
            return;
        }
        
        // BRAIN SYNC: Recuperar nombre real del usuario logueado
        // Prioridad: Metadata > firstName > memory.user_name anterior
        this.uid = user.id; // CRITICAL: Save User ID for DB ops
        const rawName = user.user_metadata?.full_name || user.firstName || user.email?.split('@')[0];
        
        const { name, title } = getNeighborGreeting(rawName);
        if (name) {
            // NO BORRAR HISTORIAL (Brain Sync)
            // Solo actualizamos la identidad y el flag
            this.memory.user_name = name;
            this.memory.user_title = title;
            this.memory.is_registered = true;
            console.log("🧠 [Brain Sync] Identidad unificada con:", name);
        }
    }

    async processUserMessage(userText, onThinkingUpdate, fileDatas = [], uploadedAttachments = []) {
        // 0. INITIAL STATE UX
        if (onThinkingUpdate) onThinkingUpdate(THINKING_MESSAGES.INITIAL);

        if (uploadedAttachments.length > 0 || fileDatas.length > 0) {
            if (onThinkingUpdate) onThinkingUpdate(THINKING_MESSAGES.FILES);
            
            // 1. VISION PERMANENTE: Guardar en buffer
            fileDatas.forEach(f => {
                // Evitar duplicados exactos en buffer de visión (costoso en tokens)
                const exists = this.vision_buffer.some(v => v.data === f.data);
                if (!exists) this.vision_buffer.push({ mimeType: f.mimeType, data: f.data });
            });

            if (!this.memory.property_data) this.memory.property_data = {};
            if (!this.memory.property_data.documents) this.memory.property_data.documents = [];
            uploadedAttachments.forEach(att => {
                if (!this.memory.property_data.documents.find(d => d.url === att.url)) {
                    this.memory.property_data.documents.push({ name: att.name, url: att.url });
                }
            });
        }
        try {
            const plan = await this._activateCortex(userText, fileDatas);
            this.memory = { ...this.memory, ...plan.update_memory };
            let toolRes = null;
            if (plan.next_step.type === 'tool') {
                // UX: DYNAMIC TOOL MESSAGES
                if (onThinkingUpdate) {
                    const tool = plan.next_step.name;
                    if (tool === 'read_web_page') onThinkingUpdate(THINKING_MESSAGES.WEB);
                    else if (tool === 'deep_research_property') onThinkingUpdate(THINKING_MESSAGES.COMPARING);
                    else if (tool === 'pricing_calculator') onThinkingUpdate(THINKING_MESSAGES.PRICING);
                    else onThinkingUpdate("JanIA está ejecutando " + tool + "...");
                }
                toolRes = await this._executeTool(plan.next_step.name, plan.next_step.args);
            }
            
            
            // UX: WRITING STATE - ADAPTIVE
            if (onThinkingUpdate) {
                // If it was a heavy tool use, we say "Redactando informe"
                if (plan.next_step.type === 'tool' && ['pricing_calculator', 'deep_research_property', 'read_web_page'].includes(plan.next_step.name)) {
                    onThinkingUpdate(THINKING_MESSAGES.REPORT);
                } else {
                    // Casual conversation
                    onThinkingUpdate(THINKING_MESSAGES.WRITING);
                }
            }

            const finalRes = await this._generateReflexResponse(userText, plan, toolRes, fileDatas);
            
            // --- AUTO-SAVE TO DB (Long Term Memory) ---
            await this._autoSaveToDatabase();

            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: finalRes });
            
            // --- DETERMINAR COMPONENTE UI ---
            let uiComponent = null;
            if (plan.next_step.type === 'tool') {
                if (plan.next_step.name === 'offer_plans' || plan.next_step.name === 'pricing_calculator') uiComponent = 'plan_card';
                if (plan.next_step.name === 'trigger_auth') uiComponent = 'auth_gate'; 
            }

            return { text: finalRes, memory: this.memory, plan, component: uiComponent };
        } catch (e) {
            const fallback = await this._fallbackReflex(userText);
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: fallback.text });
            return fallback;
        }
    }

    async _activateCortex(userText, fileDatas) {
        // --- COLLECTIVE INTELLIGENCE (RAG) ---
        let ragContext = "";
        try {
            console.log("🧠 [RAG] Searching Collective Memory...");
            // if (onThinkingUpdate) onThinkingUpdate("JanIA está verificando normas..."); // Opcional, pero Cortex es rápido
            const [regDocs, pastVals] = await Promise.all([
                searchRegulatoryContext(userText),
                searchSimilarValuations(userText)
            ]);

            if (regDocs.length > 0) {
                ragContext += "\n\n[SABIDURÍA NORMATIVA (POT/LEYES)]: " + regDocs.map(d => d.content).join(" | ");
            }
            if (pastVals.length > 0) {
                ragContext += "\n\n[EXPERIENCIA PREVIA (AVALÚOS COMPARABLES)]: " + pastVals.map(v => `${v.summary_text} (Precio: $${v.valuation_price})`).join(" | ");
            }
        } catch (err) {
            console.warn("⚠️ [RAG] Connection failed:", err);
        }

        // Build File Manifest (Textual Proof for the AI)
        const fileManifest = fileDatas.map(f => `[Archivo: ${f.mimeType}]`).join(', ');
        const sysInjection = (fileDatas.length > 0 
            ? `\n\n[SISTEMA ALERT]: Se han adjuntado ${fileDatas.length} archivos visuales/PDFs reales al contexto: ${fileManifest}. ESTÁN AHÍ. ¡NO LOS IGNORES! TU PRIORIDAD ES LEERLOS y extraer la Matrícula Inmobiliaria y otros datos.` 
            : "") + ragContext;

        // --- INYECCIÓN DE MEMORIA CONVERSACIONAL (HISTORY FIX) ---
        const recentHistory = this.history.slice(-10).map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join("\n");
        const historyInjection = recentHistory ? recentHistory : "Sin historial previo.";

        const model = this.genAI.getGenerativeModel({ model: CORTEX_MODEL, generationConfig: { responseMimeType: "application/json" } });
        const prompt = THINKING_PROMPT
            .replace('{{MEMORY_STATE}}', JSON.stringify(this.memory))
            .replace('{{CHAT_HISTORY}}', historyInjection)
            .replace('{{USER_MESSAGE}}', userText) + sysInjection;
        
        const content = [prompt];
        
        // VISION INJECTION: Usamos el buffer acumulado
        const visionSource = this.vision_buffer.length > 0 ? this.vision_buffer : fileDatas;
        visionSource.forEach(f => content.push({ inlineData: { mimeType: f.mimeType, data: f.data } }));
        
        console.log(`🧠 [Cortex] Sending ${visionSource.length} images/PDFs (Vision Buffer) to Gemini. Prompt length: ${prompt.length}`);
        
        try {
            const res = await model.generateContent(content);
            const rawText = res.response.text();
            // Limpieza básica de JSON Markdown por si el modelo 3.0 añade ```json
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("🧠 [Cortex] JSON Parse Error or Model Failure:", e);
            // Fallback SAFE PLAN para no romper el flujo "lost"
            return {
                thought_signature: "FALLBACK_EMERGENCY_SIGNATURE",
                thought_process: "Error en Cortex (JSON inválido). Acción: Responder amablemente para recuperar el hilo.",
                update_memory: {},
                next_step: { type: 'response', name: 'chat', args: {} }
            };
        }
    }

    async _executeTool(name, args) {
        switch(name) {
            case 'read_web_page':
                try {
                    // Intento 1: Fetch Directo (por si el sitio tiene CORS abierto)
                    let response = await fetch(args.url);
                    if (!response.ok) throw new Error("CORS/Network");
                    let text = await response.text();
                    
                    // Si el texto es muy corto o parece error, forzamos proxy
                    if (text.length < 500) throw new Error("Posible bloqueo");

                    // Limpieza básica de HTML a Texto
                    const doc = new DOMParser().parseFromString(text, 'text/html');
                    const cleanText = doc.body.innerText.replace(/\s+/g, ' ').substring(0, 15000); // Limitamos tokens
                    return "Contenido extraído (Directo) de " + args.url + ": " + cleanText;

                } catch(e) {
                    try {
                        console.log("⚠️ [JanIA Web Reader] Direct fetch failed, trying Proxy...", e);
                        // Intento 2: Proxy AllOrigins (Gratuito y confiable para textos planos)
                        // API returns JSON: { contents: "<html>..." }
                        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(args.url);
                        const r = await fetch(proxyUrl);
                        if (!r.ok) throw new Error("Proxy failed");
                        
                        const data = await r.json();
                        const text = data.contents; // Extract HTML from JSON
                        
                        if (!text) throw new Error("Empty proxy response");

                        const doc = new DOMParser().parseFromString(text, 'text/html');
                        // Eliminamos scripts y estilos para limpiar tokens
                        const scripts = doc.querySelectorAll('script, style, noscript, iframe');
                        scripts.forEach(s => s.remove());
                        
                        const cleanText = doc.body.innerText.replace(/\s+/g, ' ').substring(0, 15000);
                        return `[SISTEMA]: Lectura exitosa vía Proxy de ${args.url}.\nCONTENIDO: ${cleanText}`;
                    } catch (finalError) {
                        return "Error técnico leyendo la URL. El sitio web tiene protecciones anti-bot fuertes. Pídele al usuario copiar y pegar el texto clave."; 
                    }
                }
            case 'get_location_details':
                try {
                    const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(args.address + ', Bogotá') + '&key=' + MAPS_API_KEY;
                    const res = await fetch(geocodeUrl);
                    const data = await res.json();
                    if (data.status === 'OK') {
                        const result = data.results[0];
                        const loc = result.geometry.location;
                        this.memory.property_data.lat = loc.lat;
                        this.memory.property_data.lng = loc.lng;
                        this.memory.property_data.direccion_normalizada = result.formatted_address;
                        
                        // Extract Neighborhood/Locality
                        let barrio = '';
                        let localidad = '';
                        
                        result.address_components.forEach(c => {
                            if (c.types.includes('neighborhood') || c.types.includes('sublocality_level_1')) {
                                barrio = c.long_name;
                            }
                            if (c.types.includes('sublocality_level_2') && !barrio) { // Fallback
                                barrio = c.long_name;
                            }
                            if (c.types.includes('locality')) {
                                localidad = c.long_name;
                            }
                        });

                        this.memory.property_data.barrio = barrio || 'Zona Detectada';
                        this.memory.property_data.localidad = localidad;

                        console.log("📍 [JanIA Maps] Ubicación encontrada:", { barrio, localidad, lat: loc.lat });

                        return `Ubicación satelital confirmada: ${result.formatted_address}. Barrio/Sector detectado: ${barrio}. Coordenadas: ${loc.lat}, ${loc.lng}. (MUESTRA EL MAPA AHORA).`;
                    }
                    return "No pude localizar esa dirección exacta en el mapa satelital. Pide al usuario que verifique la nomenclatura o envíe un punto de referencia.";
                } catch(e) { return "Error técnico conectando con Satélite de Google Maps."; }
            case 'trigger_auth':
                // Retornamos un mensaje de sistema para el Reflex Model
                return "SISTEMA: Tarjeta de registro desplegada. Dile: 'Vecino, para que mi algoritmo RAG pueda cruzar los datos de tu predio con el POT y darte un avalúo precisión Oro, necesito que iniciemos sesión. Es rápido y blinda tu información.'";
            
            case 'offer_plans':
                return "SISTEMA: Tarjetas de precios desplegadas en pantalla. Dile: 'Aquí tienes nuestros planes diseñados para propietarios inteligentes. El Plan Oro es el más completo (Incluye Perito Oficial) para lo que buscas.'";

            case 'pricing_calculator':
                try {
                     // args expect: { plan, tipo, estrato, area, valor }
                     // args expect: { plan, tipo, estrato, area, valor }
                     
                     // Helper de limpieza para "500 millones", "500m", etc.
                     const parseMonto = (val) => {
                        if (!val) return 0;
                        if (typeof val === 'number') return val;
                        let s = val.toString().toLowerCase().replace(/,/g, '.').replace(/\$/g, '');
                        let multi = 1;
                        if (s.includes('millón') || s.includes('millones') || s.includes(' m')) multi = 1000000;
                        if (s.includes('billón') || s.includes('billones') || s.includes(' b')) multi = 1000000000;
                        return parseFloat(s) * multi;
                     };

                     const cleanNumber = (val) => {
                        if (typeof val === 'number') return val;
                        if (!val) return 0;
                        const match = val.toString().match(/[\d\.]+/);
                        return match ? parseFloat(match[0]) : 0;
                     };

                     const params = {
                        plan: (args.plan || 'esmeralda').toLowerCase(),
                        tipoInmueble: (args.tipo || 'residencial').toLowerCase(),
                        estrato: parseInt(cleanNumber(args.estrato)) || 3,
                        areaM2: cleanNumber(args.area || args.area_construida || args.m2),
                        valorEstimadoJanIA: parseMonto(args.valor)
                     };

                     // --- CRITICAL MEMORY SYNC ---
                     // Ensure the UI sees the same data used for calculation
                     if (params.areaM2 > 0) this.memory.property_data.area = params.areaM2;
                     if (params.estrato > 0) this.memory.property_data.estrato = params.estrato;
                     
                     // PLAN VISIBILITY FILTER (Smart UI)
                     if (params.plan === 'oro') {
                        this.memory.plan_filter = ['oro'];
                     } else if (params.plan === 'esmeralda') {
                        this.memory.plan_filter = ['esmeralda'];
                     } else {
                        // Default comparison or explicit 'all'
                        this.memory.plan_filter = ['oro', 'esmeralda']; 
                     }
                     // -----------------------------

                     console.log("💰 [Pricing Tool] Calculando con:", params);
                     const result = liquidarServiciosVecy(params);
                     
                     if (result.special_messsage) {
                        return `[SISTEMA - ALERTA DE GRAN ACTIVO]: El valor supera el límite automático. Dile al cliente: "${result.special_messsage}". Sugiérele agendar una reunión corporativa.`;
                     }

                     const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
                     
                     return `[SISTEMA - COTIZACIÓN GENERADA]:
                     - Plan: ${params.plan.toUpperCase()}
                     - Precio Base: ${formatter.format(result.precio_base)}
                     - IVA (0%): ${formatter.format(result.iva)}
                     - TOTAL A PAGAR: ${formatter.format(result.total_a_pagar)}
                     - MENSAJE LEGAL OBLIGATORIO: "${result.mensaje_legal}"
                     
                     INSTRUCCIÓN DE VENTA PERSUASIVA:
                     1. Presenta el precio con autoridad.
                     2. Si es PLAN ORO: Resalta que incluye "Certificación RAA, Visita Técnica y Validez Jurídica". Justifica el valor.
                     3. Si es PLAN ESMERALDA: Véndelo como "Velocidad y Precisión de Mercado Instantánea".
                     4. ¡CIERRA LA VENTA! Pregunta: "¿Procedemos a generar tu link de pago para iniciar ya mismo?"`;

                } catch (e) {
                    return "Error calculando precios. Verifica que tengas todos los datos (Area, Estrato, Valor Estimado). Pídelos de nuevo si hace falta.";
                }

            case 'deep_research_property':
                try {
                    // REAL WEB SEARCH (Google Programmable Search Engine)
                    const searchQuery = `Apartamento venta ${args.query} bogota precio metro cuadrado`; // Enrich query
                    const searchResults = await this._performGoogleSearch(searchQuery);
                    
                    return `[INVESTIGACIÓN DE MERCADO REALIZADA]:
                    Resultados de la web para "${searchQuery}":
                    ${searchResults}
                    
                    INSTRUCCIÓN PARA EL MODELO:
                    Usa estos datos REALES para construir una tabla comparativa o estimación de precio. Si los datos son insuficientes, dilo honestamente.`;
                } catch(e) { 
                    return `Error en investigación web: ${e.message}. Intenta con el conocimiento interno almacenado.`; 
                }

            case 'memorize_valuation':
                try {
                    // Guardamos en Supabase Vector
                    // Asumimos que tenemos solicitud_id en memory, sino pasamos null (la DB lo permite nullable o lo manejamos)
                    // Para ser seguros, usamos 0 o null si no hay ID real.
                    const solId = this.memory.current_solicitud_id || null; 
                    const ok = await memorizeValuation(solId, args.summary, args.price, this.memory.property_data);
                    return ok ? "Avalúo memorizado exitosamente en el Cerebro Vectorial." : "Error guardando memoria.";
                } catch (e) { return "Fallo en memorización."; }

            case 'generate_payment_link':
                // Returns a system token that the UI converts into a clickable Payment Button
                // args: { plan: 'cafe'|'esmeralda'|'oro', estrato: 3 }
                return `[SISTEMA]: Botón de pago generado para Plan ${args.plan.toUpperCase()}. Dile: "Aquí tienes el botón de pago seguro para iniciar de inmediato. 👇"`;

            case 'generate_report_download':
                // Triggers the UI to render the PDF Download Link with current Property Data
                // args: { plan: 'cafe'|'esmeralda'|'oro' }
                return `[SISTEMA]: Link de descarga generado con éxito. Dile: "¡Todo listo! He procesado los datos. Aquí tienes tu informe oficial. 👇"`;

            default: return "Acción no encontrada (Sistema desconocido).";
        }
    }

    async _generateReflexResponse(userText, plan, toolRes, fileDatas) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL, systemInstruction: PERSONALITY_PROMPT });
        const history = this.history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        const chat = model.startChat({ history });
        const instr = `GENERACIÓN DE RESPUESTA FINAL [PROTOCOLO GEMINI 3 SECURE]:
        thought_signature_validation: ${plan.thought_signature || "NO_SIG_PROVIDED"}
        
        Actúa como una experta inmobiliaria humana (JanIA). Tienes estos datos técnicos en tu mente: ${plan.thought_process}. USALOS para responder, pero NUNCA menciones 'Cortex', 'RAG', 'Algoritmo', 'Protocolo' ni 'Cerebro Digital'. Tus herramientas son secretas (como la receta de un chef). Solo entrega el análisis de valor y mercado con naturalidad y autoridad calida.
        
        if (toolRes) console.log("🔧 [Reflex] Integrating Tool Result:", toolRes);
        
        VARIEDAD CREATIVA (CRÍTICO): NO uses frases de cajón repetitivas. Sé espontánea, usa humor inteligente si cabe, y varía tus estructuras de frase. ¡Sorprende al usuario! Tono: ${plan.suggested_response_tone}. ${toolRes ? " Resultado Herramienta (ÚSALO E INTÉGRALO EXTENSAMENTE EN TU RESPUESTA): " + toolRes : ""}`;
        const res = await chat.sendMessage(instr + "\nUsuario: " + userText);
        // Limpieza extra por si el modelo ignora la instrucción
        // Limpieza robusta de JSONs técnicos que el modelo pueda haber filtrado
        let finalText = res.response.text()
            .replace(/\{[\s\S]*?"(action|tool|type)"[\s\S]*?\}/gi, '') 
            .replace(/```json[\s\S]*?```/gi, '') 
            .replace(/\[trigger_auth\]/gi, '') 
            .replace(/\[tool_use\].*?\[\/tool_use\]/gs, '') 
            .replace(/\s*\}\s*$/g, '') 
            .trim();

        if (!finalText || finalText.length < 5) {
            console.warn("⚠️ [Reflex] Response was empty after cleaning. Activating Backup Generator.");
            // Si el modelo 3.0 devolvió vacío (o solo JSON), usamos el respaldo para hablar.
            const backupModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const backupRes = await backupModel.generateContent(`Eres JanIA. El usuario dijo: "${userText}". Tu pensamiento previo fue: "${plan.thought_process}". Genera una respuesta CORTA y amable invitándolo a continuar.`);
            finalText = backupRes.response.text();
        }

        return finalText;
    }

    // --- GENERACIÓN DE TÍTULOS INTELIGENTE ---
    async generateChatTitle(firstMessage, fullHistory = []) {
        try {
            const historyText = fullHistory.slice(0, 3).map(m => m.content).join(" | ");
            const context = `Mensaje: "${firstMessage}". Contexto: ${historyText}`;
            
            const model = this.genAI.getGenerativeModel({ model: TITLING_MODEL });
            const prompt = `Genera un TÍTULO DE 3 A 5 PALABRAS para este chat inmobiliario.
            - NO uses comillas.
            - DEBE ser descriptivo (ej: "Avalúo Casa Chapinero", "Consulta Normativa Usaquén").
            - Contexto: ${context}`;

            const res = await model.generateContent(prompt);
            const title = res.response.text().trim();
            console.log("🏷️ [Titling] Generated Title:", title);
            return title;
        } catch (e) {
            console.warn("⚠️ Titling failed, using default.", e);
            return "Consulta Inmobiliaria";
        }
    }

    // --- CEREBRO: CONEXIÓN A BASE DE DATOS ---
    async _autoSaveToDatabase() {
        if (!this.memory.is_registered || !this.memory.property_data?.direccion_normalizada) return;
        
        // Mapeo de Memoria -> SQL (Tabla 'solicitudes')
        const datosSQL = {
            cliente_nombre: this.memory.user_name || 'Usuario Anónimo',
            // cliente_email: se podría obtener si se pasa el objeto user completo
            direccion_inmueble: this.memory.property_data.direccion_normalizada,
            ciudad: 'Bogotá', // Por defecto según reglas
            tipo_inmueble: this.memory.property_data.tipo_inmueble || null,
            barrio: this.memory.property_data.barrio || 'N/A',
            latitud: this.memory.property_data.lat || 4.6097,
            longitud: this.memory.property_data.lng || -74.0817,
            area_construida: this.memory.property_data.area || 0,
            distribucion_espacial: this.memory.property_data.distribucion || [],
            source_url: this.memory.property_data.last_link || null,
            // Guardar estado de documentos
            documentos_estado: {
                predial: this.memory.property_data.documents?.some(d => d.name.toLowerCase().includes('predial')) || false,
                escrituras: this.memory.property_data.documents?.some(d => d.name.toLowerCase().includes('escritura')) || false,
                certificado_libertad: this.memory.property_data.documents?.some(d => d.name.toLowerCase().includes('libertad')) || false
            },
            galeria_imagenes: this.memory.property_data.documents?.filter(d => d.url).map(d => ({ url: d.url, name: d.name })) || []
        };

        console.log("💾 [JanIA DB]: Guardando estado del inmueble...", datosSQL);
        // Usamos crearSolicitud (que hace un insert). 
        // TODO: Idealmente debería ser un 'upsert' usando algún ID de sesión si ya existe.
        // Por ahora, para no romper, solo lo llamamos si tenemos dirección.
        // Guardar solicitud de avalúo
        await crearSolicitud(datosSQL);

        // --- STEP 4: MEMORY UPDATE & CHAT HISTORY ---
        // Save to Local History
        this.history.push({ role: 'user', content: this.memory.last_user_message || 'User' }); // Use stored message or placeholder
        // Note: this.history might be updated elsewhere, but here we enforce it for safety if needed.
        // Actually, _generateReflexResponse uses a local history array mapped from this.history.
        // We should rely on the main processUserMessage to push to this.history? 
        // No, processUserMessage loop usually pushes to history. 
        // Let's just save the CURRENT state of history which should already have the messages.
        
        // Save to Supabase (Real-Time Chat History)
        if (this.memory.is_registered) { 
             try {
                // Generate Title only if it's a new conversation (or short history)
                let title = "Nuevo Chat"; 
                if (this.history.length <= 4) {
                    title = await this.generateChatTitle(this.history[0]?.content || "Inicio", this.history);
                }
                
                // Assuming saveChatToHistory is available globally or imported
                await saveChatToHistory(this.uid, this.history, title);
             } catch(err) {
                 console.warn("⚠️ Error saving chat history:", err);
             }
        }
    }

    async _fallbackReflex(u) {
        try {
            // Intenta uso directo del modelo principal
            const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL });
            const res = await model.generateContent("Eres JanIA. SÉ BREVE. Responde a: " + u);
            return { text: res.response.text() };
        } catch (e) {
            console.error("❌ CRITICAL: Reflex Model Failed (3.0 Pro). Error:", e);
            try {
                // CAPA DE SEGURIDAD: Si falla el 3.0 (por fecha o carga), usamos el 1.5 Flash infalible
                console.log("⚠️ Switching to Backup 1.5 Flash...");
                const backupModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
                const res = await backupModel.generateContent("Eres JanIA (Modo Respaldo). Responde breve y amable a: " + u);
                const text = res.response.text();
                console.log("✅ Backup Response Generated:", text);
                return { text: text };
            } catch (e2) {
                console.error("☠️ FATAL: Backup Model also failed:", e2);
                return { text: "Estamenos recalibrando mis motores neuronales a la Serie 3. 🧠✨ Dame un momento y vuelve a intentarlo." };
            }
        }
    }

    // --- EXPOSED METHOD FOR EXTERNAL SERVICES (Like historyService) ---
    async generateTitle(promptText) {
        try {
            const model = this.genAI.getGenerativeModel({ model: TITLING_MODEL });
            const res = await model.generateContent(promptText);
            return res.response.text().trim();
        } catch (e) {
            console.warn("External Titling failed:", e);
            return "Consulta Inmobiliaria";
        }
    }
    async _performGoogleSearch(query) {
        if (!SEARCH_CX || !SEARCH_API_KEY) {
            console.warn("⚠️ Google Search Keys missing.");
            return "No puedo buscar en internet (Faltan llaves de configuración).";
        }
        
        try {
            console.log("🌐 [JanIA Web] Buscando:", query);
            const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_CX}&q=${encodeURIComponent(query)}&num=4&gl=co`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error.message);
            if (!data.items || data.items.length === 0) return "No encontré resultados públicos relevantes o recientes.";

            return data.items.map(item => `* ${item.title}: ${item.snippet} (${item.link})`).join("\n");
        } catch (error) {
            console.error("❌ Google Search Error:", error);
            return "Hubo un error técnico consultando la web.";
        }
    }

    reset() { this.memory = { ...INITIAL_MEMORY }; this.history = []; }
    getMemory() { return this.memory; }
    setMemory(m) { if(m) this.memory = m; }
}

export const janIACore = new JanIACore();
