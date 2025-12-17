import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-stone-900 text-stone-200 font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Back Button (Outside Card) */}
                <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-brand-accent mb-8 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Volver a JanIA
                </Link>

                {/* Glass Card Container */}
                <div className="glass-panel bg-white/90 backdrop-blur-xl p-8 md:p-12 shadow-2xl rounded-3xl border border-white/20">

                    {/* Header */}
                    <header className="mb-10 border-b border-stone-200 pb-8">
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-brand-accent via-amber-500 to-brand-accent bg-clip-text text-transparent font-outfit mb-4">
                            Términos y Condiciones
                        </h1>
                        <p className="text-stone-500 text-sm md:text-base font-medium">
                            Última actualización: Diciembre 2025
                        </p>
                    </header>

                    {/* Content */}
                    <div className="space-y-8 text-stone-700 leading-relaxed text-sm md:text-base font-medium">
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 font-outfit border-l-4 border-brand-accent pl-4">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar la plataforma <strong>Vecy Avalúos</strong> y sus servicios asociados (incluyendo el agente IA "JanIA"), usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo, por favor absténgase de usar nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 font-outfit border-l-4 border-brand-accent pl-4">2. Descripción del Servicio</h2>
                            <p>
                                Vecy Avalúos actúa como una plataforma tecnológica intermediaria que facilita la realización de avalúos inmobiliarios. Nuestro servicio combina:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2 marker:text-brand-accent">
                                <li><strong>Análisis Automatizado:</strong> Recopilación y pre-procesamiento de datos mediante Inteligencia Artificial.</li>
                                <li><strong>Certificación Profesional:</strong> Revisión y firma final por parte de un Avaluador registrado.</li>
                            </ul>
                            <p className="mt-4 p-4 bg-brand-accent/10 rounded-xl text-stone-800 italic border border-brand-accent/20">
                                <strong className="text-brand-accent not-italic">Nota:</strong> Los resultados preliminares mostrados por JanIA en el chat son estimaciones y no constituyen un documento legal hasta ser firmados por un experto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 font-outfit border-l-4 border-brand-accent pl-4">3. Pagos y Tarifas</h2>
                            <p>
                                El usuario acepta pagar las tarifas vigentes por el servicio de avalúo. Los pagos se procesan a través de pasarelas seguras (ePayco). Vecy Avalúos retiene una comisión por el uso de la plataforma, y el remanente es transferido al profesional asignado. No hay reembolsos una vez el avaluador ha iniciado la revisión del caso.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 font-outfit border-l-4 border-brand-accent pl-4">4. Responsabilidades</h2>
                            <p>
                                El usuario es responsable de la veracidad de la información y documentos suministrados. Vecy Avalúos no se hace responsable por valuaciones inexactas derivadas de información falsa, incompleta o manipulada proporcionada por el cliente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 font-outfit border-l-4 border-brand-accent pl-4">5. Propiedad Intelectual</h2>
                            <p>
                                Todo el software, algoritmos, diseños ("JanIA", "Vecy") y contenidos de la plataforma son propiedad exclusiva de Vecy Avalúos S.A.S.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer (Outside) */}
                <footer className="mt-12 text-center text-stone-500 text-xs font-medium opacity-60">
                    <p>© 2025 Vecy Avalúos S.A.S. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default TermsAndConditions;
