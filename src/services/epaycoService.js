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
            test: import.meta.env.VITE_EPAYCO_TEST === 'true' // Dynamic environment sourcing
        });

        const data = {
            //Parametros compra (obligatorio)
            name: planData.name || 'Plan Vecy Avalúos',
            description: planData.description || 'Avalúo profesional inmobiliario',
            invoice: `INV-${Date.now()}`,
            currency: 'cop',
            amount: Number(String(planData.amount).replace(/[^0-9.-]+/g, "")), // Strict Number() cast per instructions
            tax_base: '0',
            tax: '0',
            country: 'co',
            lang: 'es',

            external: 'false',
            
            // VALIDATION FIX: 
            // 'confirmation': Must be HTTPS and Public (No Localhost). using Prod for now or empty if no backend.
            confirmation: 'https://vecy-avaluos.netlify.app/payment-confirmation', 
            // 'response': Client redirect. Using window.location.origin allows testing on Localhost.
            response: `${window.location.origin}`, // Redirect back to the chat application 

            //Atributos cliente
            //Atributos cliente
            name_billing: planData.name_billing || '',
            email_billing: planData.email_billing || '',
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

export const verifyPayment = async (ref_payco) => {
    try {
        const response = await fetch(`https://secure.epayco.co/validation/v1/reference/${ref_payco}`);
        const data = await response.json();
        
        if (data.success) {
            return {
                status: data.data.x_cod_response, // 1: Aceptada, 2: Rechazada, 3: Pendiente, 4: Fallida
                statusText: data.data.x_response,
                amount: data.data.x_amount,
                invoice: data.data.x_id_invoice
            };
        } else {
            throw new Error('Epayco validation failed');
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return null;
    }
};
