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

export const initiateCheckout = async (plan) => {
    try {
        await loadEpaycoScript();

        const handler = window.ePayco.checkout.configure({
            key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
            test: import.meta.env.VITE_EPAYCO_TEST === 'true'
        });

        // Determine price and details based on plan ID
        let amount = 0;
        let name = '';
        let description = '';

        if (plan.id === 'certified') { // Plan Oro
            amount = 380000;
            name = 'Plan Oro - Avalúo Certificado';
            description = 'Avalúo Certificado RAA + Visita Técnica + Asesoría NIIF';
        } else if (plan.id === 'platinum') { // Plan Esmeralda
            amount = 49900;
            name = 'Plan Esmeralda - Informe PRO';
            description = 'Informe Inteligente de Mercado + Análisis de Oferta Real';
        } else {
            return; // Free plan logic handled elsewhere
        }

        const data = {
            //Parametros compra (obligatorio)
            name: name,
            description: description,
            invoice: `INV-${Date.now()}`,
            currency: 'cop',
            amount: amount,
            tax_base: '0',
            tax: '0',
            country: 'co',
            lang: 'es',

            //Onpage="false" - Standard Checkout (Redirect)
            //Onpage="true" - Popup Checkout (Modal)
            external: 'false',


            //Atributos opcionales (pero recomendados)
            // extra1: 'extra1',
            // extra2: 'extra2',
            // extra3: 'extra3',
            confirmation: `${window.location.origin}/api/payment-confirmation`, // Backend webhook (optional/future)
            response: `${window.location.origin}/payment-response`, // Frontend response page

            //Atributos cliente
            // name_billing: 'Andres Perez',
            // address_billing: 'Carrera 19 numero 14-91',
            // type_doc_billing: 'cc',
            // mobilephone_billing: '3150000000',
            // number_doc_billing: '100000000'

            //methodsDisable: ["TDC", "PSE","SP","CASH","DP"]
        };

        handler.open(data);

    } catch (error) {
        console.error('ePayco Checkout Error:', error);
        alert('Hubo un error al iniciar la pasarela de pagos. Por favor intenta nuevamente.');
    }
};
