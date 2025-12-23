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
    }
};
