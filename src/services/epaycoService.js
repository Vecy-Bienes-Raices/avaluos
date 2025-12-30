const loadEpaycoScript = () => {
    return new Promise((resolve, reject) => {
        if (window.ePayco) {
            resolve(window.ePayco);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.epayco.co/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.ePayco);
        script.onerror = () => reject(new Error('Failed to load ePayco SDK'));
        document.body.appendChild(script);
    });
};

export const initiateCheckout = async (planData) => {
    try {
        await loadEpaycoScript();

        const handler = window.ePayco.checkout.configure({
            key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
            test: true // Force test mode for debugging
        });

        const data = {
            //Parametros compra (obligatorio)
            name: planData.name || 'Plan Vecy Avalúos',
            description: planData.description || 'Avalúo profesional inmobiliario',
            invoice: `INV-${Date.now()}`,
            currency: 'cop',
            amount: String(planData.amount), // Ensure string format
            tax_base: '0',
            tax: '0',
            country: 'co',
            lang: 'es',

            external: 'false',
            
            // VALIDATION FIX: ALWAYS force production HTTPS URLs for callbacks during debugging
            // ePayco strictly validates these fields. Localhost or http:// causes "epaycoResponse is not a valid URL"
            confirmation: 'https://vecy-avaluos.netlify.app/api/payment-confirmation',
            response: 'https://vecy-avaluos.netlify.app/payment-response', 

            //Atributos cliente
            // name_billing: 'Andres Perez',
            // address_billing: 'Carrera 19 numero 14-91',
            // type_doc_billing: 'cc',
            // mobilephone_billing: '3150000000',
            // number_doc_billing: '100000000'

            //methodsDisable: ["TDC", "PSE","SP","CASH","DP"]
        };

        console.log("💳 [ePayco Debug] Initializing checkout with data:", JSON.stringify(data, null, 2));
        console.log("🔑 [ePayco Debug] Public Key:", import.meta.env.VITE_EPAYCO_PUBLIC_KEY ? "Present" : "MISSING");

        handler.open(data);

    } catch (error) {
        console.error('ePayco Checkout Error:', error);
        alert('Hubo un error al iniciar la pasarela de pagos. Por favor intenta nuevamente.');
    }
};
