/**
 * LÓGICA DE PRECIOS DINÁMICOS - VECY AVALÚOS
 * Fórmula "Uber de Avalúos" para el Plan Oro
 */

export const calculatePlanPrice = (propertyData = {}) => {
    let basePrice = 99000; // Precio Base Mínimo
    
    const area = parseFloat(propertyData.area) || 0;
    const estimatedValue = parseFloat(propertyData.estimated_value) || 300000000;
    const isRenovationZone = propertyData.is_renovation_zone || false;
    
    // 1. Factor de Complejidad por Área
    if (area > 150) {
        basePrice += basePrice * 0.15; // +15% por áreas grandes
    } else if (area > 80) {
        basePrice += basePrice * 0.05; // +5% por áreas medianas
    }
    
    // 2. Factor por Valor del Inmueble (VEP)
    if (estimatedValue > 800000000) {
        basePrice += 100000; // Inmuebles de lujo
    } else if (estimatedValue > 500000000) {
        basePrice += 50000; // Segmento superior
    }
    
    // 3. Ubicación Estratégica (POT)
    if (isRenovationZone) {
        basePrice += 25000; // Análisis de oportunidad
    }
    
    return Math.round(basePrice);
};

export const getFormattedPrice = (price) => {
    return new Intl.NumberFormat('es-CO').format(price);
};
