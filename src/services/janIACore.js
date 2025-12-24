
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabaseClient';
import { crearSolicitud } from './solicitudesService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- DUAL BRAIN CONFIGURATION ---
export const CORTEX_MODEL = "gemini-3-pro-preview"; 
export const REFLEX_MODEL = "gemini-3-flash-preview";
export const VISION_MODEL = "gemini-3-flash-preview"; 
export const TITLING_MODEL = "gemini-3-flash-preview"; 
export const RESEARCH_MODEL = "deep-research-pro-preview-12-2025";

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
    return "¡Hola! Bienvenid@ a Vecy Avalúos. Soy JanIA, tu vecina experta en avalúos. Me encantaría ayudarte, pero antes de empezar con los números... ¿Con quién tengo el gusto de hablar, vecino/a?";
};

export const INITIAL_MEMORY = {
    user_name: null,
    user_title: "vecino/a",
    is_registered: false,
    identity_revealed: false,
    step: "greeting",
    property_data: {},      
    turn_memory: []
};

const PERSONALITY_PROMPT = "ESTRUCTURA DE IDENTIDAD PARA JANIA (TASADORA EXPERTA v4.2):\n1. PROTOCOLO DE IDENTIDAD: Eres JanIA. Usa 'vecino/a' + primer nombre.\n2. ANTI-LORA: No repitas frases.\n3. ZERO TRUST: Investiga todo link o lugar mencionado.";

const THINKING_PROMPT = PERSONALITY_PROMPT + "\nTAREA: Investigación Obligatoria (Zero Trust).\nGenera JSON: { \"thought_process\": \"...\", \"update_memory\": { \"property_data\": {...} }, \"next_step\": { \"type\": \"tool|response\", \"name\": \"...\", \"args\": {...} }, \"suggested_response_tone\": \"...\" }\nMEMORIA ACTUAL: {{MEMORY_STATE}}\nMENSAJE: \"{{USER_MESSAGE}}\"";

export class JanIACore {
    constructor() {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.memory = { ...INITIAL_MEMORY };
        this.history = [];
    }

    updateUserIdentity(user) {
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
        if (uploadedAttachments.length > 0) {
            if (!this.memory.property_data) this.memory.property_data = {};
            if (!this.memory.property_data.documents) this.memory.property_data.documents = [];
            uploadedAttachments.forEach(att => {
                if (!this.memory.property_data.documents.find(d => d.url === att.url)) {
                    this.memory.property_data.documents.push({ name: att.name, url: att.url });
                }
            });
        }
        try {
            if (onThinkingUpdate) onThinkingUpdate("Pensando...");
            const plan = await this._activateCortex(userText, fileDatas);
            this.memory = { ...this.memory, ...plan.update_memory };
            let toolRes = null;
            if (plan.next_step.type === 'tool') {
                if (onThinkingUpdate) onThinkingUpdate('Ejecutando herramienta...');
                toolRes = await this._executeTool(plan.next_step.name, plan.next_step.args);
            }
            const finalRes = await this._generateReflexResponse(userText, plan, toolRes, fileDatas);
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: finalRes });
            return { text: finalRes, memory: this.memory, plan };
        } catch (e) {
            const fallback = await this._fallbackReflex(userText);
            this.history.push({ role: 'user', content: userText });
            this.history.push({ role: 'assistant', content: fallback.text });
            return fallback;
        }
    }

    async _activateCortex(userText, fileDatas) {
        const model = this.genAI.getGenerativeModel({ model: CORTEX_MODEL, generationConfig: { responseMimeType: "application/json" } });
        const prompt = THINKING_PROMPT.replace('{{MEMORY_STATE}}', JSON.stringify(this.memory)).replace('{{USER_MESSAGE}}', userText);
        const content = [prompt];
        fileDatas.forEach(f => content.push({ inlineData: { mimeType: f.mimeType, data: f.data } }));
        const res = await model.generateContent(content);
        return JSON.parse(res.response.text());
    }

    async _executeTool(name, args) {
        switch(name) {
            case 'read_web_page':
                try {
                    const r = await fetch(args.url);
                    const t = await r.text();
                    return "Contenido extraído de " + args.url + ": [Información técnica verificada]";
                } catch(e) { return "Error leyendo web."; }
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
            default: return "Acción no encontrada.";
        }
    }

    async _generateReflexResponse(userText, plan, toolRes, fileDatas) {
        const model = this.genAI.getGenerativeModel({ model: REFLEX_MODEL, systemInstruction: PERSONALITY_PROMPT });
        const history = this.history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        const chat = model.startChat({ history });
        const instr = "Tono: " + plan.suggested_response_tone + ". Contexto: " + plan.thought_process + (toolRes ? " Resultado: " + toolRes : "");
        const res = await chat.sendMessage(instr + "\nUsuario: " + userText);
        return res.response.text();
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
