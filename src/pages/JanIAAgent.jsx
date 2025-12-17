import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import AuthOptions from '../components/VecyPhoenix/AuthOptions'; // Import Auth Component

const JanIAAgent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    // Chat State
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hola, soy JanIA. ¿Qué quieres valuar hoy?', component: 'greeting' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Themes
    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    // Function to handle sending messages
    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        // 1. Add User Message
        const newMessages = [...messages, { type: 'user', text }];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        // 2. Simulate BI / Logic Response (Delay)
        setTimeout(() => {
            let botResponse = { type: 'bot', text: '' };

            // Logic: URL Detection
            if (text.includes('http') || text.includes('www.')) {
                botResponse.text = "¡Entendido! He detectado un enlace. 🌐 Voy a ingresar a analizar la ficha técnica y extraer los datos del inmueble. Dame un momento...";
            }
            // Logic: Uploads / Clip
            else if (text.toLowerCase().includes('subir') || text.toLowerCase().includes('adjuntar') || text.toLowerCase().includes('foto') || text.toLowerCase().includes('pdf')) {
                botResponse.text = "Para analizar documentos (Escrituras, Predial) o fotos, por favor usa el ícono del clip 📎 que está en la barra de escritura. Yo los leeré automáticamente.";
            }
            // Logic: Register / Auth Trigger
            else if (text.toLowerCase().includes('guardar') || text.toLowerCase().includes('registrar') || text.toLowerCase().includes('cuenta')) {
                botResponse.text = "Para guardar tu progreso y asignarte un experto, necesito que te identifiques. ¿Cómo prefieres conectarte?";
                botResponse.component = 'auth';
            }
            // Logic: Acabados (Context)
            else if (text.toLowerCase().includes('acabados') || text.toLowerCase().includes('piso') || text.toLowerCase().includes('cocina')) {
                botResponse.text = "Perfecto, el estado de los acabados es clave para el valor. ¿Dirías que son 'Originales', 'Remodelados hace poco' o 'Para remodelar'?";
            }
            // Default
            else {
                botResponse.text = "Entiendo. Cuéntame más detalles del inmueble o pégame el link de la publicación si la tienes.";
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleAuthSelect = (provider) => {
        setMessages(prev => [...prev, { type: 'bot', text: `Excelente! Iniciando conexión segura con ${provider}... (Simulado)` }]);
        // Here we will add actual Auth logic later
    };

    return (
        <div
            className={`h-[100dvh] flex text-stone-200 font-sans overflow-hidden transition-colors duration-500 ease-in-out supports-[height:100dvh]:h-[100dvh] ${bgClass}`}
            style={bgStyle}
        >
            {/* BACKGROUND DECOR */}
            <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none z-0 ${theme === 'dark' ? 'opacity-20' : 'opacity-100'}`}></div>

            {/* SIDEBAR (Gemini Style) */}
            <aside
                className={`${sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px] md:translate-x-0 md:w-[72px]'} 
                bg-white/10 backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-white/10 absolute md:relative h-full shadow-xl overflow-visible`}
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
                    <button
                        onClick={() => setMessages([{ type: 'bot', text: 'Hola, soy JanIA. ¿Qué quieres valuar hoy?', component: 'greeting' }])}
                        className={`flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-transparent rounded-full text-stone-200 transition-all shadow-md backdrop-blur-md ${sidebarOpen ? 'px-4 py-3 w-full' : 'p-3 rounded-full'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {sidebarOpen && <span className="text-sm font-medium">Nuevo chat</span>}
                    </button>
                </div>

                {/* Recent Chats List */}
                <div className="flex-grow overflow-y-auto px-2 no-scrollbar">
                    {sidebarOpen && (
                        <div className="mb-2 px-4 text-xs font-medium text-stone-500">Recientes</div>
                    )}
                    <div className="space-y-1">
                        {['Avalúo Casa Portales', 'Análisis Sector Norte', 'Consulta Jurídica'].map((chat, i) => (
                            <button key={i} className={`flex items-center gap-3 p-2 rounded-full hover:bg-white/5 w-full text-left group ${!sidebarOpen && 'justify-center'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                                {sidebarOpen && <span className="text-sm text-stone-300 truncate group-hover:text-white">{chat}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Realized Appraisals Section */}
                <div className="flex-none px-4 mb-4">
                    {sidebarOpen && (
                        <div className="mb-2 text-xs font-bold text-brand-accent uppercase tracking-wider drop-shadow-sm">Avalúos Realizados</div>
                    )}
                    <button
                        onClick={() => navigate('/avaluo/portales')}
                        className={`flex items-center gap-3 p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-brand-coffee-darkest/40'} hover:bg-brand-accent/10 border border-white/5 hover:border-brand-accent/20 w-full text-left group transition-all ${!sidebarOpen && 'justify-center p-2'}`}
                    >
                        <div className={`p-1.5 rounded-full bg-brand-accent/10 text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-colors`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-stone-200 group-hover:text-brand-accent truncate transition-colors">Casa Portales II</span>
                                <span className="text-sm text-stone-300 truncate opacity-80 group-hover:opacity-100">Ver informe</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Sidebar Footer (Settings) */}
                <div className={`mt-auto p-2 space-y-1 border-t ${theme === 'dark' ? 'border-white/5 bg-[#181818]' : 'border-white/5 bg-brand-coffee-darkest/50'} relative`}>

                    {/* SETTINGS POPUP (Side Menu) */}
                    {settingsOpen && (
                        <div className={`absolute left-[105%] bottom-0 w-64 p-3 ${theme === 'dark' ? 'bg-[#1e1e1e] border-[#333]' : 'bg-[#4a3b32] border-white/10'} border rounded-2xl shadow-2xl backdrop-blur-xl z-[60] animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-1`}>

                            {/* Menu Items */}
                            {[
                                { icon: 'activity', label: 'Actividad' },
                                { icon: 'help', label: 'Ayuda' },
                                { icon: 'doc', label: 'Privacidad', link: '/privacidad' },
                                { icon: 'doc', label: 'Términos', link: '/terminos' }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => item.link ? navigate(item.link) : null}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors"
                                >
                                    {item.icon === 'activity' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    {item.icon === 'help' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                                    {item.icon === 'doc' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                                    <span className="text-sm text-stone-300 group-hover:text-white font-medium">{item.label}</span>
                                </button>
                            ))}

                            <div className="my-1 border-t border-white/10 opacity-50"></div>

                            {/* Theme Selector */}
                            <div className="px-2.5 py-1.5">
                                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2 opacity-80 pl-1">Tema</div>
                                <div className="bg-black/20 rounded-lg p-1 flex items-center gap-1">
                                    <button
                                        onClick={() => setTheme('coffee')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs transition-all ${theme === 'coffee' ? 'bg-brand-coffee-light/20 text-brand-gold shadow-sm border border-brand-gold/20 font-bold' : 'text-stone-500 hover:text-stone-300'}`}
                                        title="Estilo Original Vecy"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
                                        Claro
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs transition-all ${theme === 'dark' ? 'bg-white/10 text-white shadow-sm border border-white/10 font-bold' : 'text-stone-500 hover:text-stone-300'}`}
                                        title="Estilo Oscuro Plano"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                        Oscuro
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Trigger Button */}
                    <div className="relative">
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`flex items-center gap-3 p-2 rounded-full hover:bg-white/5 w-full text-left group ${!sidebarOpen && 'justify-center'} ${settingsOpen ? 'bg-white/10 text-white' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white transition-transform duration-500 hover:rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {sidebarOpen && <span className="text-sm text-stone-300 group-hover:text-white">Configuración</span>}
                        </button>
                    </div>

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

                {/* Top Nav */}
                <header className="absolute top-0 left-0 w-full h-16 flex items-center justify-between px-4 md:px-6 pt-6 z-50 pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2.5 rounded-full text-stone-200 hover:text-white backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
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

                {/* Chat Stream */}
                <div className="flex-1 flex flex-col px-4 w-full min-h-0 overflow-hidden pt-20 pb-4">
                    <div className="flex flex-col max-w-4xl mx-auto w-full space-y-6">

                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>

                                {/* Bot Avatar if Bot Message (NOT for greeting) */}
                                {msg.type === 'bot' && msg.component !== 'greeting' && (
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800/60 backdrop-blur-md border border-white/10 overflow-hidden">
                                            <img src="/perfil.png" alt="JanIA" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold text-brand-accent">JanIA</span>
                                    </div>
                                )}

                                {/* Message Bubble */}
                                {msg.component === 'greeting' ? (
                                    // Special Greeting Layout (Centered)
                                    <div className="w-full text-center mt-10 mb-10">
                                        <div className="h-[30vh] max-h-[350px] min-h-[180px] flex items-center justify-center mb-6">
                                            <img src="/jania.png" alt="JanIA" className="h-full w-auto object-contain drop-shadow-2xl animate-float" />
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-medium bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent mb-2">Hola, soy JanIA</h1>
                                        <p className="text-xl text-stone-300 font-light mb-8">{msg.text}</p>

                                        {/* Suggestions */}
                                        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-3xl mx-auto">
                                            {[
                                                { icon: 'home', text: 'Avaluar Inmueble', cmd: 'Quiero avaluar un inmueble' },
                                                { icon: 'doc', text: 'Revisar Docs', cmd: 'Quiero revisar unos documentos' },
                                                { icon: 'user', text: 'Registrarme', cmd: 'Quiero guardar mi progreso (Registrarme)' }
                                            ].map((chip, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSendMessage(chip.cmd)}
                                                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg border border-white/20 hover:border-brand-accent/30 transition-all group backdrop-blur-md flex flex-row items-center gap-3"
                                                >
                                                    <span className="p-2 rounded-full bg-neutral-800/60 text-brand-accent" style={{ filter: 'sepia(0.3)' }}>
                                                        {chip.icon === 'home' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                                                        {chip.icon === 'doc' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                                                        {chip.icon === 'user' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                                                    </span>
                                                    <span className="text-sm font-medium text-stone-200">{chip.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Standard Bubble
                                    <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[70%] shadow-lg backdrop-blur-sm ${msg.type === 'user'
                                        ? 'bg-brand-accent text-black font-medium rounded-tr-sm'
                                        : 'bg-white/10 text-stone-200 border border-white/10 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                )}

                                {/* Render Components inside Chat (Auth Buttons, etc) */}
                                {msg.component === 'auth' && (
                                    <div className="mt-4 ml-2">
                                        <AuthOptions onSelect={handleAuthSelect} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-stone-400 text-xs ml-4 animate-pulse">
                                <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                JanIA está analizando...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="w-full p-4 flex justify-center bg-transparent flex-none z-10">
                    <div className="w-full max-w-3xl space-y-3">
                        <div className="bg-white/10 border border-white/20 rounded-full px-4 py-3 md:py-4 flex items-center gap-4 transition-all shadow-lg backdrop-blur-md">
                            <button className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors" title="Adjuntar Documento">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                            </button>

                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                                placeholder="Pega un link, escribe un mensaje o sube un PDF..."
                                className="flex-grow bg-transparent border-none focus:ring-0 outline-none text-stone-200 placeholder-stone-500 text-sm md:text-base px-0 shadow-none"
                            />

                            <button className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors" title="Enviar Audio">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                            </button>

                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                className="p-2 rounded-full bg-white text-black hover:bg-stone-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-[10px] md:text-xs text-center text-stone-400">
                            JanIA puede equivocarse sobre propiedades o precios. Verifica siempre nuestras <Link to="/privacidad" className="underline hover:text-brand-accent">Políticas</Link> y <Link to="/terminos" className="underline hover:text-brand-accent">Condiciones</Link>.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default JanIAAgent;
