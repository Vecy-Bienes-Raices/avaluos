export const workflowService = {
    steps: [
        { id: 'identity', name: 'Identidad', completed: false },
        { id: 'data_intake', name: 'Ingesta de Datos', completed: false },
        { id: 'analysis', name: 'Análisis IA', completed: false },
        { id: 'report', name: 'Informe Final', completed: false }
    ],
    updateStep: (id, status) => {
        console.log(`Workflow Move: ${id} -> ${status}`);
    },
    notifyValuers: async (solicitudId) => {
        console.log(`🚀 Dispatching Solicitud #${solicitudId} to Socio Avaluadores (Uber Model)...`);
        // Real implementation would call a Supabase function or Trigger
        return true;
    }
};
