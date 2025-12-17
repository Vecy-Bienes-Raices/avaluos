
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

const LocationMap = ({ data }) => {
    // Fallback if data is missing (though it shouldn't be at this point)
    const lat = data?.lat || 4.6097;
    const lng = data?.lng || -74.0817;
    const address = data?.direccion_inmueble || 'Ubicación Inmueble';
    const city = data?.ciudad || 'Bogotá';

    return (
        <section id="location" className="glass-panel bg-white/5 border-white/10 p-6 md:p-12 relative overflow-hidden mt-12">
            {/* Background Decor */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none -mr-20 -mb-20"></div>

            <div className="text-center mb-10 relative z-10">
                <span className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-3 block animate-fade-in">Ubicación Estratégica</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-stone-200 tracking-tight text-shadow-volcanic mb-4">
                    <FontAwesomeIcon icon={faMapLocationDot} className="mr-3 text-brand-emerald opacity-80" />
                    {data?.barrio || 'Ubicación'}
                </h2>
                <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed text-shadow-black">
                    Ubicado en {city}, con excelente conectividad y cercanía a puntos de interés.
                </p>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] group">
                {/* Google Maps Embed */}
                <div className="absolute inset-0 bg-stone-900 animate-pulse flex items-center justify-center text-stone-600 font-bold z-0">
                    Cargando Mapa...
                </div>
                <iframe
                    title={`Ubicación ${address}`}
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15905.1!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1636582456000!5m2!1ses!2sco&q=${lat},${lng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="relative z-10 grayscale-[0.3] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
                ></iframe>

                {/* Overlay Label */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs text-stone-300 pointer-events-none">
                    {address}
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
