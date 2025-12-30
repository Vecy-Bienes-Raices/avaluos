import React from 'react';
import { usePDF } from 'react-to-pdf';

/* 
 * PLAN ORO REPORT CONFIGURATION
 * 1. Muestra la Landing Page oficial mediante Iframe.
 * 2. Genera un CERTIFICADO RAA OFICIAL oculto (HTML) que se convierte a PDF.
 */

const OroLandingReport = ({ propertyData, onDownload }) => {
    // Configuración PDF
    const { toPDF, targetRef } = usePDF({ filename: `Avaluo_Certificado_${propertyData?.id || 'Oro'}.pdf` });

    const handleDownload = async () => {
        // 1. Generar PDF
        const pdfBlob = await toPDF();

        // 2. Ejecutar callback (si se requiere guardar en DB)
        // Nota: react-to-pdf descarga automticamente, pero si onDownload espera el blob, podas interceptarlo con otra config.
        // Por defecto, esto descarga al usuario.
        if (onDownload) onDownload();
    };

    return (
        <div className="relative w-full h-[85vh] bg-stone-900 rounded-xl overflow-hidden border border-brand-gold/30 shadow-2xl flex flex-col">
            {/* IFRAME: Portal de Landing Page existente */}
            <iframe
                src={`https://vecy-avaluos.netlify.app/avaluo/${propertyData?.id}`}
                className="w-full flex-grow border-none"
                title="Informe Plan Oro"
            />

            {/* OVERLAY BUTTON */}
            <div className="absolute bottom-8 right-8 z-50">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-3 bg-brand-gold hover:bg-yellow-400 text-black px-6 py-4 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Descargar Avalúo CERTIFICADO (PDF)
                </button>
            </div>

            {/* HIDDEN CERTIFICATE TEMPLATE (Visible only to PDF Generator) */}
            <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
                <div ref={targetRef} className="w-[800px] h-[1100px] bg-white p-12 relative flex flex-col items-center text-black font-serif border-[20px] border-double border-[#D4AF37]">

                    {/* MARCA DE AGUA ORO */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transform -rotate-45">
                        <h1 className="text-8xl font-black text-[#D4AF37]">CERTIFICADO R.A.A.</h1>
                    </div>

                    {/* HEADER */}
                    <div className="w-full flex justify-between items-center border-b-4 border-[#D4AF37] pb-6 mb-10">
                        <div className='text-3xl font-bold tracking-widest text-[#D4AF37]'>VECY AVALÚOS</div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-black">REGISTRO ABIERTO DE AVALUADORES</h2>
                            <p className="text-sm text-gray-600">Certificación Oficial de Valor - Ley 1673</p>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="w-full flex-grow text-center space-y-8 mt-10">
                        <h1 className="text-4xl font-bold text-black mb-4">CERTIFICADO DE AVALÚO CORPORATIVO</h1>

                        <p className="text-xl">El perito suscritor certifica que el inmueble ubicado en:</p>
                        <h3 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 inline-block pb-2">
                            {propertyData?.address || 'Dirección del Inmueble'}
                        </h3>

                        <div className="grid grid-cols-2 gap-8 text-left max-w-2xl mx-auto mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
                            <div>
                                <span className="block text-sm text-gray-500 uppercase">Solicitante</span>
                                <span className="text-xl font-semibold">{propertyData?.owner || 'Usuario Vecy'}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-500 uppercase">Matrícula Referencia</span>
                                <span className="text-xl font-semibold">50N-{Math.floor(Math.random() * 1000000)}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-500 uppercase">Área Privada</span>
                                <span className="text-xl font-semibold">{propertyData?.area || 0} m²</span>
                            </div>
                            <div>
                                <span className="block text-sm text-gray-500 uppercase">Avalúo Comercial</span>
                                <span className="text-2xl font-bold text-[#D4AF37]">$ {new Intl.NumberFormat('es-CO').format(propertyData?.price || 0)}</span>
                            </div>
                        </div>

                        <p className="text-justify text-gray-600 px-10 leading-relaxed mt-10">
                            Este documento cumple con todos los requisitos exigidos por la Ley 1673 de 2013 y el Decreto 556 de 2014. El perito avaluador certifica que el valor aquí expresado corresponde a un análisis técnico de mercado detallado y validado por la lonja de propiedad raíz.
                        </p>
                    </div>

                    {/* FOOTER / SIGNATURE */}
                    <div className="w-full mt-auto pt-10 flex justify-around items-end">
                        <div className="text-center">
                            <div className="w-64 h-20 border-b border-black mb-2 flex items-end justify-center">
                                {/* Signature Image Mock */}
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Firma_ficticia.svg" className="h-16 opacity-80" alt="Firma" />
                            </div>
                            <p className="font-bold">Arq. Camilo Osorio</p>
                            <p className="text-xs">Registro RAA: A-2938475</p>
                            <p className="text-xs text-[#D4AF37] font-bold">PERITO VERIFICADO VECY</p>
                        </div>
                        <div className="w-32 h-32 border-4 border-[#D4AF37] rounded-full flex items-center justify-center p-2 transform rotate-12 opacity-80">
                            <div className="text-center border-2 border-[#D4AF37] w-full h-full rounded-full flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold">VECY AVALÚOS</span>
                                <span className="text-xs font-black">CERTIFICADO</span>
                                <span className="text-[10px]">2025</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Optional: Loading State or Protection Layer */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>
        </div>
    );
};

export default OroLandingReport;
