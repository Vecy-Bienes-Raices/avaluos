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
            test: import.meta.env.VITE_EPAYCO_TEST === 'true'
        });

        const data = {
            //Parametros compra (obligatorio)
            name: planData.name || 'Plan Vecy Avalúos',
            description: planData.description || 'Avalúo profesional inmobiliario',
            invoice: `INV-${Date.now()}`,
            currency: 'cop',
            amount: planData.amount,
            tax_base: '0',
            tax: '0',
            country: 'co',
            lang: 'es',

            external: 'false',
            confirmation: `${window.location.origin}/api/payment-confirmation`, 
            response: `${window.location.origin}/payment-response`, 

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
