import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/VecyPhoenix/Footer';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent/30 selection:text-brand-accent bg-[#423229] text-stone-200">

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 flex-grow max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-bold backdrop-blur-md group mb-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Volver con JanIA
                </button>

                {/* Glass Card Container */}
                <div className="glass-panel backdrop-blur-md shadow-lg p-8 md:p-12 rounded-3xl border bg-white/10 border-white/20">

                    {/* Header */}
                    <header className="mb-10 border-b border-white/10 pb-8">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent font-outfit mb-4">
                            Términos y Condiciones
                        </h1>
                        <p className="text-stone-400 text-sm md:text-base">
                            Última actualización: Diciembre 2025
                        </p>
                    </header>

                    {/* Content */}
                    <div className="space-y-8 text-stone-200 leading-relaxed text-sm md:text-base font-light">
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar <strong>Vecy Avalúos</strong>, usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no utilice nuestra plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">2. Servicios Ofrecidos</h2>
                            <p>
                                Vecy Avalúos proporciona una plataforma de valuación inmobiliaria asistida por Inteligencia Artificial (JanIA). Nuestros servicios incluyen:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Pre-evaluaciones automatizadas mediante IA</li>
                                <li>Conexión con avaluadores profesionales certificados</li>
                                <li>Generación de informes técnicos de avalúo</li>
                                <li>Asesoría sobre el valor comercial de propiedades</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">3. Limitaciones de Responsabilidad</h2>
                            <p>
                                <strong>JanIA es una herramienta de asistencia</strong>. Aunque nuestros algoritmos proporcionan estimaciones basadas en datos del mercado, <strong>el avalúo final siempre es realizado y firmado por un profesional certificado</strong>. Vecy Avalúos no se hace responsable por decisiones comerciales tomadas únicamente con base en las estimaciones preliminares de la IA.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">4. Uso Aceptable</h2>
                            <p>
                                Usted se compromete a:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Proporcionar información veraz y actualizada sobre su propiedad</li>
                                <li>No manipular o falsificar documentos legales</li>
                                <li>Utilizar la plataforma únicamente para fines legítimos de avalúo</li>
                                <li>No intentar acceder a áreas restringidas del sistema</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">5. Propiedad Intelectual</h2>
                            <p>
                                Todo el contenido, algoritmos, diseño y funcionalidad de la plataforma son propiedad exclusiva de Vecy Avalúos. Los modelos de IA y bases de datos de propiedades están protegidos por derechos de autor y secretos comerciales.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">6. Modificaciones</h2>
                            <p>
                                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. El uso continuado del servicio constituye la aceptación de los términos modificados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">7. Contacto Legal</h2>
                            <p>
                                Para consultas legales o reclamos, contáctenos en: <a href="mailto:legal@vecyavaluos.com" className="text-brand-accent hover:underline">legal@vecyavaluos.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Terms;
