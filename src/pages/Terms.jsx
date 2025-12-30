import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/VecyPhoenix/Footer';

import { useTheme } from '../context/ThemeContext';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Theme Classes
    const bgClass = theme === 'dark' ? 'bg-[#0f0f0f] text-stone-200' : 'bg-[#423229] text-stone-200';
    const cardClass = theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20';

    return (
        <div className={`min-h-screen flex flex-col font-sans selection:bg-brand-accent/30 selection:text-brand-accent transition-colors duration-500 ${bgClass}`}>

            {/* Background Ambience (Optional enhancement to body gradient) */}
            <div className={`fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 ${theme === 'dark' ? 'opacity-30' : 'opacity-100'}`}>
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]"></div>
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

                {/* Glass Card Container (Dark Glass) */}
                <div className={`glass-panel backdrop-blur-md shadow-lg p-8 md:p-12 rounded-3xl border transition-colors duration-500 ${cardClass}`}>

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
                                Al acceder y utilizar la plataforma <strong>Vecy Avalúos</strong> y sus servicios asociados (incluyendo el agente IA "JanIA"), usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo, por favor absténgase de usar nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">2. Descripción del Servicio</h2>
                            <p>
                                Vecy Avalúos actúa como una plataforma tecnológica intermediaria que facilita la realización de avalúos inmobiliarios. Nuestro servicio combina:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li><strong>Análisis Automatizado:</strong> Recopilación y pre-procesamiento de datos mediante Inteligencia Artificial.</li>
                                <li><strong>Certificación Profesional:</strong> Revisión y firma final por parte de un Avaluador registrado.</li>
                            </ul>
                            <p className="mt-2 text-stone-400 italic">
                                Nota: Los resultados preliminares mostrados por JanIA en el chat son estimaciones y no constituyen un documento legal hasta ser firmados por un experto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">3. Pagos y Tarifas</h2>
                            <p>
                                El usuario acepta pagar las tarifas vigentes por el servicio de avalúo. Los pagos se procesan a través de pasarelas seguras (ePayco). Vecy Avalúos retiene una comisión por el uso de la plataforma, y el remanente es transferido al profesional asignado. No hay reembolsos una vez el avaluador ha iniciado la revisión del caso.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">4. Responsabilidades</h2>
                            <p>
                                El usuario es responsable de la veracidad de la información y documentos suministrados. Vecy Avalúos no se hace responsable por valuaciones inexactas derivadas de información falsa, incompleta o manipulada proporcionada por el cliente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">5. Propiedad Intelectual</h2>
                            <p>
                                Todo el software, algoritmos, diseños ("JanIA", "Vecy") y contenidos de la plataforma son propiedad exclusiva de Vecy Avalúos S.A.S.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">6. Asistente de Navegación e Investigación</h2>
                            <p>
                                El usuario reconoce que JanIA actúa como un asistente técnico que procesa información pública (POT, portales inmobiliarios, bases de datos abiertas) bajo instrucción directa del usuario. La plataforma no realiza "web scraping" masivo ni indiscriminado, sino análisis puntuales bajo demanda para enriquecer la precisión del avalúo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 font-outfit text-brand-accent">7. Inteligencia Colectiva (RAG)</h2>
                            <p>
                                El sistema utiliza tecnologías de Recuperación Aumentada (RAG) para mejorar sus modelos. Al usar el servicio, el usuario acepta que los datos técnicos y no sensibles del inmueble (área, ubicación, características físicas) alimenten una base de conocimiento vectorial anónima. Esto permite al sistema "recordar" transacciones comparables para beneficio de la comunidad, sin comprometer la identidad del titular.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            {/* Footer (Outside content wrapper) */}
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
