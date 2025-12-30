/**
 * SERVICIO DE LIQUIDACIÓN DE PRECIOS VECY AVALÚOS
 * Lógica financiera para Plan Esmeralda (IA) y Plan Oro (RAA).
 * 
 * Basado en SALARIO VITAL 2026: $2,000,000
 * SMMLV BASE 2026: $1,750,905
 * IVA Actual: 0% (Responsabilidad "No responsable de IVA")
 */

const CONSTANTS = {
    SMMLV_2026: 1750905,
    TOTAL_VITAL_2026: 2000000,
    IVA_RATE: 0.0, // Configurable a 0.19 en el futuro
    LIMIT_GRAN_ACTIVO: 5000000000, // 5 Mil Millones
};

/**
 * Calcula el costo del servicio de avalúo.
 * 
 * @param {string} plan - 'esmeralda' | 'oro'
 * @param {string} tipoInmueble - 'residencial' | 'comercial' | 'especial'
 * @param {number} estrato - 1-6
 * @param {number} areaM2 - Área en metros cuadrados
 * @param {number} valorEstimadoJanIA - Valor comercial estimado por la IA
 * @returns {object} - { precio_base, iva, total, mensaje_legal, error? }
 */
export const liquidarServiciosVecy = ({
    plan,
    tipoInmueble,
    estrato,
    areaM2,
    valorEstimadoJanIA
}) => {
    // 0. Validaciones Básicas
    if (valorEstimadoJanIA > CONSTANTS.LIMIT_GRAN_ACTIVO || tipoInmueble === 'especial') {
        return {
            precio_base: 0,
            iva: 0,
            total_a_pagar: 0,
            mensaje_legal: "",
            special_messsage: "Contacto directo para cotización de Gran Activo"
        };
    }

    let precioBase = 0;
    let mensajeLegal = "";
    const smmlv = CONSTANTS.SMMLV_2026;

    // --- LÓGICA PLAN ESMERALDA (Analítica IA) ---
    if (plan === 'esmeralda') {
        mensajeLegal = "Servicio de Analítica de Datos e Inteligencia Artificial. NO reemplaza un avalúo certificado.";
        if (tipoInmueble === 'residencial') {
            // Tarifas fijas por estrato
            const tarifas = { 1: 150000, 2: 200000, 3: 250000, 4: 350000, 5: 450000, 6: 550000 };
            precioBase = tarifas[estrato] || 350000; // Fallback estrato 4
        } else if (tipoInmueble === 'comercial') {
            // Base + m2
            precioBase = 600000 + (500 * areaM2);
        }
    } 
    
    // --- LÓGICA PLAN ORO (Avalúo RAA Certificado) - 2026 RULES ---
    else if (plan === 'oro') {
        mensajeLegal = "Avalúo Corporativo Certificado RAA. Cumple normas NIIF y Ley 1673.";
        if (tipoInmueble === 'residencial') {
            if (estrato <= 2) {
                // VIS (Estratos 1 y 2) -> 0.5 SMMLV BASE
                precioBase = Math.round(smmlv * 0.5); // $875,452 -> $875,500 approx logic
            } else {
                // No VIS (3-6) -> Mayor entre 1 SMMLV BASE o 1.2x1000 del valor
                const opcionA = smmlv * 1.0;
                const opcionB = valorEstimadoJanIA * (1.2 / 1000);
                precioBase = Math.max(opcionA, opcionB);
            }
        } else if (tipoInmueble === 'comercial') {
            // Mayor entre 1.3 SMMLV BASE o 1.5x1000 del valor
            const opcionA = smmlv * 1.3;
            const opcionB = valorEstimadoJanIA * (1.5 / 1000);
            precioBase = Math.max(opcionA, opcionB);
        }
    }

    // Cálculos Finales
    const iva = precioBase * CONSTANTS.IVA_RATE;
    const total = precioBase + iva;

    return {
        precio_base: Math.round(precioBase),
        iva: Math.round(iva),
        total_a_pagar: Math.round(total),
        mensaje_legal: mensajeLegal,
        moneda: "COP"
    };
};

/**
 * Función de compatibilidad para PricingCards.jsx
 * Calcula el precio del Plan Oro para mostrar en la tarjeta UI.
 */
export const calculatePlanPrice = (propertyData) => {
    if (!propertyData) return 0;
    
    // Mapeo de datos básicos para la UI inicial (si existen)
    // Si no hay valor estimado aún, usamos un base o 0.
    const params = {
        plan: 'oro',
        tipoInmueble: propertyData.tipoInmueble || 'residencial',
        estrato: parseInt(propertyData.estrato) || 4,
        areaM2: parseFloat(propertyData.area) || 0,
        valorEstimadoJanIA: parseFloat(propertyData.valor_estimado) || 0 // Asumiendo que tenemos este dato o 0
    };

    const res = liquidarServiciosVecy(params);
    return res.total_a_pagar;
};

export const getFormattedPrice = (price) => {
    if (!price) return "$ --";
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        maximumFractionDigits: 0 
    }).format(price);
};
