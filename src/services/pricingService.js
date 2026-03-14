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
    valorEstimadoJanIA = 0
}) => {
    // 0. Validaciones y Defaults
    const safeEstrato = parseInt(estrato) || 3; // Default estrato 3
    const safeArea = parseFloat(areaM2) || 0;
    const safeValor = parseFloat(valorEstimadoJanIA) || 0;
    
    let precioBase = 0;
    let mensajeLegal = "";

    // Componente Variable: $500 por m2
    const costoArea = safeArea * 500;
    const planNormalized = plan?.toLowerCase().trim();

    // --- LÓGICA PLAN CAFÉ EXPRESS ---
    if (planNormalized === 'cafe' || planNormalized === 'cafe express' || planNormalized === 'café') {
        mensajeLegal = "Reporte de Opinión de Valor (Sondeo de Mercado). No válido para bancos.";
        if (safeEstrato <= 3) {
             precioBase = 29997; // Estratos 1, 2, 3
        } else {
             precioBase = 49997; // Estratos 4, 5, 6
        }
    }

    // --- LÓGICA PLAN ESMERALDA PLUS ---
    else if (planNormalized === 'esmeralda' || planNormalized === 'esmeralda plus') {
        mensajeLegal = "Servicio de Analítica de Datos e Inteligencia Artificial.";
        if (safeEstrato <= 3) {
             precioBase = 99997; // Estratos 1, 2, 3
        } else {
             precioBase = 149997; // Estratos 4, 5, 6
        }
    } 
    
    // --- LÓGICA PLAN ORO KING (COTIZACIÓN REAL) ---
    else if (planNormalized === 'oro' || planNormalized === 'oro king') {
        mensajeLegal = "Avalúo Corporativo Certificado RAA por Perito Avaluador.";
        
        // Gran Activo Límite (Más de 5 Mil Millones)
        if (safeValor > CONSTANTS.LIMIT_GRAN_ACTIVO) {
            return {
                precio_base: 0,
                iva: 0,
                total_a_pagar: 0,
                mensaje_legal: "Gran Activo Comercial",
                moneda: "COP",
                special_messsage: "Debido a que el valor estimado del inmueble supera los topes automáticos, este avalúo requiere una junta de peritos. Te enviaré un enlace para agendar una reunión ejecutiva."
            }
        }

        // Lógica Estructurada según el tarifario VECY para propiedades estándar
        const baseOro = safeEstrato <= 3 ? 1.5 * CONSTANTS.SMMLV_2026 : 2.0 * CONSTANTS.SMMLV_2026;
        const calculoTarifaAvaluador = safeValor * 0.001; // 1 por mil
        
        // El precio base del ORO rondará un mínimo base más el 1x1000, muy aproximado para simular tarifa de peritos
        precioBase = calculoTarifaAvaluador > baseOro ? calculoTarifaAvaluador : 450000; // Mínimo absoluto $450k para ORO
        
        // Simplificación para la demo (Usaremos tarifas fijas escalonadas para ORO dependiendo del Estrato)
        if (safeEstrato <= 3) {
            precioBase = 350000 + costoArea; 
        } else if (safeEstrato === 4) {
            precioBase = 550000 + costoArea;
        } else {
            precioBase = 850000 + costoArea;
        }
    } else {
        // Fallback genérico por si la IA alucina un plan
        precioBase = 49997;
        mensajeLegal = "Servicio de Consultoría Estándar.";
    }

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
export const calculatePlanPrice = (propertyData, targetPlan = 'oro') => {
    if (!propertyData) return 0;
    
    // Función helper para limpiar números de strings (ej: "125.5 m2" -> 125.5)
    const cleanNumber = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        const match = val.toString().match(/[\d\.]+/);
        return match ? parseFloat(match[0]) : 0;
    };

    // Extracción tolerante de datos
    const foundArea = propertyData.area || propertyData.area_construida || propertyData.m2 || propertyData.superficie || 0;
    const foundEstrato = propertyData.estrato || propertyData.stratum || propertyData.nivel_socioeconomico || 3;

    // Mapeo de datos básicos para la UI inicial
    const params = {
        plan: targetPlan,
        tipoInmueble: propertyData.tipo || 'residencial',
        estrato: parseInt(cleanNumber(foundEstrato)) || 3, // Default 3
        areaM2: cleanNumber(foundArea),
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
