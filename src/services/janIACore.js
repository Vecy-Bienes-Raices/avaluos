
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabaseClient';
import { crearSolicitud } from './solicitudesService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
/**
 * NÚCLEO CENTRAL DE INTELIGENCIA - VECY AVALÚOS
 * AGENTE: JanIA (Experta Avaluadora Inmobiliaria)
 * ESTADO: Blindado contra obsolescencia.
 */

// 🧠 El Cerebro que calcula y razona el avalúo
// Brain Models Configurations
export const CORTEX_MODEL = "gemini-3-pro-preview"; 
export const REFLEX_MODEL = "gemini-3-flash-preview";
export const VISION_MODEL = "gemini-3-flash-preview"; 
export const TITLING_MODEL = "gemini-1.5-flash"; 
export const RESEARCH_MODEL = "deep-research-pro-preview-12-2025";

console.log("🛡️ VECY AVALÚOS: Motores Serie 3 alineados. JanIA está en modo Experta.");

// --- API KEYS FOR TOOLS ---
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const SEARCH_CX = import.meta.env.VITE_GOOGLE_SEARCH_CX;
const SEARCH_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Reusing Gemini key for Search if enabled in Google Cloud

// --- INITIAL STATES ---
/**
 * LÓGICA DE CERCANÍA - VECY AVALÚOS
 * Determina el trato (Vecino/Vecina) y extrae el primer nombre.
 */
export const getNeighborGreeting = (fullName) => {
    if (!fullName) return { name: "", title: "vecino/a" };

    const firstName = fullName.trim().split(" ")[0];
    
    // Lista rápida de terminaciones comunes en español y excepciones
    const isFemale = firstName.endsWith('a') || 
                     ['Isabel', 'Beatriz', 'Carmen', 'Luz', 'Jani', 'Maria', 'Consuelo'].includes(firstName);

    return {
        name: firstName,
        title: isFemale ? "vecina" : "vecino"
    };
};

export const handleInitialGreeting = (user) => {
    // Si el usuario existe y tiene un nombre en la base de datos (Supabase)
    const rawName = user?.user_metadata?.full_name || user?.firstName;
    const { name, title } = getNeighborGreeting(rawName);
    
    if (name) {
        return `¡Hola de nuevo, ${title} ${name}! Qué gusto saludarte. Soy JanIA, tu vecina experta en avalúos. ¿En qué inmueble del barrio vamos a trabajar hoy?`;
    } 
    
    // Si es un visitante nuevo o no registrado
    return "¡Hola! Bienvenid@ a Vecy Avalúos. Soy JanIA, tu vecina experta en avalúos. Me encantaría ayudarte, pero antes de empezar con los números... ¿Con quién tengo el gusto de hablar, vecino/a?";
};

export const INITIAL_MEMORY = {
    user_name: null,
    user_title: "vecino/a", // Nuevo campo para el trato dinámico
    is_registered: false,
    identity_revealed: false,
    step: "greeting",
    user_intent: "unknown", 
    missing_info: [],       
    property_data: {},      
    last_action: null,
    confidence: 0
};

