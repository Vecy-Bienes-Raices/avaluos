import React, { useState } from 'react';

const JanIAAgent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-[100dvh] flex text-stone-200 font-sans overflow-hidden bg-transparent supports-[height:100dvh]:h-[100dvh]">

            {/* BACKGROUND: Global body gradient shines through. We add subtle noise/glows here if needed */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* SIDEBAR (Gemini Style) */}
            <aside
                className={`${sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px] md:translate-x-0 md:w-[72px]'} 
                bg-white/10 backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-white/10 absolute md:relative h-full shadow-xl overflow-hidden`}
            >
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 transition-all backdrop-blur-md border border-transparent shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                    {sidebarOpen && (
                        <div className="hidden md:block px-3 py-1 bg-white/5 rounded text-[10px] tracking-widest text-stone-400 font-bold uppercase">BETA</div>
                    )}
                </div>

                {/* New Chat Button */}
                <div className={`px-4 mb-6 ${!sidebarOpen && 'flex justify-center px-0'}`}>
                    <button className={`flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-transparent rounded-full text-stone-200 transition-all shadow-md backdrop-blur-md ${sidebarOpen ? 'px-4 py-3 w-full' : 'p-3 rounded-full'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {sidebarOpen && <span className="text-sm font-medium">Nuevo chat</span>}
                    </button>
                </div>

                {/* Recent Chats List */}
                <div className="flex-grow overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-white/10">
                    {sidebarOpen && (
                        <div className="mb-2 px-4 text-xs font-medium text-stone-500">Recientes</div>
                    )}
                    <div className="space-y-1">
                        {[
                            'Avalúo Casa Portales',
                            'Análisis Sector Norte',
                            'Consulta Jurídica'
                        ].map((chat, i) => (
                            <button key={i} className={`flex items-center gap-3 p-2 rounded-full hover:bg-white/5 w-full text-left group ${!sidebarOpen && 'justify-center'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                                {sidebarOpen && <span className="text-sm text-stone-300 truncate group-hover:text-white">{chat}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Footer (Settings/Location) */}
                <div className="mt-auto p-2 space-y-1 border-t border-white/5 bg-brand-coffee-darkest/50">
                    {[
                        { icon: 'help', label: 'Ayuda' },
                        { icon: 'activity', label: 'Actividad' },
                        { icon: 'settings', label: 'Configuración' }
                    ].map((item, i) => (
                        <button key={i} className={`flex items-center gap-3 p-2 rounded-full hover:bg-white/5 w-full text-left group ${!sidebarOpen && 'justify-center'}`}>
                            {/* Simple Icon Switcher based on label */}
                            {item.icon === 'help' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                            {item.icon === 'activity' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            {item.icon === 'settings' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>}
                            {sidebarOpen && <span className="text-sm text-stone-300 group-hover:text-white">{item.label}</span>}
                        </button>
                    ))}

                    {sidebarOpen && (
                        <div className="mt-2 px-3 py-2 text-[10px] text-stone-500 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff22] shadow-[0_0_8px_#00ff22]"></span>
                                Bogotá, Colombia (IP)
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative z-0 overflow-hidden h-full">

                {/* Top Nav (Mobile Menu Trigger + User Profile) */}
                {/* Top Nav (Mobile Menu Trigger + User Profile) */}
                <header className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-4 md:px-6 pt-6 z-50 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2.5 rounded-full text-stone-200 hover:text-white transition-all focus:outline-none focus:ring-0 active:scale-95 backdrop-blur-md bg-white/10 border border-white/10 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                            </button>
                        )}
                    </div>

                    {/* User Profile / Status */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <div className="flex flex-col items-end mr-3">
                            <span className="text-[10px] md:text-xs font-bold text-brand-accent tracking-wider">VECY AVALÚOS</span>
                            <span className="text-[8px] md:text-[10px] text-[#00ff22] animate-pulse">● Conectado</span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800/60 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-accent/50 transition-all overflow-hidden p-1.5 backdrop-blur-md border border-white/10">
                            <img
                                src="/animacion-vecy-blanco.gif"
                                alt="User"
                                className="w-full h-full object-contain opacity-90"
                                style={{ filter: 'brightness(0.7) sepia(1) hue-rotate(5deg) saturate(1.5)' }}
                            />
                        </div>
                    </div>
                </header>

                {/* Chat Stream / Welcome Area - Flexible & Scrollable if needed (Fail-safe) */}
                {/* Chat Stream / Welcome Area - Flexible & Scrollable if needed (Fail-safe) */}
                {/* Chat Stream / Welcome Area - Flexible & Scrollable if needed (Fail-safe) */}
                {/* Chat Stream / Welcome Area - Flexible & Scrollable if needed (Fail-safe) */}
                {/* Chat Stream / Welcome Area - Flexible & Scrollable if needed (Fail-safe) */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 w-full min-h-0 overflow-y-auto scrollbar-none pt-24 md:pt-0 no-scrollbar">
                    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto pb-4 md:pb-6 w-full">

                        {/* JanIA Avatar Pulse */}
                        {/* JanIA Avatar Pulse - Responsive Height */}
                        {/* JanIA Avatar - Smart Responsive Height */}
                        {/* Shrinks more aggressively on short screens (min 120px) to prevent overlap */}
                        {/* JanIA Avatar Pulse */}
                        {/* JanIA Avatar Pulse - Responsive Height */}
                        {/* JanIA Avatar - Smart Responsive Height */}
                        {/* Shrinks more aggressively on short screens (min 120px) to prevent overlap */}
                        <div className="relative flex-shrink-0 mb-4 transition-all duration-300" style={{ height: '28vh', maxHeight: '350px', minHeight: '140px' }}>
                            <div className="h-full flex items-center justify-center">
                                <img src="/jania.png" alt="JanIA" className="h-full w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                            </div>
                        </div>

                        {/* Greeting Text */}
                        <div className="text-center space-y-1 mb-6">
                            <h1 className="text-3xl md:text-5xl font-medium bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-shine">
                                Hola, soy JanIA
                            </h1>
                            <p className="text-xl md:text-2xl text-stone-300 font-light">
                                ¿Qué quieres valuar hoy?
                            </p>
                        </div>

                        {/* Suggestion Chips (Gemini Style) */}
                        {/* Suggestion Chips (Square Grid for Mobile) */}
                        {/* Suggestion Chips (Gemini Style) */}
                        {/* Suggestion Chips (Square Grid for Mobile) */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full px-1 md:px-0">
                            {[
                                { icon: 'home', text: 'Avaluar Inmueble', sub: 'Valor comercial' },
                                { icon: 'doc', text: 'Revisar Docs', sub: 'Libertad y tradición' },
                                { icon: 'chart', text: 'Mercado', sub: 'Precios por zona' }
                            ].map((chip, i) => (
                                <button key={i} className="bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-xl text-left border border-white/20 hover:border-brand-accent/30 transition-all group shadow-lg backdrop-blur-md flex flex-col items-center justify-center md:items-start md:justify-center gap-1.5 h-24 md:h-full md:min-h-[80px]">
                                    <div className="flex items-center justify-center md:justify-start mb-0 flex-shrink-0">
                                        <div className={`p-1.5 rounded-full bg-black/40 text-brand-accent group-hover:scale-110 transition-transform`}>
                                            {chip.icon === 'home' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                                            {chip.icon === 'doc' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                                            {chip.icon === 'chart' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left w-full">
                                        <h4 className="font-medium text-stone-200 text-[10px] md:text-base leading-tight w-full truncate">{chip.text}</h4>
                                        <p className="hidden md:block text-[10px] md:text-xs text-stone-400 mt-0.5 w-full truncate">{chip.sub}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Input Area (Fixed) */}
                <div className="w-full p-4 flex justify-center bg-transparent flex-none z-10">
                    <div className="w-full max-w-3xl space-y-3">
                        {/* Input Box */}
                        <div className="bg-white/10 border border-white/20 rounded-full px-4 py-3 md:py-4 flex items-center gap-4 transition-all shadow-lg backdrop-blur-md">
                            <button className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>

                            <input
                                type="text"
                                placeholder="Escribe un mensaje a JanIA..."
                                className="flex-grow bg-transparent border-none focus:ring-0 outline-none text-stone-200 placeholder-stone-500 text-sm md:text-base px-0 shadow-none"
                            />

                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                                </button>
                                <button className="p-2 rounded-full bg-white text-black hover:bg-stone-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-[10px] md:text-xs text-center text-stone-400">
                            JanIA puede mostrar información imprecisa sobre propiedades o precios. Verifica siempre los datos legales.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default JanIAAgent;
