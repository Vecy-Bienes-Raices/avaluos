import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { janIACore } from '../services/janIACore'; // New Autonomous Core
import { supabase } from '../lib/supabaseClient'; // Import Supabase Client
import { crearSolicitud } from '../services/solicitudesService'; // Import Database Service
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AuthOptions from '../components/VecyPhoenix/AuthOptions';

const JanIAAgent = () => {
    // Auth & Identity State
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // Prevent flicker
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar closed by default
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false); // New State: Profile Popup
    const [authModalOpen, setAuthModalOpen] = useState(false); // New State: Auth Modal
    const [avatarError, setAvatarError] = useState(false); // Handle broken profile images
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    // Chat State
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('janIA_chat_messages');
            if (saved && saved !== 'undefined') {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn("Error cargando mensajes de JanIA:", e);
        }
        return [
            { type: 'bot', text: 'Soy JanIA, tu experta en análisis inmobiliario. ¿Qué quieres descubrir hoy?', component: 'greeting' }
        ];
    });

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false); // New State: Background Analysis
    const [attachments, setAttachments] = useState([]); // NEW: Store selected files
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null); // NEW: Ref for hidden input

    // Reset avatar error when user changes
    useEffect(() => {
        setAvatarError(false);
    }, [user]);

    // Supabase Auth Listener (Robust Persistence)
    useEffect(() => {
        // 1. Setup Listener First (Catch all events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log("Auth Event:", event); // Debug

            if (session?.user) {
                setUser(session.user);
                janIACore.updateUserIdentity(session.user); // Sync Brain
                localStorage.setItem('janIA_has_logged_in', 'true');

                // Close modal if open
                setAuthModalOpen(false);
            } else {
                // Only clear if explicitly signed out or no session
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
            setAuthLoading(false); // Stop loading once we have a definitive answer
        });

        // 2. Initial Check (Only if not handling a redirect)
        const checkCurrentSession = async () => {
            // Check for OAuth errors in URL
            const params = new URLSearchParams(window.location.search);
            if (params.get('error')) {
                console.error("Auth Error:", params.get('error'), params.get('error_description'));
                alert(`Error de Autenticación: ${params.get('error_description') || 'Configuración de redirección incompleta.'}`);
                // Optional: Clean URL
                window.history.replaceState({}, document.title, "/");
                return;
            }

            // If handling an OAuth redirect, let onAuthStateChange handle it to avoid race
            if (window.location.hash && window.location.hash.includes('access_token')) {
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    janIACore.updateUserIdentity(session.user);
                    localStorage.setItem('janIA_has_logged_in', 'true');
                }
            } catch (e) {
                console.warn("Auth init error:", e);
            } finally {
                setAuthLoading(false);
            }
        };

        checkCurrentSession();

        return () => subscription.unsubscribe();
    }, []);

    // Auto-scroll and Persistence
    useEffect(() => {
        scrollToBottom();
        localStorage.setItem('janIA_chat_messages', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Themes
    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    // Function to handle sending messages
    const handleSendMessage = async (text, files = []) => {
        if (!text.trim() && files.length === 0) return;

        // 1. Add User Message
        const newMsg = {
            type: 'user',
            text,
            attachments: files.map(f => ({ name: f.name, type: f.type, preview: f.preview }))
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setAttachments([]); // Clear attachments after sending
        setIsTyping(true);
        setIsAnalyzing(true);

        // --- COGNITIVE LOOP EXECUTION ---
        try {
            // Callback to update UI with "Looking at norms", "Thinking", etc.
            const onThinkingStep = (stepDescription) => {
                // Determine if this is a "Thinking" step or "Action" step for UI coloring
                // We'll just show the text for now in the small indicator
                // You could add a specialized state for the text content
                console.log(`🧠 [JanIA Core]: ${stepDescription}`);
            };

            let response;
            try {
                // Prepare file data for Gemini
                const fileDatas = await Promise.all(files.map(async (file) => {
                    const base64 = await fileToBase64(file);
                    return {
                        mimeType: file.type,
                        data: base64.split(',')[1]
                    };
                }));

                response = await janIACore.processUserMessage(text, onThinkingStep, fileDatas);
            } catch (coreError) {
                console.error("JanIA Core Critical Failure:", coreError);
                response = {
                    text: "⚠️ Desconexión neuronal. Intentando reconectar... (Por favor envía tu mensaje de nuevo).",
                    plan: null
                };
            }

            // Add Bot Message
            let botMsg = {
                type: 'bot',
                text: response.text,
                memory_debug: response.plan // Optional: Store for debug view
            };

            // Post-processing triggers based on the plan or tool execution
            if (response.plan && response.plan.next_step?.type === 'tool') {
                const toolName = response.plan.next_step.name;
                // Execute tool if needed, though processUserMessage should handle it
                // For component mapping, we just need the tool name

                // --- CUSTOM COMPONENT MAPPING ---
                if (toolName === 'auth_gate') {
                    botMsg.component = 'auth_gate';
                } else if (toolName === 'trigger_auth') {
                    botMsg.component = 'auth_options';
                }
                // Note: 'ask_policy' is now integrated into 'auth_gate'
            } else {
                // --- KEYWORD DETECTION ---
                const lowerText = response.text.toLowerCase();

                if (lowerText.includes('registrar')) {
                    // Fallback legacy detection for 'registrar' if not caught by tool
                    botMsg.component = 'auth_options';
                } else if (lowerText.includes('plan') || lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('tarifa') || lowerText.includes('comprar')) {
                    // Detect intent to view pricing/plans
                    botMsg.component = 'plan_card';
                }
            }

            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("JanIA Core Critical Error:", error);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Lo siento, mis circuitos de razonamiento están sobrecargados. Intenta de nuevo. 🧠🔥"
            }]);
        } finally {
            setIsTyping(false);
            setIsAnalyzing(false);
        }
    };

    // Helper: Convert File to Base64
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            file,
            name: file.name,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAuthSelect = async (provider) => {
        if (provider === 'email') {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: '¡Perfecto! Escribe tu correo electrónico a continuación y te enviaré un **Enlace Mágico** 🪄 para entrar sin contraseña.'
            }]);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Auth Loop Error:", error);
            setMessages(prev => [...prev, { type: 'bot', text: 'Hubo un error al intentar conectar. ¿Podemos intentar con otro método?' }]);
        }
    };

    return (
        <div
            className={`h-[100dvh] w-full flex text-stone-200 font-sans overflow-hidden transition-colors duration-500 ease-in-out ${bgClass}`}
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

                {/* Sidebar Footer */}
                <div className={`mt-auto p-2 space-y-1 border-t ${theme === 'dark' ? 'border-white/5 bg-[#181818]' : 'border-white/5 bg-brand-coffee-darkest/50'} relative`}>

                    {/* User Profile Section (Integrated in Footer) */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setProfileOpen(!profileOpen);
                                setSettingsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-full transition-all group hover:bg-white/5 ${profileOpen ? 'bg-white/10' : ''} ${!sidebarOpen && 'justify-center'}`}
                        >
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                {(!avatarError && (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)) ? (
                                    <img
                                        src={user.user_metadata.avatar_url || user.user_metadata.picture}
                                        alt="User"
                                        onError={() => setAvatarError(true)}
                                        className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:rotate-12 aspect-square"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-brand-accent/20 rounded-full">
                                        {user?.user_metadata?.full_name ? (
                                            <span className="text-[10px] font-bold text-brand-accent">
                                                {user.user_metadata.full_name.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white transition-transform duration-500 hover:rotate-90">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                            {sidebarOpen && (
                                <div className="flex items-center justify-between flex-1 min-w-0">
                                    <div className="flex flex-col text-left min-w-0">
                                        {authLoading ? (
                                            <div className="h-8 flex flex-col justify-center gap-1">
                                                <div className="h-2 w-20 bg-white/10 rounded animate-pulse"></div>
                                                <div className="h-2 w-12 bg-white/10 rounded animate-pulse"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-xs font-bold text-white truncate">
                                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Invitado'}
                                                </span>
                                                <span className="text-[10px] text-stone-400 font-medium">
                                                    {user ? 'Plan Activo' : 'Plan Invitado'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!user) setAuthModalOpen(true);
                                            else navigate('/planes');
                                        }}
                                        className="bg-white/5 border border-white/10 px-2 py-1 rounded-full text-[9px] font-bold text-stone-300 hover:bg-brand-accent hover:text-black transition-all cursor-pointer"
                                    >
                                        {user ? 'Mejorar' : 'Acceder'}
                                    </div>
                                </div>
                            )}
                        </button>

                        {/* PROFILE POPUP (Side Menu) */}
                        {profileOpen && (
                            <div className={`absolute left-[105%] bottom-0 w-64 p-3 ${theme === 'dark' ? 'bg-[#1e1e1e] border-[#333]' : 'bg-[#4a3b32] border-white/10'} border rounded-2xl shadow-2xl backdrop-blur-xl z-[60] animate-in fade-in slide-in-from-left-2 duration-200 flex flex-col gap-1`}>
                                {/* Profile Header content... */}
                                <div className="px-3 py-3 border-b border-white/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/30 overflow-hidden flex-shrink-0">
                                        {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                                            <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-brand-accent font-bold">
                                                {user?.user_metadata?.full_name
                                                    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                                    : user?.email ? user.email.substring(0, 2).toUpperCase() : 'ER'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Invitado'}</span>
                                        <span className="text-[10px] text-stone-500 truncate">{user?.email || 'Regístrate hoy'}</span>
                                    </div>
                                </div>
                                <div className="px-3 py-2">
                                    <div className={`text-[10px] px-2 py-1 rounded-md font-bold text-center uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 text-brand-accent' : 'bg-brand-coffee-light/20 text-brand-gold'}`}>
                                        {user ? 'Plan Café' : 'Plan Invitado'}
                                    </div>
                                </div>
                                {!user ? (
                                    <button onClick={() => setAuthModalOpen(true)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors">
                                        {localStorage.getItem('janIA_has_logged_in') ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                                <span className="text-sm text-stone-300 group-hover:text-white font-medium">Iniciar sesión</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                                                <span className="text-sm text-stone-300 group-hover:text-white font-medium">Registrarse</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button onClick={async () => {
                                        await supabase.auth.signOut();
                                        janIACore.reset();
                                        localStorage.removeItem('janIA_chat_messages');
                                        setMessages([{ type: 'bot', text: 'Soy JanIA, tu experta en análisis inmobiliario. ¿Qué quieres descubrir hoy?', component: 'greeting' }]);
                                        setProfileOpen(false);
                                    }} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 text-red-400 text-left group transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                        <span className="text-sm font-bold">Cerrar sesión</span>
                                    </button>
                                )}
                                {user && (
                                    <button onClick={() => { setProfileOpen(false); navigate('/perfil'); }} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors border-t border-white/5 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                        <span className="text-sm text-stone-300 group-hover:text-white font-medium">Editar perfil</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

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
                                    onClick={() => {
                                        if (item.link) {
                                            setSettingsOpen(false);
                                            navigate(item.link);
                                        }
                                    }}
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-white transition-transform duration-500 hover:rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-900/80 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-accent/50 transition-all overflow-hidden p-1.5 backdrop-blur-md border border-white/10 shadow-lg">
                            <img
                                src="/animacion-vecy-blanco.gif"
                                alt="User"
                                className="w-full h-full object-contain opacity-90"
                                style={{ filter: 'brightness(0.7) sepia(1) hue-rotate(5deg) saturate(1.5)' }}
                            />
                        </div>
                    </div>
                </header>

                {/* Chat Stream with Fixed Scroll */}
                <div className="flex-1 flex flex-col w-full min-h-0 relative overflow-hidden">
                    <div className={`flex-1 px-4 pt-4 pb-0 scroll-smooth custom-scrollbar ${messages.length > 1 ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                        <div className="flex flex-col max-w-4xl mx-auto w-full space-y-2 pb-0 min-h-full">
                            {/* Header Spacer - Ensures JanIA is never beheaded */}
                            <div className="h-14 md:h-16 w-full flex-shrink-0" aria-hidden="true" />

                            {messages.filter(m => !(messages.length > 1 && m.component === 'greeting')).map((msg, index) => (
                                <div key={index} className={`flex flex-col ${msg?.type === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>

                                    {/* Bot Avatar if Bot Message (NOT for greeting) */}
                                    {msg?.type === 'bot' && msg?.component !== 'greeting' && (
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-neutral-800/60 backdrop-blur-md border border-white/10 overflow-hidden flex-shrink-0">
                                                <img src="/perfil.png" alt="JanIA" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-xs font-bold text-brand-accent">JanIA</span>
                                        </div>
                                    )}

                                    {/* User Avatar if User Message */}
                                    {msg?.type === 'user' && (
                                        <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                                            <div className="w-10 h-10 rounded-full bg-brand-accent/20 backdrop-blur-md border border-brand-accent/30 overflow-hidden flex-shrink-0">
                                                {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                                                    <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="Tú" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brand-accent font-bold">
                                                        {user?.email ? user.email.substring(0, 2).toUpperCase() : 'A'}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-white/50">Tú</span>
                                        </div>
                                    )}

                                    {/* Greetings / Hero Section - ONLY SHOW IF MESSAGES EMPTY (or only 1 greeting) AND LAST MESSAGE IS NOT USER */}
                                    {messages.length <= 1 && msg?.component === 'greeting' ? (
                                        // Special Greeting Layout (Centered)
                                        <div className={`flex flex-col items-center w-full text-center mt-2 mb-0 ${messages.length === 1 ? 'flex-1 justify-between' : 'hidden'}`}>
                                            {/* Top Section: JanIA & Greeting Text */}
                                            <div className="flex flex-col items-center w-full">
                                                <div className="h-[20vh] md:h-[30vh] max-h-[350px] min-h-[150px] flex items-center justify-center mb-4">
                                                    <img src="/jania.png" alt="JanIA" className="h-full w-auto object-contain drop-shadow-2xl" />
                                                </div>
                                                <h1 className="text-3xl md:text-5xl font-bold font-outfit bg-gradient-to-r from-brand-accent via-white to-brand-accent bg-clip-text text-transparent mb-2">
                                                    Hola{user ? `, ${user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]}` : ''}, soy JanIA
                                                </h1>
                                                <p className="text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto px-4">Tu avaluadora experta ¿Qué inmueble quieres avaluar?</p>
                                            </div>

                                            <div className="w-full pt-4 pb-4">
                                                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 max-w-4xl mx-auto px-4">
                                                    {[
                                                        { icon: 'home', text: 'Avaluar Propiedad', cmd: 'Quiero un avalúo profesional' },
                                                        { icon: 'doc', text: 'Cargar Archivos', cmd: 'Necesito procesar archivos' },
                                                        { icon: 'user', text: localStorage.getItem('janIA_has_logged_in') ? 'Iniciar sesión' : 'Registrarse', cmd: 'AUTH_TRIGGER' }
                                                    ].map((chip, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                if (chip.cmd === 'AUTH_TRIGGER') {
                                                                    setAuthModalOpen(true);
                                                                } else {
                                                                    handleSendMessage(chip.cmd);
                                                                }
                                                            }}
                                                            className="group flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.12] py-2.5 px-6 rounded-full border border-white/10 hover:border-brand-accent/50 transition-all duration-300 backdrop-blur-md shadow-lg w-[240px] md:w-auto min-w-[180px]"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-neutral-900/80 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all duration-300 flex-shrink-0">
                                                                {chip.icon === 'home' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                                                                {chip.icon === 'doc' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                                                                {chip.icon === 'user' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                                                            </div>
                                                            <span className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors truncate">{chip.text}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* User Message Attachments Preview */}
                                            {msg?.type === 'user' && msg?.attachments?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2 justify-end">
                                                    {msg.attachments.map((att, i) => (
                                                        <div key={i} className="bg-white/10 p-2 rounded-xl border border-white/20 flex items-center gap-2 max-w-[200px]">
                                                            {att.preview ? (
                                                                <img src={att.preview} className="w-8 h-8 rounded object-cover" alt="prev" />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                                                </div>
                                                            )}
                                                            <span className="text-[10px] text-stone-200 truncate font-medium">{att.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Facade Visualization Component */}
                                            {msg?.text?.includes('[VISIÓN DE FACHADA]:') && (
                                                <div className="mt-3 rounded-2xl overflow-hidden border border-brand-accent/30 shadow-2xl animate-glow">
                                                    <img
                                                        src={msg.text.split('[VISIÓN DE FACHADA]:')[1].trim()}
                                                        alt="Fachada del inmueble"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                    <div className="bg-black/60 backdrop-blur-md p-2 text-[10px] text-brand-accent font-bold text-center">
                                                        VISTA SATELITAL Y DE CALLE - VECY INTELLIGENCE 🔍🌐
                                                    </div>
                                                </div>
                                            )}

                                            {/* STANDARD BUBBLE WITH MARKDOWN */}
                                            <div className={`p-4 rounded-2xl max-w-[90%] md:max-w-[75%] shadow-lg backdrop-blur-sm ${msg?.type === 'user'
                                                ? 'bg-brand-accent text-black font-bold rounded-tr-sm' // High contrast: Pure Black on Gold
                                                : 'bg-white/10 text-stone-200 border border-white/10 rounded-tl-sm'
                                                }`}>

                                                {/* MARKDOWN RENDERING SAFEGUARD - Simplified to avoid plugin crashes */}
                                                {/* MARKDOWN RENDERING SAFEGUARD */}
                                                {msg?.text ? (
                                                    <div className={`prose prose-sm max-w-none ${msg?.type === 'user' ? 'text-black prose-p:text-black prose-headings:text-black prose-strong:text-black' : 'prose-invert'}`}>
                                                        <ReactMarkdown
                                                            components={{
                                                                strong: ({ children }) => <span className="font-bold text-brand-accent">{children}</span>,
                                                                a: ({ node, ...props }) => <a {...props} className="text-brand-accent underline hover:text-brand-gold" target="_blank" rel="noopener noreferrer" />,
                                                                ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                                                                li: ({ children }) => <li className="text-stone-300">{children}</li>,
                                                                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                                                            }}
                                                        >
                                                            {String(msg.text)}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <p className="text-stone-400 italic">Mensaje sin contenido</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Policy & Auth Gate Component */}
                                    {msg?.component === 'auth_gate' && (
                                        <div className="mt-4 ml-2 flex flex-col gap-4 animate-fade-in-up max-w-[90%]">
                                            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-brand-coffee-darkest/10 border-brand-coffee-darkest/20'} backdrop-blur-xl shadow-2xl`}>
                                                <div className="flex items-center gap-3 mb-3 text-brand-accent">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.548 4.076 10.21 9 11.109 4.924-.899 9-5.561 9-11.109 0-1.292-.204-2.536-.582-3.704A11.959 11.959 0 0112 2.714z" /></svg>
                                                    <span className="font-bold uppercase tracking-widest text-xs">Portal de Seguridad & Identidad</span>
                                                </div>
                                                <p className="text-stone-300 text-sm mb-4 leading-relaxed">
                                                    Para garantizar la **precisión técnica** y proteger tu información, por favor acepta mis <Link to="/privacidad" className="underline hover:text-brand-accent">Políticas de Privacidad</Link> y <Link to="/terminos" className="underline hover:text-brand-accent">Términos</Link> antes de iniciar el registro. 🤝✨
                                                </p>
                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={() => {
                                                            janIACore.memory.policies_accepted = true;
                                                            janIACore.saveState();
                                                            // Logic: Accept triggers AuthOptions
                                                            const notifyMsg = { id: Date.now(), type: 'bot', text: '¡Excelente! Ahora elige cómo prefieres guardar tu progreso en la nube:', component: 'auth_options' };
                                                            setMessages(prev => [...prev, notifyMsg]);
                                                        }}
                                                        className="bg-brand-emerald hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        SÍ, ACEPTO Y QUIERO REGISTRARME 💎
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Legacy Component Support / Specific Auth Options */}
                                    {msg?.component === 'auth_options' && (
                                        <div className="mt-4 ml-2 animate-fade-in-up">
                                            <AuthOptions onSelect={handleAuthSelect} />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 text-stone-400 text-xs ml-4 animate-pulse">
                                    <span className="w-2 h-2 bg-brand-accent rounded-full"></span>
                                    JanIA está pensando...
                                </div>
                            )}

                            {!isTyping && isAnalyzing && (
                                <div className="flex items-center gap-2 text-brand-gold/70 text-[10px] ml-4 animate-pulse transition-opacity duration-500">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Memorizando detalles...
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="w-full p-4 flex justify-center bg-transparent flex-none z-10">
                    <div className="w-full max-w-3xl space-y-3">
                        {/* Attachments Preview Area */}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-4 pb-2">
                                {attachments.map((att, i) => (
                                    <div key={i} className="relative group bg-white/5 border border-white/10 rounded-xl p-2 pr-8 flex items-center gap-2 animate-fade-in">
                                        {att.preview ? (
                                            <img src={att.preview} alt="prev" className="w-8 h-8 rounded object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                            </div>
                                        )}
                                        <span className="text-[10px] text-stone-300 truncate max-w-[100px]">{att.name}</span>
                                        <button
                                            onClick={() => removeAttachment(i)}
                                            className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white/10 border border-white/20 rounded-full px-4 py-3 md:py-4 flex items-center gap-4 transition-all shadow-lg backdrop-blur-md">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                className="hidden"
                                accept="image/*,.pdf"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                                title="Adjuntar (PDF/Imágenes)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input, attachments.map(a => a.file))}
                                placeholder="Pega un link, escribe un mensaje o sube un PDF..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-stone-400 text-sm"
                            />

                            <button
                                onClick={() => handleSendMessage(input, attachments.map(a => a.file))}
                                disabled={!input.trim() && attachments.length === 0}
                                className={`p-2 rounded-full transition-all ${input.trim() || attachments.length > 0 ? 'bg-brand-accent text-black scale-110 shadow-lg' : 'text-stone-500'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-[10px] md:text-xs text-center text-stone-400">
                            JanIA puede equivocarse sobre propiedades o precios. Verifica siempre nuestras <Link to="/privacidad" className="underline hover:text-brand-accent">Políticas</Link> y <Link to="/terminos" className="underline hover:text-brand-accent">Condiciones</Link>.
                        </p>
                    </div>
                </div>

            </main>

            {/* AUTH MODAL OVERLAY */}
            {authModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm">
                        <button
                            onClick={() => setAuthModalOpen(false)}
                            className="absolute -top-12 right-0 p-2 text-stone-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg overflow-hidden p-6 relative">
                            {/* Background Decor */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_60%)] pointer-events-none" />

                            <div className="text-center mb-6 relative z-10">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4a3b32] to-[#2c2420] rounded-full flex items-center justify-center border border-brand-gold/30 mb-4 shadow-xl shadow-black/30">
                                    <img src="/perfil.png" alt="JanIA" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 tracking-wide">Únete a Vecy Avalúos</h3>
                                <p className="text-xs text-brand-gold/80 font-medium">Guarda tus chats y gestiona tus avalúos</p>
                            </div>

                            <AuthOptions onSelect={(provider) => {
                                if (provider === 'email') {
                                    setAuthModalOpen(false);
                                    handleAuthSelect('email'); // Triggers chat flow for email
                                } else {
                                    handleAuthSelect(provider); // Handles OAuth redirect
                                }
                            }} />

                            <div className="mt-6 text-center">
                                <p className="text-[10px] text-stone-500">
                                    Al continuar, aceptas nuestros <Link to="/terminos" onClick={() => setAuthModalOpen(false)} className="underline hover:text-white">Términos</Link> y <Link to="/privacidad" onClick={() => setAuthModalOpen(false)} className="underline hover:text-white">Política de Privacidad</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JanIAAgent;
