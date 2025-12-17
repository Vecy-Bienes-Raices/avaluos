import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/VecyPhoenix/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-transparent text-stone-200 font-sans selection:bg-brand-accent/30 selection:text-brand-accent">

            {/* Background Ambience (Optional enhancement to body gradient) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-8 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Volver a JanIA
                </Link>

                {/* Glass Card Container (Dark Glass) */}
                <div className="glass-panel bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-8 md:p-12 rounded-3xl">

                    {/* Header */}
                    <header className="mb-10 border-b border-white/10 pb-8">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent font-outfit mb-4">
                            Política de Privacidad
                        </h1>
                        <p className="text-stone-400 text-sm md:text-base">
                            Última actualización: Diciembre 2025
                        </p>
                    </header>

                    {/* Content */}
                    <div className="space-y-8 text-stone-200 leading-relaxed text-sm md:text-base font-light">
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">1. Introducción</h2>
                            <p>
                                Bienvenido a <strong>Vecy Avalúos</strong>. Nos comprometemos a proteger su información personal y su derecho a la privacidad. Esta política describe cómo recopilamos, usamos y resguardamos sus datos cuando utiliza nuestra plataforma impulsada por Inteligencia Artificial (JanIA).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">2. Información que Recopilamos</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Datos de Identificación:</strong> Nombre, correo electrónico, número de teléfono.</li>
                                <li><strong>Información del Inmueble:</strong> Direcciones, características físicas, fotografías, documentos legales (certificados de libertad, escrituras) necesarios para el avalúo.</li>
                                <li><strong>Datos de Uso:</strong> Interacciones con nuestra agente IA (JanIA) para mejorar nuestros modelos.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">3. Uso de la Información</h2>
                            <p>
                                Utilizamos sus datos exclusivamente para:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Generar estimaciones de valor y pre-informes de avalúo.</li>
                                <li>Conectar su solicitud con Avaluadores Profesionales certificados.</li>
                                <li>Mejorar la precisión de nuestros algoritmos de valuación.</li>
                                <li>Cumplir con obligaciones legales y fiscales.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">4. Protección de Datos & IA</h2>
                            <p>
                                Sus documentos son procesados por sistemas seguros en la nube (Google Cloud Platform y Supabase). Aunque utilizamos IA para el análisis preliminar, <strong>todas las valuaciones finales son revisadas y firmadas por un profesional humano</strong>. No compartimos sus datos personales con terceros no autorizados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">5. Contacto</h2>
                            <p>
                                Si tiene preguntas sobre esta política, puede contactarnos en: <a href="mailto:legal@vecyavaluos.com" className="text-brand-accent hover:underline">legal@vecyavaluos.com</a>
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer (Outside) */}
                <Footer />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
