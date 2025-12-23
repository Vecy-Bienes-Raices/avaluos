/**
 * WORKFLOW SERVICE - VECY AVALÚOS
 * Gestión de estados y blindaje de datos.
 */

export const workflowService = {
    /**
     * Asegura que el nombre no se vuelva a preguntar si ya existe en memoria.
     */
    shieldName: (memory, currentInput) => {
        if (memory.user_name && memory.identity_revealed) {
            return true; // Nombre ya blindado
        }
        return false;
    },

    /**
     * Valida si el flujo puede avanzar al siguiente paso (Avalúo)
     */
    canProceedToAppraisal: (memory) => {
        return !!memory.user_name;
    },

    /**
     * Actualiza el paso del workflow
     */
    updateStep: (memory, nextStep) => {
        return { ...memory, step: nextStep };
    },

    /**
     * FASE 1: BOGOTÁ / POLÍTICAS
     * Presenta la autoridad técnica y pide consentimiento legal.
     */
    startBogotaFlow: (userName, title = "vecino/a") => {
        return {
            text: `Mira ${title} ${userName}, para que este avalúo sea serio y profesional, aplicaré las normas vigentes de Bogotá (**POT actual** y **Catastro Distrital**). Es lo que nos diferencia de un buscador cualquiera y garantiza un valor real de mercado. ¿Te parece si revisamos las políticas de tratamiento de datos para empezar?`,
            options: ["Ver Políticas", "Aceptar y Continuar"],
            nextStep: "legal_consent"
        };
    },

    /**
     * FASE 2: SELECCIÓN DE MÉTODO
     * Bifurca el flujo entre Asistido (Conversación) y Documental (Visión).
     */
    handleEntrySelection: (option) => {
        if (option.toLowerCase().includes('documental') || option.toLowerCase().includes('papeles')) {
            return {
                text: "¡Perfecto! Dale al botón del clip (📎) y sube el **Impuesto Predial** o el **Certificado de Tradición**. Yo usaré mi visión experta para extraer los datos técnicos en un segundo. 💎🔍",
                action: "trigger_file_upload", 
                nextStep: "processing_document"
            };
        }
        
        return {
            text: "¡Súper! Empecemos con lo básico para que no se nos escape nada: ¿En qué **barrio** de Bogotá se encuentra tu inmueble? 🏠📍",
            nextStep: "assisted_flow_location"
        };
    }
};
