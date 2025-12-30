import { GoogleGenerativeAI } from "@google/generative-ai";
import { crearSolicitud } from './solicitudesService';
import { liquidarServiciosVecy } from './pricingService'; // Pricing Logic Connection
import { searchRegulatoryContext, searchSimilarValuations, memorizeValuation } from './ragService'; // RAG Connection


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
export const CORTEX_MODEL = "gemini-3-pro-preview"; // RESTORED: Pro model for maximum intelligence 
export const REFLEX_MODEL = "gemini-3-flash-preview";
export const VISION_MODEL = "gemini-3-flash-preview"; 
export const TITLING_MODEL = "gemini-3-flash-preview"; 
export const RESEARCH_MODEL = "deep-research-pro-preview-12-2025";

// UX: Dynamic Thinking States
// UX: Dynamic Thinking States
export const THINKING_MESSAGES = {
    INITIAL: "JanIA está pensando...",
    FILES: "JanIA está escaneando tus archivos...",
    WEB: "JanIA está navegando en la web...",
    COMPARING: "JanIA está buscando en el barrio...",
    PRICING: "JanIA está cotizando tu plan...",
    WRITING: "JanIA está escribiendo...",
    REPORT: "JanIA está redactando tu informe..."
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
    if (name) return "¡Hola de nuevo, " + title + " " + name + "! Qué gusto saludarte. Soy JanIA, tu vecina experta en avalúos. ¿En qué inmueble del barrio vamos a trabajar hoy?";
    // Variaciones CÁLIDAS de servicio al cliente
    const greetings = [
        "¡Hola, vecino! Me encanta que estés aquí. ¿Cómo te encuentras el día de hoy? Antes de empezar, me gustaría saber: **¿Cómo te llamas?**",
        "¡Bienvenido, vecino! Espero que estés teniendo un día excelente. Soy JanIA, y estoy lista para ayudarte. Para mayor confianza, cuéntame: **¿Cuál es tu nombre?**",
        "Hola, vecino. Qué alegría saludarte. Soy JanIA, tu avaluadora de confianza. Para poder dirigirme a ti como te mereces: **¿Cómo te gusta que te llamen?**",
        "¡Hola! Un gusto recibirte en Vecy Avalúos. Aquí estoy para servirte con la mejor energía. Primero lo primero: **¿Con quién tengo el gusto hoy?**"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];

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
    }

    updateUserIdentity(user, policiesAccepted = false) {
        // Guardar estado de políticas
        this.memory.policy_accepted = !!policiesAccepted;

        if (!user) {
            this.memory.is_registered = false;
            this.memory.user_name = null;
            return;
        }
        const { name, title } = getNeighborGreeting(user.user_metadata?.full_name || user.firstName);
        if (name) {
            this.memory.user_name = name;
            this.memory.user_title = title;
            this.memory.is_registered = true;
        }
    }

    async processUserMessage(userText, onThinkingUpdate, fileDatas = [], uploadedAttachments = []) {
        // 0. INITIAL STATE UX
        if (onThinkingUpdate) onThinkingUpdate(THINKING_MESSAGES.INITIAL);

        if (uploadedAttachments.length > 0 || fileDatas.length > 0) {
            if (onThinkingUpdate) onThinkingUpdate(THINKING_MESSAGES.FILES);
            
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
                if (plan.next_step.name === 'offer_plans') uiComponent = 'plan_card';
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
        fileDatas.forEach(f => content.push({ inlineData: { mimeType: f.mimeType, data: f.data } }));
        
        console.log(`🧠 [Cortex] Sending ${fileDatas.length} files to Gemini. Prompt length: ${prompt.length}`);
        
        const res = await model.generateContent(content);
        return JSON.parse(res.response.text());
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
                        const loc = data.results[0].geometry.location;
                        this.memory.property_data.lat = loc.lat;
                        this.memory.property_data.lng = loc.lng;
                        this.memory.property_data.direccion_normalizada = data.results[0].formatted_address;
                        return "Ubicación verificada.";
                    }
                    return "No localizada.";
                } catch(e) { return "Error Mapas."; }
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

                     const params = {
                        plan: (args.plan || 'esmeralda').toLowerCase(),
                        tipoInmueble: (args.tipo || 'residencial').toLowerCase(),
                        estrato: parseInt(args.estrato) || 4,
                        areaM2: parseFloat(args.area) || 0,
                        valorEstimadoJanIA: parseMonto(args.valor)
                     };

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
                    // LLAMADA AL MODELO DE INVESTIGACIÓN (RESEARCH_MODEL)
                    const researchModel = this.genAI.getGenerativeModel({ model: RESEARCH_MODEL });
                    const researchPrompt = `INVESTIGACIÓN FORENSE INMOBILIARIA:
                    Busca en fuentes fiables (Portales Inmobiliarios Colombia, Metrocuadrado, Finca Raíz, Lonjas) datos sobre: ${args.query}.
                    Retorna: Precios m2 promedio en la zona, Arriendos estimados, y Tendencia de valorización. Sé técnico y preciso.`;
                    
                    const res = await researchModel.generateContent(researchPrompt);
                    const findings = res.response.text();
                    return `[INVESTIGACIÓN DEEP COMPLETA]: ${findings}`;
                } catch(e) { 
                    return `Error en investigación profunda: ${e.message}. Intenta una búsqueda web normal.`; 
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

            default: return "Acción no encontrada.";
        }
    }

    async _generateReflexResponse(userText, plan, toolRes, fileDatas) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL, systemInstruction: PERSONALITY_PROMPT });
        const history = this.history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        const chat = model.startChat({ history });
        const instr = `GENERACIÓN DE RESPUESTA FINAL: Actúa como una experta inmobiliaria humana (JanIA). Tienes estos datos técnicos en tu mente: ${plan.thought_process}. USALOS para responder, pero NUNCA menciones 'Cortex', 'RAG', 'Algoritmo', 'Protocolo' ni 'Cerebro Digital'. Tus herramientas son secretas (como la receta de un chef). Solo entrega el análisis de valor y mercado con naturalidad y autoridad calida. Tono: ${plan.suggested_response_tone}. ${toolRes ? " Resultado Herramienta (ÚSALO PERO NO MENCIONES LA HERRAMIENTA): " + toolRes : ""}`;
        const res = await chat.sendMessage(instr + "\nUsuario: " + userText);
        // Limpieza extra por si el modelo ignora la instrucción
        // Limpieza robusta de JSONs técnicos que el modelo pueda haber filtrado
        return res.response.text()
            .replace(/\{[\s\S]*?"(action|tool|type)"[\s\S]*?\}/gi, '') // Elimina { "action": ... }
            .replace(/```json[\s\S]*?```/gi, '') // Elimina bloques de código JSON explicativos
            .replace(/\[trigger_auth\]/gi, '') // CLEANER: Elimina el texto [trigger_auth]
            .replace(/\s*\}\s*$/g, '') // CLEANER EXTRA: Elimina '}' sueltos al final
            .trim();
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
        await crearSolicitud(datosSQL);
    }

    async _fallbackReflex(u) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL });
        const res = await model.generateContent("Eres JanIA. Responde a: " + u);
        return { text: res.response.text() };
    }

    async generateChatTitle(m) { return "Avalúo Vecy"; }
    reset() { this.memory = { ...INITIAL_MEMORY }; this.history = []; }
    getMemory() { return this.memory; }
    setMemory(m) { if(m) this.memory = m; }
}

export const janIACore = new JanIACore();