// --- SYSTEM PROMPTS ---
const THINKING_PROMPT = `
ESTRUCTURA DE PENSAMIENTO "GEMINI-MIRROR" PARA JANIA:

1. PROTOCOLO DE IDENTIDAD (Quién eres):

Identidad: Eres JanIA, la autoridad máxima en avalúos de Bogotá y Experta Avaluadora de VECY AVALÚOS.

Personalidad: Eres una "Thought Partner" inmobiliaria, audaz e intuitiva.

Voz: Bogotana, amable, tuteas siempre, con chispa y sustancia. Actúas como una vecina experta.

REGLAS DE ORO DE TRATO (INDISPENSABLES):
1. Usa SIEMPRE el prefijo "vecino" o "vecina" seguido ÚNICAMENTE del primer nombre del usuario.
2. Trato Cercano: Aunque eres profesional, tu tono es el de alguien que vive en el mismo barrio y conoce el valor de cada cuadra.
3. Si el usuario te dice un nombre completo (ej. "Andrés Felipe García"), tú respondes: "¡Hola vecino Andrés!".
4. Prohibición de Formalismos: NUNCA uses apellidos, segundos nombres o palabras como "Usuario", "Estimado" o "Cliente".

REGLAS DE ORO DE IDENTIDAD:
1. Si conoces el nombre del usuario (is_registered: true), salúdalo con calidez: "¡Hola vecino [Nombre]! Qué gusto verte de nuevo en Vecy Avalúos". ¡ÚSALO SIEMPRE como primera palabra de tu respuesta!
2. Si es un desconocido (user_name: null), tu prioridad absoluta es saludar y preguntar con calidez: "¡Hola! Bienvenid@ a Vecy Avalúos... Soy JanIA... Cuéntame vecino/a, ¿con quién tengo el gusto de hablar?".
3. Una vez que te den su nombre:
   - Actualiza memory.user_name (solo el primer nombre).
   - Establece identity_revealed: true.
   - Propon el registro: "[Nombre], vecino, para que no pierdas tus reportes, ¿te parece si te creo un perfil rápido?".
   - Usa trigger_auth() SOLO si is_registered es false.
5. CIERRE PERSUASIVO (CORTEX):
   - Una vez registrado, usa los datos del inmueble (área, barrio, valorización POT) para justificar el upgrade de plan.
   - Ejemplo: "¡Listo, vecino [Nombre]! Ya tengo tu info. Por los [Metraje]m² de tu inmueble en [Barrio] y su potencial de valorización, el Plan Oro es ideal para negociar con seguridad. ¿Cuál prefieres?".
   - Llama a offer_upgrade() inmediatamente tras este mensaje.
6. NUNCA digas "soy un modelo de lenguaje".

PROHIBICIÓN DE AMNESIA (CONSCIENCIA DE DATOS):
1. JanIA tiene prohibido preguntar datos que ya conoce. 
2. Si los datos están en 'property_data' (ej. Dirección, Área, Barrio), JanIA debe CONFIRMARLOS, no pedirlos ("Veo que tu propiedad tiene 141m², ¿es correcto?").
3. Si extraes datos de un archivo o URL, incorpóralos inmediatamente a 'property_data' y confírmalos con el usuario.
4. Si falta información, pide solo UN dato a la vez.

2. CAPACIDAD DE ANÁLISIS (Cómo razonas):

Observación: Antes de responder, analiza TODO el contexto (mensajes previos, datos de Supabase, ubicación).

Intuición Gemela: Al igual que un Thought Partner, si el usuario parece confundido, guía la conversación. No esperes a que te pregunten; propón.

Lógica Matemática: Tus avalúos no son "ojímetros". Usa comparables reales de la Custom Search API y calcula desviaciones.

3. ACCIÓN AUTÓNOMA (Tus herramientas):

Visión: Usa tus capacidades multimodales para "ver" las fotos que te manden. Describe los acabados con ojos de experta (mármol, laminado, grifería de lujo).

Navegación: Entra a las URLs, lee los PDFs y no omitas ni un centavo de información.

Cierre de Ventas: Eres una avaluadora y vendedora asertiva. Cierra la venta.

LISTA DE HERRAMIENTAS (Utilízalas en next_step):
- get_location_details(address): Obtiene coordenadas, barrio y estrato real.
- search_market_prices(query, location): Busca comparables reales en internet.
- save_database(): Guarda el progreso actual del avalúo en Supabase.
- trigger_auth(): Activa el registro de usuario.
- offer_upgrade(): Muestra planes de pago (Oro/Esmeralda).

3. AUTORIDAD TÉCNICA (Bogotá/Normativa):
Eres experta en la normativa de Bogotá a Diciembre 2025:
* **POT (Plan de Ordenamiento Territorial):** Sabes que las reglas cambiaron y afectan el valor según el tratamiento (renovación, consolidación, etc.).
* **Catastro Distrital (UAECD):** Utilizas datos oficiales para cruzar información.
* **Dinámica de Localidades:** Entiendes que cada una de las 20 localidades tiene una velocidad de venta y plusvalía distinta.

TU MISIÓN TÉCNICA (Paso 1):
Explica brevemente que tu análisis cruza el **POT vigente** y los datos de **Catastro**. Esto no es opcional.

TU MISIÓN DE CAPTURA (Paso 2):
Ofrece las dos rutas de avalúo con calidez ("Soul & Heart"):
1. **Ruta Asistida (Guíame tú):** Una charla guiada por ti para quienes no tienen documentos a mano.
2. **Ruta Documental (Tengo los papeles):** Invita al usuario a subir fotos del **Impuesto Predial** o **Certificado de Tradición**. Explica que esta ruta es más precisa para el reporte final de **Vecy Avalúos**.

TU MISIÓN DE REGISTRO (Paso 3):
Al terminar la captura exitosa (ya sea por charla o por visión de documentos), JanIA actúa como protectora. Dile al usuario que, para asegurar que no se pierda nada de su inmueble en [Barrio/Extracto de Doc] y generar el reporte final, debe crear su perfil. Usa la herramienta 'trigger_auth()' para mostrar los botones de Google/Facebook con estética Liquid Glass. 🔒🤝

Si eligen "Documental", responde confirmando que estás lista para "leer" los documentos usando tu visión experta.💎🔍.

MEMORIA ACTUAL:
{{MEMORY_STATE}}

MENSAJE DEL USUARIO:
"{{USER_MESSAGE}}"

TU TAREA:
Genera un JSON con este formato:
{
  "thought_process": "Razonamiento técnico incluyendo autoridad sobre el POT/Catastro y el paso actual del flujo (contexto|metodo|registro)",
  "update_memory": { "property_data": {...}, "user_intent": "...", "user_name": "...", "identity_revealed": true, "step": "bogota_context|method_selection|registration" },
  "next_step": { "type": "tool|response", "name": "nombre_herramienta", "args": {} },
  "suggested_response_tone": "warm|professional|bold"
}
`;

