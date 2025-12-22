export const initiateCheckout = async (data) => {
    console.log("💳 Iniciando Checkout ePayco para:", data);
    
    const handler = window.ePayco.checkout.configure({
        key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
        test: import.meta.env.VITE_EPAYCO_TEST === 'true'
    });

    const paymentData = {
        name: data.name,
        description: data.name,
        invoice: `INV-${Date.now()}`,
        currency: "cop",
        amount: data.price.toString(),
        tax_base: "0",
        tax: "0",
        country: "co",
        lang: "es",
        external: "false",
        extra1: data.id,
        extra2: import.meta.env.VITE_EPAYCO_CLIENT_ID, // Adding Client ID for tracking
        confirmation: `${window.location.origin}/payment-confirmation`,
        response: `${window.location.origin}/payment-response`,
        name_billing: data.userName || "",
        email_billing: data.userEmail || ""
    };

    handler.open(paymentData);
};
