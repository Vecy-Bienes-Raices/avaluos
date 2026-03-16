import React from 'react';

/**
 * VECY VISUAL DNA (FUENTE DE VERDAD)
 * Copia fiel de los estándares de diseño de Vecy Avalúos.
 * No modificar sin autorización del Lead Designer.
 */

export const VecyColors = {
    // 1. Colores Maestros
    primary: '#CCAC4E',   // Dorado Vecy (Marca) - brand.gold
    secondary: '#0DBB83', // Esmeralda PRO - brand.emerald
    background: '#1C1917',// Stone-900 (Fondo Oficial Dark)
    textHigh: '#E7E5E4',  // Stone-200 (Texto Principal)

    // Auxiliares
    textMuted: '#A8A29E', // Stone-400
    danger: '#E32527',    // Rojo Error
    success: '#0DBB83',   // Verde Éxito
};

export const VecyStyles = {
    glassStandard: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
    glassPopup: 'bg-white/20 backdrop-blur-md border border-white/20 shadow-xl',
};

export const VecyTypography = {
    // 2. Estilos de Texto Obligatorios
    gradientTitle: 'bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent font-inter font-bold',
    buttonBackText: 'Volver con JanIA',

    // Helpers
    h1: 'text-3xl md:text-5xl font-bold font-inter text-white',
    p: 'text-lg md:text-xl text-stone-300 font-light',
};

/**
 * 3. AVISO LEGAL (Disclaimer)
 * Componente estándar de exención de responsabilidad.
 */
export const DisclaimerText = () => (
    <p className="text-xs text-stone-300 text-center mt-4">
        JanIA es una inteligencia artificial y puede equivocarse sobre propiedades o precios.
        Verifica siempre nuestras <a href="/privacidad" className="underline hover:text-brand-accent">Políticas</a> y <a href="/terminos" className="underline hover:text-brand-accent">Condiciones</a>.
    </p>
);

export default {
    VecyColors,
    VecyTypography,
    VecyStyles,
    DisclaimerText
};
