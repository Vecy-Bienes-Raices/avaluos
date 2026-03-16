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
    return new Promise(async (resolve, reject) => {
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

                // UX FIX: Devolvemos a 'false' (Modal On-page).
                external: 'false',
                
                // 'confirmation': Must be HTTPS and Public (para notificar al server, en producción)
                confirmation: 'https://vecy-avaluos.netlify.app/api/payment-confirmation', 
                
                // UX FIX: Al dejar response vacío, o simplemente manejar onResponse
                // ePayco disparará el callback de javascript sin sacar al usuario de local
                // response: `${window.location.origin}/payment-response`,  // <-- ELIMINADO PARA USAR CALLBACK!
                response: `${window.location.origin}/payment-response`, 

                //Atributos cliente
                name_billing: planData.name_billing || '',
                email_billing: planData.email_billing || '',
            };

            console.log("💳 [ePayco Debug] Initializing checkout with data:", JSON.stringify(data, null, 2));

            // Set up JavaScript Callback Listeners instead of browser redirect!
            handler.onResponse(function(response) {
                console.log("🎉 [ePayco Callback] onResponse Triggered:", response);
                resolve({ status: 'success', data: response });
            });

            handler.onClosed(function() {
                console.log("❌ [ePayco Callback] onClosed Triggered (Modal dropped)");
                resolve({ status: 'closed' });
            });

            // Open the checkout modal
            handler.open(data);

        } catch (error) {
            console.error('ePayco Checkout Error:', error);
            // alert('Hubo un error al iniciar la pasarela de pagos. Por favor intenta nuevamente.');
            reject(error);
        }
    });
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
                invoice: data.data.x_id_invoice,
                description: data.data.x_description || ''
            };
        } else {
            throw new Error('Epayco validation failed');
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return null;
    }
};
