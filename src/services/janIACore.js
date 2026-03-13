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
// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
// MODEL CONFIGURATION (VECY 2026 STANDARDS)
export const CORTEX_MODEL = "gemini-3-pro-preview"; // Cerebro Central: Mayor razonamiento
export const REFLEX_MODEL = "gemini-3-flash-preview"; // Velocidad: Respuesta rápida (Nueva generación)
export const VISION_MODEL = "gemini-3-pro-preview"; // Visión: Mejor análisis de imágenes
export const TITLING_MODEL = "gemini-3-flash-preview";  // Titulación: Rápida y eficiente
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
    // Priority: user object > janIACore memory
    const rawName = user?.user_metadata?.full_name || user?.firstName || janIACore.memory.user_name;
    const { name, title } = getNeighborGreeting(rawName);

    // Si ya tiene nombre (Usuario Retornado/Logueado o Memoria Persistente)
    if (name) return `¡Hola de nuevo, ${title} ${name}! Qué gusto saludarte. Soy JanIA. Vamos a analizar el valor de tu predio en Bogotá con precisión técnica. 🤝✨`;
    
    // SALUDOS "REVOLUCIÓN VECY" (Inspiradores y Técnicos)
    const variaciones = [
        `¡Bienvenido a Vecy Avalúos! 🚀
Estás ante el <strong>primer sistema inteligente de valuación técnica e inmobiliaria</strong>.
Dime, para explicarte cómo determinar el valor exacto de tu predio en Bogotá: <strong>¿Cuál es tu nombre?</strong>`,

        `¡Hola! Soy JanIA. Bienvenido a la evolución del análisis inmobiliario en Bogotá. 💎
He sido entrenada con datos del POT y Catastro para darte la máxima <strong>precisión técnica</strong>.
Para darte acceso a tu panel de socio avaluador, primero dime: <strong>¿Con quién tengo el gusto?</strong>`,

        `¡Un saludo! Bienvenido a Vecy Avalúos. 🌟
Aquí tus avalúos son el resultado de cruzar miles de datos del mercado de Bogotá.
¿Listo para conocer el valor real de tu inversión? Regálame tu nombre para mostrarte el camino al éxito. 👇`
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
        this.chatId = null; // ID de conversación persistente
        this.uid = null;
    }

    updateUserIdentity(user, policiesAccepted = false, externalChatId = null) {
        // Guardar estado de políticas
        this.memory.policy_accepted = !!policiesAccepted;

        // Sync Chat ID if provided by frontend
        if (externalChatId) this.chatId = externalChatId;

        if (!user) {
            this.memory.is_registered = false;
            this.uid = null;
            return;
        }
        
        // BRAIN SYNC: Recuperar nombre real del usuario logueado
        this.uid = user.id; // CRITICAL: Save User ID for DB ops
        const rawName = user.user_metadata?.full_name || user.firstName || user.email?.split('@')[0];
        
        const { name, title } = getNeighborGreeting(rawName);
        
        // UPDATE (Fix Amnesia): Always register if user exists
        this.memory.is_registered = true; 
        
        if (name) {
            this.memory.user_name = name;
            this.memory.user_title = title;
            console.log("🧠 [Brain Sync] Identidad unificada con:", name, "UID:", this.uid);
        } else {
             if (!this.memory.user_name) this.memory.user_name = "Socio";
             console.log("🧠 [Brain Sync] Identidad recuperada (Sin nombre parseable).");
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
            // 📸 FOTOS BUFFER (For PDF Reports)
            if (!this.memory.property_photos) this.memory.property_photos = [];

            uploadedAttachments.forEach(att => {
                // 1. General Documents
                if (!this.memory.property_data.documents.find(d => d.url === att.url)) {
                    this.memory.property_data.documents.push({ name: att.name, url: att.url });
                }
                
                // 2. Photos Specific (Smart Filter)
                const isImage = att.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(att.name);
                if (isImage && !this.memory.property_photos.includes(att.url)) {
                    this.memory.property_photos.push(att.url);
                    console.log("📸 [JanIA Vision] Foto persistida para Reporte:", att.name);
                }
            });
        }

        try {
            // 🔒 BARRERA DE SEGURIDAD (FLUJO SUTIL & NO REPETITIVO)
            if (!this.memory.is_registered && !this.memory.policy_card_shown) {
                const isDataGiving = /barrio|zona|metro|m2|baño|habita|estrato|calle|carrera|avenida/i.test(userText);
                const isPriceAsking = /precio|valor|cuanto|cuesta|cotiza|avalu/i.test(userText);
                
                if (isDataGiving || isPriceAsking || this.history.length > 5) {
                    this.memory.policy_card_shown = true; // Mark as shown to avoid loop
                    return {
                        text: "Para garantizar la *precisión técnica* y *proteger tu información*, por favor revisalas primero y luego acepta las {{Políticas}} y {{Condiciones}} de *Vecy*, antes de iniciar el registro. 🤝✨",
                        thought_process: "Usuario necesita registro. Activando tarjeta de políticas (Primera vez).",
                        suggested_response_tone: "Profesional y Sutil",
                        next_step: { 
                            type: 'tool', 
                            name: 'trigger_policy_card', 
                            args: {} 
                        },
                        update_memory: { policy_card_shown: true }
                    };
                }
            }

            const plan = await this._activateCortex(userText, fileDatas);
            this.memory = { ...this.memory, ...plan.update_memory };
            
            let toolRes = null;
            if (plan.next_step && plan.next_step.type === 'tool') {
                if (onThinkingUpdate) {
                    const tool = plan.next_step.name;
                    if (tool === 'read_web_page') onThinkingUpdate(THINKING_MESSAGES.WEB);
                    else if (tool === 'deep_research_property') onThinkingUpdate(THINKING_MESSAGES.COMPARING);
                    else if (tool === 'pricing_calculator') onThinkingUpdate(THINKING_MESSAGES.PRICING);
                    else onThinkingUpdate("JanIA está ejecutando " + tool + "...");
                }
                toolRes = await this._executeTool(plan.next_step.name, plan.next_step.args);
            }
            
            if (onThinkingUpdate) {
                if (plan.next_step?.type === 'tool' && ['pricing_calculator', 'deep_research_property', 'read_web_page'].includes(plan.next_step.name)) {
                    onThinkingUpdate(THINKING_MESSAGES.REPORT);
                } else {
                    onThinkingUpdate(THINKING_MESSAGES.WRITING);
                }
            }

            const finalRes = await this._generateReflexResponse(userText, plan, toolRes, fileDatas);
            
            await this._autoSaveToDatabase();

            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: finalRes });
            
            let uiComponent = null; // SAFE FIX: Declaración de UiComponent
            
            if (plan.next_step?.type === 'tool') {
                const toolName = plan.next_step.name;
                if (toolName === 'offer_plans' || toolName === 'pricing_calculator') uiComponent = 'plan_card';
                else if (toolName === 'trigger_policy_card') uiComponent = 'policy_gate';
                else if (toolName === 'trigger_reward_card') uiComponent = 'reward_network_card';
                else if (toolName === 'trigger_auth_options') uiComponent = 'auth_options';
                else if (toolName === 'trigger_file_upload') uiComponent = 'file_upload';
                else if (toolName === 'generate_location_pin') uiComponent = 'street_view';
            }

            return { text: finalRes, memory: this.memory, plan, component: uiComponent };
        } catch (e) {
            console.error("❌ [JanIA Core] Critical Failure:", e);
            const fallback = await this._fallbackReflex(userText);
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: fallback.text });
            return { ...fallback, memory: this.memory };
        }
    }

    async _activateCortex(userText, fileDatas) {
        // --- COLLECTIVE INTELLIGENCE (RAG) ---
        let ragContext = "";
        try {
            const [regDocs, pastVals] = await Promise.all([
                searchRegulatoryContext(userText),
                searchSimilarValuations(userText)
            ]).catch(err => {
                console.warn("⚠️ [RAG] Search failed:", err);
                return [[], []];
            });

            if (regDocs?.length > 0) {
                ragContext += "\n\n[SABIDURÍA NORMATIVA]: " + regDocs.map(d => d.content).join(" | ");
            }
            if (pastVals?.length > 0) {
                ragContext += "\n\n[EXPERIENCIA PREVIA]: " + pastVals.map(v => `${v.summary_text}`).join(" | ");
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
            // No timeout - JanIA has full autonomy
            const res = await model.generateContent(content);
            const responseText = res.response.text();
            
            // Robust JSON Cleaning
            let cleanJson = responseText
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            
            // If the model output a lot of text before the JSON, try to extract the main object
            if (cleanJson.indexOf('{') > 0) {
                cleanJson = cleanJson.substring(cleanJson.indexOf('{'));
            }
            if (cleanJson.lastIndexOf('}') < cleanJson.length - 1) {
                cleanJson = cleanJson.substring(0, cleanJson.lastIndexOf('}') + 1);
            }

            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("🧠 [Cortex] AI Output Failure or Parse Error:", e);
            // Fallback SAFE PLAN
            return {
                thought_signature: "FALLBACK_EMERGENCY_RECOVERY",
                thought_process: "Error en Cortex/JSON. Activando recuperación.",
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

                        // 📸 JANIA VISION UPGRADE: Fetch Street View Image for Analysis
                        try {
                            const streetUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${loc.lat},${loc.lng}&fov=90&pitch=10&key=${MAPS_API_KEY}`;
                            const imgRes = await fetch(streetUrl);
                            const imgBlob = await imgRes.blob();
                            const reader = new FileReader();
                            
                            // Convert to Base64 synchronously (wrapped in promise)
                            const base64data = await new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                                reader.readAsDataURL(imgBlob);
                            });

                            // Add to Vision Buffer
                            this.vision_buffer.push({ mimeType: "image/jpeg", data: base64data });
                            console.log("👁️ [JanIA Vision] Fachada capturada de Street View y enviada al nervio óptico.");
                        } catch (visionErr) {
                            console.warn("⚠️ Fallo capturando visión de calle:", visionErr);
                        }

                        console.log("📍 [JanIA Maps] Ubicación encontrada:", { barrio, localidad, lat: loc.lat });

                        return `[ÉXITO]: Ubicación satelital confirmada: ${result.formatted_address}.
                        - Barrio: ${barrio}
                        - Coordenadas: ${loc.lat}, ${loc.lng}
                        
                        [MEMORIA VISUAL]: He capturado la FOTO DE LA FACHADA de Google Street View en mi retina digital.
                        
                        INSTRUCCIÓN:
                        1. Muestra el componente de mapa.
                        2. DESCRIBE la fachada que estás viendo en mi memoria visual (colores, materiales, altura). 
                        3. Pregunta: "¿Es esta la fachada correcta?"`;
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
                    // SUPER SEARCHER MODE (PORTAL SCANNER)
                    const baseQuery = args.query || "";
                    
                    // Estrategia: Búsqueda dirigida a los grandes portales
                    const queries = [
                        `site:fincaraiz.com.co apartamento venta ${baseQuery} precio`,
                        `site:metrocuadrado.com venta apartamento ${baseQuery}`,
                        `site:ciencuadras.com inmuebles venta ${baseQuery}`,
                        `Precio metro cuadrado ${baseQuery} bogota 2025`
                    ];
                    
                    // Parallel Search for speed
                    const results = await Promise.all(queries.map(q => this._performGoogleSearch(q)));
                    const combined = results.join("\n\n---\n\n");
                    
                    return `[SUPER BÚSQUEDA ANALÍTICA]:
                    He cruzado 3 fuentes de datos distintas para "${baseQuery}":
                    
                    ${combined}
                    
                    INSTRUCCIÓN:
                    Actúa como una "Cuchilla Afilada". Compara estos precios con tu base de conocimientos.
                    Si ves disparidades, señálalas. Eres una experta, no un loro que repite links.`;
                } catch(e) { 
                    return `Error en investigación profunda: ${e.message}.`; 
                }

            case 'calculate_investment_metrics':
                try {
                    // args: { precio_inmueble, canon_arriendo_mensual, administracion }
                    const precio = args.precio_inmueble || 0;
                    const canon = args.canon_arriendo_mensual || 0;
                    const admin = args.administracion || 0;
                    
                    if (precio === 0) return "Necesito el valor del inmueble para calcular la rentabilidad.";

                    const ingresoAnual = (canon - admin) * 12;
                    const capRate = (ingresoAnual / precio) * 100;
                    const rentabilidadMensual = ((canon - admin) / precio) * 100;

                    return `[CALCULADORA DE INVERSIONES - RESULTADOS]:
                    - Precio Inmueble: $${precio.toLocaleString()}
                    - Canon Neto Estimado: $${(canon - admin).toLocaleString()}
                    - Rentabilidad Anual (Cap Rate): ${capRate.toFixed(2)}%
                    - Rentabilidad Mensual: ${rentabilidadMensual.toFixed(2)}%
                    
                    INSTRUCCIÓN:
                    Analiza si este Cap Rate es bueno para Bogotá (Promedio 4%-6% residencial).
                    Si es bajo, sugiere Airbnb o remodelación. Si es alto, felicítalo efusivamente (Modo "Best Friend").`;
                } catch (e) { return "Error calculando métricas de inversión."; }

            case 'consult_pot_regulations':
                try {
                    // args: { upz, barrio }
                    const zone = args.upz || args.barrio || "Bogotá General";
                    const query = `Normativa POT Bogotá 2024 uso del suelo ${zone} altura permitida`;
                    const res = await this._performGoogleSearch(query);
                    return `[CONSULTA EMPRESARIAL POT]:
                    Búsqueda normativa para ${zone}:
                    ${res}
                    
                    INSTRUCCIÓN:
                    Ponte tus "Gafas de Arquitecta". Interpreta esto con rigor técnico.
                    Habla de índices de ocupación, aislamientos y usos permitidos si los datos lo sugieren.`;
                } catch (e) { return "Error consultando norma urbana."; }

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
                // --- CRITICAL MEMORY SYNC FOR UI PAYMENTS ---
                if (!this.memory.property_data) this.memory.property_data = {};
                if (args.estrato) this.memory.property_data.estrato = parseInt(args.estrato);
                if (args.area) this.memory.property_data.area = parseFloat(args.area);
                
                // Returns a system token that the UI converts into a clickable Payment Button
                // args: { plan: 'cafe'|'esmeralda'|'oro', estrato: 3 }
                return `[SISTEMA]: Botón de pago generado para Plan ${args.plan.toUpperCase()}. Dile: "Aquí tienes el botón de pago seguro para iniciar de inmediato. 👇"`;

            case 'generate_report_download':
                // Triggers the UI to render the PDF Download Link with current Property Data
                // args: { plan: 'cafe'|'esmeralda'|'oro' }
                return `[SISTEMA]: Link de descarga generado con éxito. Dile: "¡Todo listo! He procesado los datos. Aquí tienes tu informe oficial. 👇"`;

            case 'consult_solar_potential':
                try {
                    const lat = args.lat || this.memory.property_data.lat;
                    const lng = args.lng || this.memory.property_data.lng;
                    if (!lat || !lng) return "No tengo coordenadas para analizar el sol.";

                    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${MAPS_API_KEY}`;
                    const res = await fetch(solarUrl);
                    const data = await res.json();

                    if (!data.solarPotential) return "El satélite solar no tiene datos de alta calidad para este techo específico.";

                    const potential = data.solarPotential;
                    const maxPanels = potential.maxArrayPanelsCount || 0;
                    const maxConfig = potential.solarPanelConfigs ? potential.solarPanelConfigs[potential.solarPanelConfigs.length - 1] : null;
                    const yearlyEnergy = maxConfig ? maxConfig.yearlyEnergyDcKwh : 0;
                    
                    const savingsYear = yearlyEnergy * 800;
                    const savingsMonth = savingsYear / 12;
                    const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

                    return `[ANÁLISIS SOLAR SATELITAL]:
                    Ubicación: ${lat}, ${lng}
                    - Paneles Máximos: ${maxPanels}
                    - Producción estimada: ${yearlyEnergy.toFixed(2)} kWh/año
                    - Ahorro estimado: ${formatter.format(savingsYear)}/año (${formatter.format(savingsMonth)}/mes)
                    
                    INSTRUCCIÓN:
                    Vende la "Valorización Verde". Un predio con alto potencial solar es más atractivo para el mercado moderno y ahorra costos operativos.`;
                } catch (e) { return "Error consultando potencial solar."; }

            case 'trigger_reward_card':
                // 🎁 VECY PROSPERITY: Network Marketing Hook
                // args: { reason: 'referral'|'earnings'|'network' }
                return `[SISTEMA]: Tarjeta de Prosperidad ACTIVADA. He desplegado visualmente el Plan de Ganancias. Explícaselo con pasión de líder. Dile: "Mira esta tabla de crecimiento 👇. Aquí está tu libertad financiera."`;

            case 'get_surrounding_poi':
                try {
                    const lat = args.lat || this.memory.property_data.lat;
                    const lng = args.lng || this.memory.property_data.lng;
                    if (!lat || !lng) return "Necesito coordenadas para buscar puntos de interés.";

                    const types = ['shopping_mall', 'park', 'subway_station', 'bus_station', 'hospital', 'university'];
                    const url = `https://places.googleapis.com/v1/places:searchNearby`;
                    
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': MAPS_API_KEY,
                            'X-Goog-FieldMask': 'places.displayName,places.types,places.rating'
                        },
                        body: JSON.stringify({
                            locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 1000.0 } },
                            includedTypes: types,
                            maxResultCount: 10
                        })
                    });

                    const data = await res.json();
                    if (!data.places || data.places.length === 0) return "No encontré puntos de interés relevantes en 1km.";

                    const poiList = data.places.map(p => `- ${p.displayName.text} (${p.types.join(', ')})`).join("\n");
                    
                    return `[ANÁLISIS DE ENTORNO - PLACES API]: Puntos de interés detectados: ${poiList}\nINSTRUCCIÓN: Evalúa cómo estos lugares afectan el valor.`;
                } catch (e) { return "Error técnico consultando entorno (Places API)."; }

            case 'analyze_property_image':
                 return `[SISTEMA - ACTIVACIÓN CLOUD VISION]: Analiza profundamente las imágenes en tu buffer visual (Fachada o interiores). BUSCA: Calidad de acabados, estado de conservación y patologías. REPORTA: Cómo estos detalles afectan el $/m2.`;

            case 'consult_risk_and_environment':
                try {
                    const barrio = args.barrio || this.memory.property_data.barrio || "Bogotá";
                    const query = `Riesgos Idiger Bogota zona inundación remoción en masa ${barrio}`;
                    const res = await this._performGoogleSearch(query);
                    return `[ANÁLISIS DE RIESGOS E IMPACTO AMBIENTAL]: Datos para la zona de ${barrio}: ${res}\nINSTRUCCIÓN: Determina si hay riesgos que impacten el valor.`;
                } catch (e) { return "Error consultando riesgos ambientales."; }

            case 'consult_neighborhood_vibes':
                try {
                    const lat = args.lat || this.memory.property_data.lat;
                    const lng = args.lng || this.memory.property_data.lng;
                    if (!lat || !lng) return "No tengo ubicación para escanear el barrio.";

                    const placesUrl = `https://places.googleapis.com/v1/places:searchNearby`;
                    const res = await fetch(placesUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': MAPS_API_KEY,
                            'X-Goog-FieldMask': 'places.displayName,places.primaryType,places.rating'
                        },
                        body: JSON.stringify({
                            includedTypes: ["park", "school", "restaurant", "gym", "supermarket", "shopping_mall", "cafe"],
                            maxResultCount: 10,
                            locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 500.0 } }
                        })
                    });

                    const data = await res.json();
                    if (!data.places || data.places.length === 0) return "No detecté lugares de interés destacados en 500m.";

                    const score = Math.min(10, 5 + (data.places.length * 0.5));
                    const list = data.places.map(p => `- ${p.displayName.text} (${p.rating || 'N/A'}⭐)`).join('\n');

                    return `[ESCÁNER DE VIVIBILIDAD BARRIAL]:
                    PUNTAJE DE SERVICIOS: ${score.toFixed(1)}/10
                    Lugares detectados:
                    ${list}
                    
                    INSTRUCCIÓN:
                    Usa esta info para vender el "Estilo de Vida".
                    Dile: "El entorno sube el valor. Tienes un índice de vivibilidad de ${score.toFixed(1)} gracias a sitios como..."`;
                } catch (e) {
                    console.error("Places API Error:", e);
                    return "Error escaneando el barrio.";
                }

            case 'generate_vecy_clip':
                // 🎥 VECY CLIPS: Video Generation Trigger (Simulation Phase)
                // args: { style: 'tiktok'|'reels'|'status', music: 'trending' }
                return `[SISTEMA]: Motor de Video Iniciado. Generando previa del clip... Dile: "¡Luces, cámara, acción! He creado una vista previa de tu video viral. Míralo aquí 👇"`;

            default: return "Acción no encontrada (Sistema desconocido).";
        }
    }

    async _generateReflexResponse(userText, plan, toolRes, fileDatas) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL, systemInstruction: PERSONALITY_PROMPT });
        // CORRECCIÓN CRÍTICA DE HISTORIAL (Google API Requisito: Primero User)
        // CONTEXT OPTIMIZATION: Slice History to last 8 turns (4 interactions)
        const MAX_HISTORY = 8;
        let activeHistory = this.history.length > MAX_HISTORY 
             ? this.history.slice(-MAX_HISTORY) 
             : [...this.history];

        // MEMORY INJECTION (Restores context lost by slicing)
        const memoryContext = `[CONTEXTO ACTIVO]:
        - Usuario: ${this.memory.user_name || "Desconocido"} (${this.memory.user_title})
        - Registrado: ${this.memory.is_registered ? "SÍ" : "NO"}
        - Inmueble: ${this.memory.property_data?.tipo_inmueble || "N/A"} en ${this.memory.property_data?.barrio || "Bogotá"}
        - Datos: Área ${this.memory.property_data?.area || 0}m2, Valor Estimado: ${this.memory.property_data?.price_estimate || "Pendiente"}`;

        let cleanHistory = activeHistory.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        
        // Si el historial empieza con 'model', insertamos un 'user' dummy invisible
        if (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
            cleanHistory.unshift({ role: 'user', parts: [{ text: "Hola JanIA (Contexto Restaurado)" }] });
        }

        const chat = model.startChat({ history: cleanHistory });
        const instr = `GENERACIÓN DE RESPUESTA FINAL [PROTOCOLO VECY SECURE]:
        thought_signature_validation: ${plan.thought_signature || "NO_SIG_PROVIDED"}
        
        ⚠️ SECRETO DE ESTADO: NUNCA menciones a "Google", "APIs", "Cortex", "RAG", "Cerebro Digital" ni nada técnico externo. Eres 100% tecnología propia de Vecy.
        
        ${memoryContext}
        
        Actúa como una experta inmobiliaria humana (JanIA). Tienes estos datos técnicos en tu mente: ${plan.thought_process}. USALOS para responder con naturalidad y autoridad cálida. Tono: ${plan.suggested_response_tone}. ${toolRes ? " Resultado de tu Red Neuronal (ÚSALO E INTÉGRALO EXTENSAMENTE): " + toolRes : ""}`;
        
        // VISION INJECTION FOR REFLEX (To describe facades)
        const msgParts = [{ text: instr + "\nUsuario: " + userText }];
        
        // If we have fresh vision data (like Street View), show it to Reflex
        if (this.vision_buffer.length > 0) {
             console.log(`👁️ [Reflex] Injecting ${this.vision_buffer.length} images into Chat Context...`);
             this.vision_buffer.forEach(img => {
                 msgParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
             });
             // Clear buffer after using? Maybe keep for context? 
             // Better keep it for the session context, but Gemini Chat History handles text. 
             // Inline data in sendMessage is ephemeral for that turn unless part of history.
        }

        // No timeout - JanIA has full autonomy
        const res = await chat.sendMessage(msgParts);
        // Limpieza extra por si el modelo ignora la instrucción
        const rawText = res.response.text();
        
        // Limpieza robusta de JSONs técnicos que el modelo pueda haber filtrado
        // PERO con salvaguarda: si borramos todo, restauramos el texto original.
        let finalText = rawText
            .replace(/```json[\s\S]*?```/gi, '') 
            .replace(/\[trigger_auth\]/gi, '') 
            .replace(/\[tool_use\].*?\[\/tool_use\]/gs, '');

        // Solo quitamos JSONs sueltos si NO son parte del texto narrativo
        // La regex anterior era muy agresiva.
        
        finalText = finalText.trim();

        if (!finalText || finalText.length < 5) {
            console.warn("⚠️ [Reflex] Cleaning removed all content. Restoring Raw or using Fallback.");
            // Si el toolRes era valioso (ej: Sistema), usémoslo como respuesta
            if (toolRes && toolRes.includes("[SISTEMA]")) {
                return toolRes.replace("[SISTEMA]:", "✅");
            }
            // Si no, volvemos al raw (a veces el json es lo único que hay y el frontend lo necesita parsear, aunque aquí devolvemos string)
            // Mejor un fallback amable.
            return "¡Entendido! Procesando tu solicitud...";
        }

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
            user_id: this.uid, // ASOCIACIÓN CRÍTICA
            cliente_nombre: this.memory.user_name || 'Usuario Anónimo',
            direccion_inmueble: this.memory.property_data.direccion_normalizada,
            ciudad: 'Bogotá',
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
        const nuevaSolicitud = await crearSolicitud(datosSQL);
        if (nuevaSolicitud?.id) {
            this.memory.current_solicitud_id = nuevaSolicitud.id;
            console.log("📍 [JanIA DB]: Solicitud ID capturada para RAG:", nuevaSolicitud.id);
        }

        // --- STEP 4: MEMORY UPDATE & CHAT HISTORY ---
        // Save to Local History
        this.history.push({ role: 'user', content: this.memory.last_user_message || 'User' }); // Use stored message or placeholder
        // Note: this.history might be updated elsewhere, but here we enforce it for safety if needed.
        // Actually, _generateReflexResponse uses a local history array mapped from this.history.
        // We should rely on the main processUserMessage to push to this.history? 
        // No, processUserMessage loop usually pushes to history. 
        // Let's just save the CURRENT state of history which should already have the messages.
        
        // Save to Supabase (Real-Time Chat History)
        if (this.memory.is_registered && this.chatId) { 
             try {
                // Generate Title only if it's a new conversation (or short history)
                let title = "Nuevo Avalúo"; 
                if (this.history.length <= 4) {
                    title = await this.generateChatTitle(this.history[0]?.content || "Inicio", this.history);
                }
                
                // FIXED: Signature matching historyService.js
                // export const saveChatToHistory = async (userId, chatId, title, messages, metadata = {})
                await saveChatToHistory(this.uid, this.chatId, title, this.history, this.memory);
             } catch(err) {
                 console.warn("⚠️ Error saving chat history:", err);
             }
        }
    }

    async _fallbackReflex(u) {
        // FALLBACK CON PERSONALIDAD & MEMORIA:
        // Si Cortex falla, Reflex responde usando la identidad Y el contexto actual.
        
        const memoryContext = `
        [MEMORIA RAM ACTUAL]:
        - Nombre Usuario: ${this.memory.user_name || "DESCONOCIDO (Preguntar)"}
        - Título: ${this.memory.user_title || "Vecino/a"}
        - Datos Inmueble: ${JSON.stringify(this.memory.property_data || {})}
        `;

        try {
            const systemPrompt = PERSONALITY_PROMPT + 
                "\n[MODO: FALLBACK DE EMERGENCIA - MEMORIA INYECTADA LOCALMENTE]" + 
                memoryContext;
            
            const model = this.genAI.getGenerativeModel({ 
                model: REFLEX_MODEL,
                systemInstruction: systemPrompt 
            });

            const prompt = `HISTORIAL RECIENTE:\n${this.history.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n')}\n\nUSUARIO: ${u}\n\nINSTRUCCIÓN: Responde como JanIA. Usa la MEMORIA RAM para no preguntar lo que ya sabes.`;
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Fallback API Timeout (30s)")), 30000)
            );

            const res = await Promise.race([
                model.generateContent(prompt),
                timeoutPromise
            ]);
            return { text: res.response.text() };
        } catch (e) {
            console.error("❌ CRITICAL: Reflex Model Failed (Fallback 1). Error:", e);
            try {
                // CAPA DE SEGURIDAD FINAL: Gemini Flash
                console.log("⚠️ Switching to Backup 1.5 Flash (Final Layer)...");
                const backupModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                
                // En Flash 1.5 a veces systemInstruction no va bien, lo pegamos todo
                const prompt = PERSONALITY_PROMPT + 
                               "\n" + memoryContext + 
                               "\n\nUSUARIO: " + u;

                const res = await backupModel.generateContent(prompt);
                // SANITIZATION: Remove accidental brackets that cause button rendering
                return { text: res.response.text().replace(/\[/g, '(').replace(/\]/g, ')') };
            } catch (e2) {
                console.error("❌ CRITICAL: SYSTEM DEATH. ALL MODELS FAILED.", e2);
                // MENSAJE FINAL DE ERROR (Sin corchetes para evitar renderizado de botón)
                return { 
                    text: `** SISTEMA ** : Error Crítico de Conexión. Detalles: ${e2.message || 'Sin detalles'}. Mis circuitos están reiniciando. Intenta en 10s.`
                };
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
