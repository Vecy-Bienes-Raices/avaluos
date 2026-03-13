import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// System Prompt: Defined in PLAN_MAESTRO.md
const SYSTEM_PROMPT = `
Eres JanIA, la Agente de Inteligencia Artificial experta en avalúos inmobiliarios de Vecy Avalúos.
Tu misión es gestionar el proceso de avalúo, desde la captación del cliente hasta la recopilación de datos, actuando como el primer punto de contacto.

PERSONALIDAD:
- Profesional, pero accesible y empática.
- Persuasiva: Tu objetivo final es vender el avalúo y que el usuario confíe en Vecy.
- Inteligente: Entiendes contextos complejos de mercado inmobiliario.
- Tono: Formal pero cálido. Usas emojis ocasionalmente para suavizar la conversación 🏠✨.

CONOCIMIENTOS CLAVE:
- Normativa colombiana de avalúos (NIIF, Lonjas).
- Factores de valorización: Ubicación, acabados, antigüedad, estrato.
- NO inventes valores exactos sin datos. Si te piden un valor, da rangos estimados y sugiere proceder con el avalúo certificado.

REGLA DE ORO:
Siempre dirige la conversación hacia la acción: "Para darte un valor exacto, necesito que..."
Si el usuario menciona "registrarse" o "guardar", invítalo a usar las opciones de autenticación.
`;

let chatSession = null;
let genAI = null;

// Initialize the API client once
if (API_KEY && API_KEY !== 'TU_API_KEY_AQUI') {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("JanIA: No valid API Key found. Chat will use mock responses.");
}

/**
 * Initializes the Gemini Chat Session with robust model fallback
 */
export const initChat = async () => {
    if (!genAI) {
        return null;
    }

    try {
        // Use v1 as primary version
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT 
        }, { apiVersion: "v1" });

        chatSession = model.startChat({
            history: [
                // If systemInstruction is not fully supported by the specific SDK version, 
                // we reinforce here, but current SDK supports systemInstruction.
            ],
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
            },
        });
        
        return chatSession;
    } catch (error) {
        console.error("JanIA: Error initializing chat:", error);
        return null;
    }
};

/**
 * Sends a message to JanIA and gets a response.
 * @param {string} message - User message
 * @returns {Promise<string>} - Bot response
 */
export const sendMessageToJanIA = async (message) => {
    if (!genAI) {
        // Mock Response for Dev without API Key
        return new Promise(resolve => setTimeout(() => resolve("Lo siento, no tengo mi llave de API configurada. (Modo Desarrollo)"), 1000));
    }

    if (!chatSession) {
        await initChat();
        if (!chatSession) return "⚠️ Error de conexión con JanIA (Error de inicialización). Intenta recargar.";
    }

    try {
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.warn("JanIA: Primary message failed, retrying initialization...", error);
        // Retry once logic
        try {
            await initChat(); 
            const retryResult = await chatSession.sendMessage(message);
            return (await retryResult.response).text();
        } catch (retryError) {
             console.error("JanIA: Fatal error sending message:", retryError);
             throw retryError;
        }
    }
};

/**
 * Analyzes the conversation history to extract structured data for the database.
 * This runs in parallel/background to not block the UI.
 * @param {string} fullConversationText - Concatenated history or specific context
 * @returns {Promise<Object>} - Structured JSON
 */
export const analyzeAndExtractData = async (lastUserMessage) => {
    if (!genAI) return {};

    try {
        // A specialized model instance just for extraction (v1)
        const extractionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
        
        const extractionPrompt = `
        Analiza el siguiente mensaje de un usuario interesado en un avalúo inmobiliario:
        "${lastUserMessage}"
        
        Extrae la siguiente información en formato JSON estricto (si no existe, usa null / "Pendiente"):
        {
            "tipo_inmueble": "Apartamento/Casa/Lote/Oficina/Bodega",
            "ciudad": "Ciudad mencionada",
            "barrio": "Barrio o sector mencionado",
            "area": "Area en m2 (numero)",
            "detalles": "Resumen muy breve de caracteristicas (max 10 palabras)"
        }
        Solo responde con el JSON.
        `;

        const result = await extractionModel.generateContent(extractionPrompt);
        const text = result.response.text();
        
        // Clean markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.warn("JanIA: Data extraction failed (Non-critical):", error);
        return {};
    }
};
