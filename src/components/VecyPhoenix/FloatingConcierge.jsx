import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const FloatingConcierge = () => {
    // Custom pre-filled message similar to Footer loop but optimized for "Direct Chat"
    const message = "👋 ¡Hola! Estoy interesado en la Casa Portales del Norte II. ¿Me podrían brindar más información? 🏠✨";
    const whatsappUrl = `https://wa.me/573166569719?text=${encodeURIComponent(message)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 1.5, // Wait for intro to finish slightly
                type: "spring",
                stiffness: 100
            }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none" // pointer-events-none for container, auto for button
        >
            {/* Tooltip / Speech Bubble - "Asesor en Línea" */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-stone-200 text-xs py-1.5 px-3 rounded-xl shadow-lg mb-1 pointer-events-auto mr-1"
            >
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-medium tracking-wide text-shadow-black">Asesor en línea</span>
                </div>
            </motion.div>

            {/* Main Floating Button */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {/* Glow/Pulse Effect Behind */}
                <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 animate-pulse transition-opacity duration-500"></div>

                {/* Button Itself */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full shadow-[0_0_20px_rgba(20,83,45,0.5)] border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm group-hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300">

                    {/* Glass Sheen */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-50 rounded-t-full"></div>

                    <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="text-white text-3xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10"
                    />
                </div>
            </motion.a>
        </motion.div>
    );
};

export default FloatingConcierge;