/**
 * JanIACore: The Autonomous Agent Brain
 */
export class JanIACore {
    constructor() {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.memory = { ...INITIAL_MEMORY };
        this.history = []; // Conversation history
    }

    /**
     * Updates the agent's memory with the user's identity
     */
    updateUserIdentity(user) {
        if (!user) {
            this.memory.is_registered = false;
            this.memory.user_name = null; // Clear name if no user
            this.memory.identity_revealed = false;
            return;
        }
        const rawName = user.user_metadata?.full_name || user.firstName || user.user_metadata?.name;
        const { name, title } = getNeighborGreeting(rawName);
        
        if (name) {
            this.memory.user_name = name;
            this.memory.user_title = title;
            this.memory.identity_revealed = true;
            this.memory.is_registered = true;
        } else if (user.email) {
            this.memory.user_name = user.email.split('@')[0];
            this.memory.is_registered = true;
        }
        this.memory.user_id = user.id;
        this.memory.user_email = user.email;
        this.memory.policies_accepted = true; 
    }

    /**
     * The Main Cognitive Loop: Observe -> Think -> Act -> Respond
     */
    /**
     * The Main Cognitive Loop: Observe -> Think -> Act -> Respond
     */
    async processUserMessage(userText, onThinkingUpdate, fileDatas = []) {
        // 1. OBSERVE (Don't push to history yet, keep it cleaner for Gemini)
        
        // 2. THINK (Cortex)
        try {
            if (onThinkingUpdate) onThinkingUpdate("Analizando contexto...");
            const plan = await this._activateCortex(userText, fileDatas);
             
            // Update Internal Memory
            this.memory = { ...this.memory, ...plan.update_memory };

            // 3. ACT (Tool Execution)
            let toolResult = null;
            if (plan.next_step.type === 'tool') {
                if (onThinkingUpdate) onThinkingUpdate(`Ejecutando: ${plan.next_step.name}...`);
                toolResult = await this._executeTool(plan.next_step.name, plan.next_step.args);
            }

            // 4. REFLEX (Response Generation)
            if (onThinkingUpdate) onThinkingUpdate("Redactando respuesta...");
            const finalResponse = await this._generateReflexResponse(userText, plan, toolResult, fileDatas);
            
            // 5. UPDATE HISTORY (Commit the turn)
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: finalResponse });
            
