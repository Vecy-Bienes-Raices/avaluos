import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

const FloatingConcierge = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkAvailability = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday...
            const hour = now.getHours();

            // Schedule Logic (Colombia Time implicit or User Local)
            // Mon (1) - Sat (6): 08:00 - 22:00
            if (day >= 1 && day <= 6) {
                setIsOnline(hour >= 8 && hour < 22);
            }
            // Sun (0): 10:00 - 17:00
            else if (day === 0) {
                setIsOnline(hour >= 10 && hour < 17);
            } else {
                setIsOnline(false);
            }
        };

        checkAvailability();
        const interval = setInterval(checkAvailability, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Unicode Escape Sequences for Emojis to prevent encoding issues
    // 👋 = \uD83D\uDC4B
    // 🏠 = \uD83C\uDFE0
    // ✨ = \u2728
    // 🌙 = \uD83C\uDF19

    // Pre-encoded messages to bypass ANY encoding issues
    // Online: "👋 ¡Hola! Estoy interesado en la Casa Portales del Norte II. ¿Me podrían brindar más información? 🏠✨"
    const onlineUrl = "https://wa.me/573166569719?text=%F0%9F%91%8B%20%C2%A1Hola!%20Estoy%20interesado%20en%20la%20Casa%20Portales%20del%20Norte%20II.%20%C2%BFMe%20podr%C3%ADan%20brindar%20m%C3%A1s%20informaci%C3%B3n?%20%F0%9F%8F%A0%E2%9C%A8";

    // Offline: "👋 ¡Hola! Me interesa la Casa Portales del Norte II. Sé que no están en horario laboral, pero dejo mi mensaje. 🌙"
    const offlineUrl = "https://wa.me/573166569719?text=%F0%9F%91%8B%20%C2%A1Hola!%20Me%20interesa%20la%20Casa%20Portales%20del%20Norte%20II.%20S%C3%A9%20que%20no%20est%C3%A1n%20en%20horario%20laboral,%20pero%20dejo%20mi%20mensaje.%20%F0%9F%8C%99";

    const whatsappUrl = isOnline ? onlineUrl : offlineUrl;

    // Colors
    const statusColor = isOnline ? "#00ff22" : "#ff0033"; // Neon Green vs Neon Red
    const statusText = isOnline ? "Asesor en línea" : "Fuera de línea";
    const statusShadow = isOnline ? "shadow-[0_0_8px_#00ff22]" : "shadow-[0_0_8px_#ff0033]";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 1.5,
                type: "spring",
                stiffness: 100
            }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none"
        >
            {/* Tooltip / Speech Bubble - White Glass Style */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-stone-200 text-xs py-1.5 px-3 rounded-xl shadow-lg mb-2 pointer-events-auto mr-0.5"
            >
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        {/* Dynamic Status Dot */}
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 decoration-clone" style={{ backgroundColor: statusColor }}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${statusShadow}`} style={{ backgroundColor: statusColor }}></span>
                    </span>
                    <span className="font-medium tracking-wide text-shadow-black">{statusText}</span>
                </div>
            </motion.div>

            {/* Main Floating Button - White Glass Orb (Circular) + Neon Icon */}
            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group pointer-events-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Glow/Pulse Effect Behind - Fixed Glow (No Pulse) */}
                <div className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: statusColor }}></div>

                {/* Button Container - White Glass Orb */}
                <div
                    className="relative w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,255,34,0.3)]"
                    style={{ borderColor: isOnline ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,51,0.2)' }}
                >

                    {/* Glass Sheen */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-t-full"></div>

                    {/* Neon Icon - Changes color based on status */}
                    <FontAwesomeIcon
                        icon={faWhatsapp}
                        className="text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 filter transition-colors duration-300"
                        style={{ color: statusColor, filter: `drop-shadow(0 0 5px ${statusColor})` }}
                    />
                </div>
            </motion.a>
        </motion.div>
    );
};

export default FloatingConcierge;
