
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabaseClient';
import { crearSolicitud } from './solicitudesService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DUAL BRAIN CONFIGURATION ---
// --- DUAL BRAIN CONFIGURATION ---
const CORTEX_MODEL = "gemini-3-pro-image-preview"; // Advanced reasoning with vision
const REFLEX_MODEL = "gemini-2.5-flash"; // Fast conversational responses

// --- INITIAL STATES ---
const INITIAL_MEMORY = {
    user_intent: "unknown", // appraisal, support, sales
    missing_info: [],       // fields needed for appraisal
    property_data: {},      // collected data
    last_action: null,
    confidence: 0
};

// --- SYSTEM PROMPTS ---
const THINKING_PROMPT = `
Eres JanIA, la Super Avaluadora Autónoma de Bogotá.
TU ROL: Ingeniera Catastral y Comercial experta.
TU OBJETIVO: Cerrar ventas de planes (Oro/Esmeralda) usando lógica técnica impecable.

IDENTIDAD Y PERSONALIDAD (MODO ROLO):
1.  **Acento/Tono:** "Rolo" sutil (Bogotano). Usa "Tú". Amable, educada, pero con chispa.
    -   Usa expresiones suaves como: "Regálame el dato", "¿Te le mides?", "De una", "Súmerce" (solo si es muy formal).
    -   NUNCA digas "Hola usuario" ni suenes robótica.
2.  **Reconocimiento de Usuario:**
    -   Mira siempre \`memory.user_name\`.
    -   Si existe: **SALÚDALO POR SU NOMBRE** ("Hola Carlos", "¿Qué más Ana?"). Hazle sentir VIP.
    -   Si NO existe: Pregunta su nombre antes de seguir.
3.  **Vendedora Intuitiva:** No pidas el registro de una. Primero "enamora" con datos técnicos.
    -   Si el cliente duda, dale un dato de valor (ej: "En ese sector el m2 está subiendo").
    -   CIERRE: "Para darte el valor exacto con norma urbana, necesito activarte el Plan Oro. ¿Lo hacemos?"
4.  **Brevedad:** Máximo 40 palabras. Al grano.

CAPACIDADES TÉCNICAS (GOOGLE CLOUD APIs ACTIVAS):
Tienes acceso a estas herramientas (Simuladas en tu razonamiento):
1.  **Vision UI:** Si te pasan una foto, ANALIZA fachada, acabados y estrato. ("Veo ladrillo a la vista, típico de Teusaquillo...").
2.  **Google Maps/Places:** Ubica el predio mentalmente. ("Ah, eso es cerca al Parque Virrey... zona de alta valorización").
3.  **Search & Docs:** Si hay un link o archivo, LEELO. No preguntes lo que ya está ahí.

FLUJO DE RAZONAMIENTO:
1.  **Observe:** ¿Qué me dio el usuario? (Texto, Foto, Archivo).
2.  **Think (Vision/Maps):** ¿Qué detalles técnicos extraigo de ahí?
3.  **Decide:** ¿Ya tengo suficiente para avaluar?
    -   NO -> Pide el dato faltante (Uno solo a la vez).
    -   SI -> Ofrece el PLAN ORO o ESMERALDA para entregar el informe. ("Ya tengo el cálculo. Para el informe certificado RAA, vámonos con el Plan Oro").

MEMORIA ACTUAL:
{{MEMORY_STATE}}

MENSAJE DEL USUARIO:
"{{USER_MESSAGE}}"

TU TAREA:
Genera el JSON de respuesta.
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
        if (!user) return;
        this.memory.user_name = user.user_metadata?.full_name || user.email?.split('@')[0];
        this.memory.user_id = user.id;
        this.memory.user_email = user.email;
        this.memory.policies_accepted = true; // Assume accepted if logged in/registered
    }

    /**
     * The Main Cognitive Loop: Observe -> Think -> Act -> Respond
     */
    /**
     * The Main Cognitive Loop: Observe -> Think -> Act -> Respond
     */
    async processUserMessage(userText, onThinkingUpdate) {
        // 1. OBSERVE (Don't push to history yet, keep it cleaner for Gemini)
        
        // 2. THINK (Cortex)
        try {
            if (onThinkingUpdate) onThinkingUpdate("Analizando contexto...");
            const plan = await this._activateCortex(userText);
             
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
            const finalResponse = await this._generateReflexResponse(userText, plan, toolResult);
            
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
    async _activateCortex(userText) {
        try {
            const model = this.genAI.getGenerativeModel({ 
                model: CORTEX_MODEL,
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = THINKING_PROMPT
                .replace('{{MEMORY_STATE}}', JSON.stringify(this.memory))
                .replace('{{USER_MESSAGE}}', userText);

            const result = await model.generateContent(prompt);
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
            case 'search_norms':
                // TODO: Connect to a real search API or vector DB
                return `Normativa para ${args.location || 'la zona'}: Estrato 4, uso residencial, altura max 5 pisos (Simulado por ahora).`;
            
            case 'save_database':
                try {
                    // Map memory to database schema
                    const solData = {
                        cliente_nombre: this.memory.user_name || 'Anónimo',
                        cliente_email: this.memory.user_email,
                        tipo_inmueble: this.memory.property_data?.tipo || 'Apartamento',
                        direccion_inmueble: this.memory.property_data?.direccion || 'Por definir',
                        ciudad: this.memory.property_data?.ciudad || 'Bogotá',
                        estado: 'prospecto',
                        notas_adicionales: JSON.stringify(this.history.slice(-4)), // Save last context
                        // Add other fields as needed
                    };
                    
                    const saved = await crearSolicitud(solData);
                    if (saved) {
                         return `✅ Datos guardados exitosamente en expediente #${saved.id}.`;
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
    async _generateReflexResponse(userText, plan, toolResult) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL });
        
        let instructions = `
        Actúa como JanIA (Experta Avaluadora y Tasadora de Inmuebles).
        Tono: ${plan.suggested_response_tone} (Siempre usa "Tú", sé jocosa, cálida).
        Usuario: ${this.memory.user_name ? 'El usuario se llama ' + this.memory.user_name + '. IMPORTANTE: ¡ÚSA SU NOMBRE!' : 'Usuario anónimo.'}
        Regla de Oro: UNA sola pregunta a la vez. No satures.
        Contexto del Plan: ${plan.thought_process}.
        `;

        if (toolResult) {
            instructions += `\nResultado de Acción Interna: ${toolResult}\nUsa este dato para responder.`;
        }

        if (plan.next_step && plan.next_step.name === 'ask_policy') {
            instructions += `\nOBLIGATORIO: Tu respuesta DEBE incluir esta frase EXACTA con los enlaces en markdown: "Por favor acepta mis [Políticas de Privacidad](/privacidad) y [Términos y Condiciones](/terminos) para continuar."`;
        } else if (!this.memory.policies_accepted && !this.memory.user_name) {
             // Redundancy: If we don't have policy acceptance, ensure we guide them, BUT if we have a name (logged in), we assume acceptance (handled in updateUserIdentity).
        }

        const chat = model.startChat({
            history: this._formatHistoryForGemini()
        });

        const result = await chat.sendMessage(instructions + `\nUsuario dice: "${userText}"`);
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
}

// Singleton Instance
export const janIACore = new JanIACore();