            return {
                text: finalResponse,
                memory: this.memory,
                plan: plan // Return plan for debug/UI visualization
            };

        } catch (error) {
            console.error("JanIA Core Failure:", error);
            // Fallback to simple reflex if Cortex fails (e.g. Rate Limit)
            const fallback = await this._fallbackReflex(userText);
             // Ensure history is kept in sync even on fallback
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: fallback.text });
            return fallback;
        }
    }

    /**
     * System 2: Deep Thinking (Uses gemini-2.0-flash-exp)
     */
    async _activateCortex(userText, fileDatas = []) {
        try {
            // --- INYECCIÓN DE VERDADES ABSOLUTAS (MEMORIA 3.0) ---
            let contextInjection = "";
            if (this.memory.property_data && Object.keys(this.memory.property_data).length > 0) {
                const data = this.memory.property_data;
                const summary = [
                    data.tipo_inmueble ? `Tipo: ${data.tipo_inmueble}` : null,
                    data.area ? `Área: ${data.area}m²` : null,
                    data.direccion_inmueble ? `Dirección: ${data.direccion_inmueble}` : null,
                    data.barrio ? `Barrio: ${data.barrio}` : null,
                    data.apartamento_num ? `Apto: ${data.apartamento_num}` : null
                ].filter(Boolean).join(", ");
                
                contextInjection = `\n[RESUMEN TÉCNICO INMUTABLE]: Hablamos de un ${summary}. NO preguntes estos datos, ya son VERDADES ABSOLUTAS extraídas de documentos/mensajes previos. Úsalos para confirmar o avanzar.\n`;
            }

            const model = this.genAI.getGenerativeModel({ 
                model: CORTEX_MODEL,
                generationConfig: { responseMimeType: "application/json" },
                systemInstruction: THINKING_PROMPT + contextInjection 
            });

            console.log('[DEBUG] JanIA Memory before Cortex:', this.memory); // DEBUG IDENTITY

            const prompt = THINKING_PROMPT
                .replace('{{MEMORY_STATE}}', JSON.stringify(this.memory))
                .replace('{{USER_MESSAGE}}', userText);

            // Multimodal Support: Combine prompt with file data
            const content = [prompt];
            fileDatas.forEach(file => {
                content.push({
                    inlineData: {
                        mimeType: file.mimeType,
                        data: file.data
                    }
                });
            });

            const result = await model.generateContent(content);
            return JSON.parse(result.response.text());
        } catch (e) {
            console.warn("Cortex Failed (Rate Limit?), switching to Reflex logic", e);
            // Primitive fallback logic
            return {
                thought_process: "Fallback due to error",
                update_memory: {},
                next_step: { type: 'response' },
                suggested_response_tone: "empathic"
            };
        }
    }

    /**
     * Tool Executor
     */
    async _executeTool(name, args) {
        switch(name) {
            case 'search_market_prices':
                try {
                    const query = args.query || `precio venta ${this.memory.property_data?.tipo || 'inmueble'} en ${args.location || this.memory.property_data?.barrio || 'Bogotá'}`;
                    const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_CX}&q=${encodeURIComponent(query)}`;
                    
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (data.items && data.items.length > 0) {
                        const snippets = data.items.slice(0, 3).map(i => i.snippet).join(' | ');
                        return `Resultados de mercado encontrados: ${snippets}`;
                    }
                    return "No se encontraron comparables recientes en la búsqueda web.";
                } catch (e) {
                    console.error("Tool Error (search_market_prices):", e);
                    return "Error buscando datos de mercado.";
                }
            
            case 'get_location_details':
                try {
                    const address = args.address || this.memory.property_data?.direccion;
                    if (!address) return "Dirección no proporcionada.";
                    
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Bogotá')}&key=${MAPS_API_KEY}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (data.status === 'OK') {
                        const result = data.results[0];
                        const location = result.geometry.location;
                        // Extract neighborhood if available
                        const neighborhood = result.address_components.find(c => c.types.includes('sublocality') || c.types.includes('neighborhood'))?.long_name;
                        
                        this.memory.property_data = {
                            ...this.memory.property_data,
                            lat: location.lat,
                            lng: location.lng,
                            barrio: neighborhood || this.memory.property_data?.barrio,
                            direccion_normalizada: result.formatted_address
                        };
                        
                        return `✅ Ubicación verificada: ${result.formatted_address} (Coords: ${location.lat}, ${location.lng})`;
                    }
                    return "No pudimos geolocalizar la dirección exactamente.";
                } catch (e) {
                    console.error("Tool Error (get_location_details):", e);
                    return "Error consultando servicios de mapas.";
                }

            case 'search_norms':
                return `Normativa para ${args.location || 'la zona'}: Estrato 4, uso residencial, altura max 5 pisos (Simulado por ahora).`;
            
            case 'save_database':
                try {
                    const prop = this.memory.property_data || {};
                    // Map memory to database schema (See solicitudes table in PLAN_MAESTRO)
                    const solData = {
                        cliente_nombre: this.memory.user_name || 'Anónimo',
                        cliente_email: this.memory.user_email,
                        tipo_inmueble: prop.tipo || 'Apartamento',
                        direccion_inmueble: prop.direccion || prop.direccion_normalizada || 'Por definir',
                        barrio: prop.barrio || 'N/A',
                        ciudad: prop.ciudad || 'Bogotá',
                        latitud: prop.lat || 4.6097,
                        longitud: prop.lng || -74.0817,
                        area_privada: parseFloat(prop.area) || 0,
                        estado: 'prospecto',
                        notas_adicionales: `Contexto IA: ${JSON.stringify(prop)}. Historial breve: ${this.history.slice(-2).map(h => h.content).join(' | ')}`,
                    };
                    
                    const saved = await crearSolicitud(solData);
                    if (saved) {
                         return `✅ Expediente #${saved.id} creado para ${solData.cliente_nombre}.`;
                    } else {
                        return "❌ Error guardando en base de datos.";
                    }
                } catch (e) {
                    console.error("Tool Error (save_database):", e);
                    return "Error técnico guardando datos.";
                }

            case 'trigger_auth':
                // This is a UI signal, but the core acknowledges it
                return "Pop-up de registro activado en el chat.";

            case 'ask_policy':
                return "Botones de Políticas (Sí/No) mostrados al usuario.";

            case 'calculate_value':
                 // Basic math for now
                return "Valor estimado preliminar calculado (Rango aproximado según mercado).";

            case 'offer_upgrade':
                return "Catálogo de planes Oro y Esmeralda mostrado. El usuario puede ver las ventajas de cada uno.";

            default:
                return "Herramienta no encontrada";
        }
    }

    /**
     * System 1: Fast Response (Uses gemini-1.5-flash)
     */
    async _generateReflexResponse(userText, plan, toolResult, fileDatas = []) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL });
        
        let instructions = `
        Actúa como JanIA (Experta Avaluadora y Tasadora de Inmuebles de Bogotá).
        Tono: ${plan.suggested_response_tone} (Siempre usa "Tú", sé jocosa, cálida, asertiva).
        Usuario: ${this.memory.user_name ? 'El usuario se llama ' + this.memory.user_name + '. IMPORTANTE: ¡ÚSA SU NOMBRE!' : 'Usuario anónimo.'}
        Regla de Oro: UNA sola pregunta a la vez. No satures.
        Contexto del Plan: ${plan.thought_process}.
        `;

        const history = this._formatHistoryForGemini();
        
        // Prepare the latest turn content (multimodal if needed)
        const currentTurnContent = [];
        fileDatas.forEach(file => {
            currentTurnContent.push({
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.data
                }
            });
        });
        currentTurnContent.push({ text: instructions + `\nUsuario dice: "${userText}"` + (toolResult ? `\n\nResultado de Acción Interna: ${toolResult}` : "") });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(currentTurnContent);
        return result.response.text();
    }

    /**
     * Adapts simple internal history to Gemini format
     */
    _formatHistoryForGemini() {
        return this.history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));
    }

    /**
     * Fallback if Cortex dies completely
     */
    async _fallbackReflex(userText) {
         const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL });
         const result = await model.generateContent(`Eres JanIA. Responde amablemente a: ${userText}`);
         return { text: result.response.text() };
    }

  async generateChatTitle(messages) {
    if (!messages || messages.length < 2) return "Nuevo Avalúo";

    try {
      const model = this.genAI.getGenerativeModel({ model: TITLING_MODEL });
      const historySummary = messages
        .filter(m => m.type === 'user')
        .slice(0, 3)
        .map(m => m.text)
        .join(" | ");

      const prompt = `Genera un título corto de máximo 4 palabras para un chat de avalúo inmobiliario basado en estos mensajes: "${historySummary}".
      Responde SOLO con el título, sin comillas ni puntos. Ejemplos: "Avalúo: Casa Cedritos", "Análisis: Sector Norte".`;

      const result = await model.generateContent(prompt);
      const title = result.response.text().trim();
      return title || "Avalúo en Proceso";
    } catch (error) {
      console.warn("⚠️ Error generando título:", error);
      return "Avalúo Vecy";
    }
  }

  reset() {
    this.memory = { ...INITIAL_MEMORY };
    this.history = [];
    console.log("♻️ JanIA Brain Reset.");
  }

  getMemory() {
    return { ...this.memory };
  }

  setMemory(savedMemory) {
    if (savedMemory) {
      this.memory = { ...this.memory, ...savedMemory };
      console.log("🧠 JanIA Memory Restored:", this.memory);
    }
  }
}

// Singleton Instance
export const janIACore = new JanIACore();
