import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { janIACore, handleInitialGreeting, getNeighborGreeting } from '../services/janIACore'; // New Autonomous Core
import { supabase } from '../lib/supabaseClient'; // Import Supabase Client
// crearSolicitud removed (Logic moved to JanIACore)
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AuthOptions from '../components/VecyPhoenix/AuthOptions';
import PricingCards from '../components/PricingCards';
import { initiateCheckout } from '../services/epaycoService';
import { saveChatToHistory, getUserChats, getChatDetail, uploadChatFile, deleteChat, clearUserHistory } from '../services/historyService';
import { GlassToast, GlassConfirm } from '../components/VecyAlerts';
import { GlassAvatar } from '../components/GlassAvatar'; // 💎 NEW IMPORT
import { DisclaimerText, VecyStyles } from '../theme/VecyTheme';
// Eliminado uuidv4 por crypto.randomUUID()

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const JanIAAgent = () => {
    // Auth & Identity State
    const [user, setUser] = useState(null);

    // 🔔 ALERTS STATE
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDanger: false
    });

    const [authLoading, setAuthLoading] = useState(true); // Prevent flicker
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar closed by default
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false); // New State: Profile Popup
    const [authModalOpen, setAuthModalOpen] = useState(false); // Auth Modal
    // 1. FIX PERSISTENCE: Initialize strictly from LocalStorage to prevent flash
    const [termsModalOpen, setTermsModalOpen] = useState(() => !localStorage.getItem('janIA_guest_terms_accepted'));
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(() => !!localStorage.getItem('janIA_guest_terms_accepted'));
    // State for History Management
    const [avatarError, setAvatarError] = useState(false);

    // Sync Sidebar & Popups (Gemini Style)
    useEffect(() => {
        if (!sidebarOpen) {
            setProfileOpen(false);
            setSettingsOpen(false);
        }
    }, [sidebarOpen]);

    // --- 🗑️ DELETION HANDLERS (UPDATED FOR GLASS UI) ---

    // 1. Trigger Delete Single Chat
    const triggerDeleteChat = (e, id) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            title: '¿Eliminar conversación?',
            message: 'Este chat se borrará permanentemente y JanIA olvidará los detalles de este inmueble.',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            isDanger: true,
            onConfirm: () => executeDeleteChat(id) // Pass ID to executor
        });
    };

    // 2. Execute Delete (After Confirmation)
    const executeDeleteChat = async (id) => {
        setConfirmModal({ ...confirmModal, isOpen: false }); // Close modal

        // Check if we are deleting the currently active chat
        const isCurrentChat = id === chatId;

        // SAFEGUARD: Prevent auto-save resurrection
        if (isCurrentChat) {
            const tempId = crypto.randomUUID();
            setChatId(tempId);
            localStorage.setItem('janIA_current_chat_id', tempId);
        }

        const success = await deleteChat(id);
        if (success) {
            setHistory(prev => prev.filter(c => c.id !== id));

            if (isCurrentChat) {
                // Force complete reset
                janIACore.reset();
                const greeting = handleInitialGreeting(user);
                setMessages([{ type: 'bot', text: greeting, component: 'greeting' }]);
                localStorage.removeItem('janIA_chat_messages');
            }
            setToast({ message: 'Chat eliminado correctamente', type: 'success' });
        } else {
            // RLS Fail Logic handled in service, but we show toast too
            setToast({ message: 'No se pudo eliminar. Verifica permisos RLS.', type: 'error' });
        }
    };

    // 3. Trigger Clear History
    const triggerClearHistory = () => {
        setConfirmModal({
            isOpen: true,
            title: '¿Borrar TODO el historial?',
            message: 'Esta acción es irreversible. Perderás todos los avalúos guardados.',
            confirmText: 'Borrar todo',
            cancelText: 'Cancelar',
            isDanger: true,
            onConfirm: () => executeClearHistory()
        });
    };

    // 4. Execute Clear History
    const executeClearHistory = async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });

        const success = await clearUserHistory(user.id);
        if (success) {
            setHistory([]);

            // PREVENT RESURRECTION
            const newId = crypto.randomUUID();
            setChatId(newId);
            localStorage.setItem('janIA_current_chat_id', newId);
            janIACore.reset();

            const greeting = handleInitialGreeting(user);
            setMessages([{ type: 'bot', text: greeting, component: 'greeting' }]);
            localStorage.removeItem('janIA_chat_messages');

            setToast({ message: 'Historial limpio y sesión nueva.', type: 'success' });
        } else {
            setToast({ message: 'Error de permisos (RLS). No se pudo borrar.', type: 'error' });
        }
    };
    // ----------------------------------------------------
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

        // Determinar saludo inicial dinámico
        const initialText = handleInitialGreeting(null);
        return [
            { type: 'bot', text: initialText, component: 'greeting' }
        ];
    });

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Typing Animation (Dots cycling)
    const [typingDots, setTypingDots] = useState('');
    useEffect(() => {
        if (isTyping) {
            const interval = setInterval(() => {
                setTypingDots(prev => prev.length < 3 ? prev + '.' : '');
            }, 400);
            return () => clearInterval(interval);
        } else { setTypingDots(''); }
    }, [isTyping]);
    const [isAnalyzing, setIsAnalyzing] = useState(false); // New State: Background Analysis
    const [thinkingText, setThinkingText] = useState("JanIA está pensando..."); // DYNAMIC THINKING STATE
    const [attachments, setAttachments] = useState([]); // NEW: Store selected files
    const [history, setHistory] = useState([]); // Real chat history
    const [chatId, setChatId] = useState(() => localStorage.getItem('janIA_current_chat_id') || crypto.randomUUID());
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null); // NEW: Ref for hidden input

    // Reset avatar error when user changes
    useEffect(() => {
        setAvatarError(false);
    }, [user]);

    // MEMORY BRIDGE: Save RAM to Disk before Auth Redirect/Reload
    const persistMemory = () => {
        const currentMem = janIACore.getMemory();
        if (currentMem && Object.keys(currentMem).length > 0) {
            localStorage.setItem('janIA_temp_memory', JSON.stringify(currentMem));
            console.log("🧠 JanIA Memory Bridge: Saved to LocalStorage", currentMem);
        }
    };

    // Supabase Auth Listener (Robust Persistence & Guest Guard)
    useEffect(() => {
        // 1. Setup Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log("Auth Event:", event); 

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setAuthLoading(false);
                janIACore.updateUserIdentity(null);
                localStorage.removeItem('janIA_has_logged_in');
                navigate('/');
                return;
            }

            if (session?.user) {
                // IMMEDIATE UI UPDATE for responsiveness
                setUser(session.user);

                // MEMORY RESTORATION BRIDGE (The "Lobotomy" Fix)
                const savedMem = localStorage.getItem('janIA_temp_memory');
                if (savedMem) {
                    try {
                        const parsedMem = JSON.parse(savedMem);
                        janIACore.memory = { ...janIACore.memory, ...parsedMem };

                        // NAME MISMATCH CHECK (User Request)
                        const chatName = parsedMem.user_name;
                        const authName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;

                        if (chatName && authName && chatName.toLowerCase() !== authName.toLowerCase()) {
                            // Check if similarity is low (simple check)
                            if (!authName.toLowerCase().includes(chatName.toLowerCase())) {
                                janIACore.memory.detected_auth_name = authName;
                                janIACore.memory.name_mismatch = true;
                            }
                        }

                        console.log("🧠 JanIA Memory Bridge: Restored after Login", janIACore.memory);
                        localStorage.removeItem('janIA_temp_memory');
                    } catch (e) { console.error("Memory Restore Fail:", e); }
                }

                janIACore.updateUserIdentity(session.user); // Triggers name greeting logic internally
                localStorage.setItem('janIA_has_logged_in', 'true');

                // Async Profile Sync (Non-blocking for UI)
                const syncProfile = async () => {
                    // Fetch policies_accepted (New Phase 6) AND accepted_terms (Legacy)
                    const { data: profile } = await supabase.from('profiles').select('policies_accepted, accepted_terms').eq('id', session.user.id).maybeSingle();

                    const hasAccepted = profile?.policies_accepted || profile?.accepted_terms;

                    // SYNC CORE IDENTITY WITH POLICIES
                    janIACore.updateUserIdentity(session.user, hasAccepted);

                    if (hasAccepted) {
                        setHasAcceptedTerms(true);
                        setTermsModalOpen(false); // Ensure closed if accepted in DB
                        localStorage.setItem('janIA_guest_terms_accepted', 'true'); // Sync local
                    } else if (localStorage.getItem('janIA_guest_terms_accepted')) {
                        // Conflict resolution: Local says yes, DB says no? Trust local and sync up.
                        setHasAcceptedTerms(true);
                        setTermsModalOpen(false);
                        supabase.from('profiles').update({ policies_accepted: true, accepted_terms: true }).eq('id', session.user.id);
                        janIACore.updateUserIdentity(session.user, true);
                    } else {
                        // Neither local nor DB has it -> Open Gate
                        setHasAcceptedTerms(false);
                        setTermsModalOpen(true);
                    }
                };
                syncProfile();
            } else {
                // GUEST LOGIC: If no user, Check LocalStorage for Terms
                const guestAccepted = localStorage.getItem('janIA_guest_terms_accepted');
                if (!guestAccepted) {
                    setTermsModalOpen(true); // GATE: Guests must accept too
                } else {
                    setHasAcceptedTerms(true);
                    setTermsModalOpen(false); // Ensure closed if accepted
                }
            }

            setAuthLoading(false);
        });

        // 2. Initial Check (Ensure strict state on load)
        const checkCurrentSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    janIACore.updateUserIdentity(session.user);
                    localStorage.setItem('janIA_has_logged_in', 'true');

                    // DB Check for User
                    const { data: profile } = await supabase.from('profiles').select('accepted_terms').eq('id', session.user.id).maybeSingle();
                    if (profile?.accepted_terms) {
                        setHasAcceptedTerms(true);
                        setTermsModalOpen(false);
                        localStorage.setItem('janIA_guest_terms_accepted', 'true');
                    } else if (localStorage.getItem('janIA_guest_terms_accepted')) {
                        setHasAcceptedTerms(true);
                        setTermsModalOpen(false);
                    } else {
                        setHasAcceptedTerms(false);
                        setTermsModalOpen(true);
                    }
                } else {
                    // Guest Check
                    const guestAccepted = localStorage.getItem('janIA_guest_terms_accepted');
                    if (!guestAccepted) {
                        setTermsModalOpen(true);
                    } else {
                        setHasAcceptedTerms(true);
                        setTermsModalOpen(false);
                    }
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
        localStorage.setItem('janIA_current_chat_id', chatId);

        // Auto-save logic for logged in users
        if (user && messages.length > 2) {
            const saveChat = async () => {
                // If it's a new chat, generate a title
                let title = localStorage.getItem(`janIA_title_${chatId}`);
                if (!title) {
                    title = await janIACore.generateChatTitle(messages);
                    localStorage.setItem(`janIA_title_${chatId}`, title);
                }
                const currentMemory = janIACore.getMemory();
                await saveChatToHistory(user.id, chatId, title, messages, currentMemory);
            };
            saveChat();
        }
    }, [messages, chatId, user]);

    // Load user history
    useEffect(() => {
        if (user) {
            const loadHistory = async () => {
                const userChats = await getUserChats(user.id);
                setHistory(userChats);
            };
            loadHistory();
        } else {
            setHistory([]);
        }
    }, [user, messages]); // Refresh on user change or new messages

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Themes
    const bgClass = theme === 'coffee' ? 'bg-[#423229]' : 'bg-[#0f0f0f]';
    const bgStyle = theme === 'coffee'
        ? { backgroundImage: 'radial-gradient(circle at center, #7D6B65 0%, #4E3D32 40%, #423229 100%)' }
        : { background: '#0f0f0f' };

    // LOCK: Prevent double-send race conditions
    const isSendingRef = useRef(false);

    const handleSendMessage = async (text, files = []) => {
        if ((!text && files.length === 0) || isSendingRef.current) return;
        isSendingRef.current = true;

        // HEURISTIC: Name Capture (Simple)
        // If JanIA asked for name and user responds short text, assume it's name.
        // This is a basic patch to ensure name persists. 
        if (!janIACore.memory.user_name && text.split(' ').length < 4 && !text.includes('casa') && !text.includes('apto')) {
            janIACore.memory.user_name = text.trim();
            console.log("🧠 JanIA: Nombre capturado heurísticamente:", text);
        }

        const newUserMsg = { id: Date.now(), text, type: 'user', attachments: attachments.map(a => ({ ...a, file: null })) }; // Don't store file obj in msg state to avoid lag
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setAttachments([]);
        setIsTyping(true);
        setIsAnalyzing(true);

        // --- SUBIDA REAL A SUPABASE STORAGE ---
        let uploadedAttachments = [];

        if (user && files.length > 0) {
            try {
                uploadedAttachments = await Promise.all(files.map(async (fileObj) => {
                    const publicUrl = await uploadChatFile(user.id, chatId, fileObj);

                    if (!publicUrl) {
                        console.error("Failed to upload file:", fileObj.name);
                    }

                    return {
                        name: fileObj.name,
                        type: fileObj.type,
                        url: publicUrl,
                        preview: fileObj.preview
                    };
                }));
            } catch (err) {
                console.error("Storage Upload Error:", err);
            }
        }


        // REMOVED DUPLICATE setMessages CALL HERE
        // The user message was already added optimistically at the start of the function.
        // We proceed directly to AI processing using the uploadedAttachments variable.
        setIsTyping(true);
        setIsAnalyzing(true);

        // --- COGNITIVE LOOP EXECUTION ---
        try {
            // FORCE SYSTEM SYNC: Update Identity before every interaction
            janIACore.updateUserIdentity(user);
            console.log("🔍 [DEBUG FRONTEND] IDENTITY SENT TO JANIA:", janIACore.memory);

            // MODO CAPTURA DE LEAD: Si no hay usuario y no tenemos nombre, el CorteX lo detectará
            if (!user && !janIACore.memory.user_name) {
                console.log("🎯 [MODO CAPTURA]: JanIA buscando identidad...");
            }

            // Callback to update UI with "Looking at norms", "Thinking", etc.
            const onThinkingStep = (stepDescription) => {
                setThinkingText(stepDescription); // ACTUAL UI UPDATE
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

                response = await janIACore.processUserMessage(text, onThinkingStep, fileDatas, uploadedAttachments);
            } catch (coreError) {
                console.error("JanIA Core Critical Failure:", coreError);
                response = {
                    text: "⚠️ Desconexión neuronal. Intentando reconectar... (Por favor envía tu mensaje de nuevo).",
                    plan: null
                };
            }

            // --- CLEANUP: Remove any accidental JSON artifacts ---
            const cleanText = response.text.replace(/\{[\s\S]*"tool"[\s\S]*\}/g, '').trim();

            // Add Bot Message
            let botMsg = {
                type: 'bot',
                text: cleanText,
                memory_debug: response.plan // Optional: Store for debug view
            };

            // Post-processing triggers based on the plan or tool execution
            if (response.plan) {
                const step = response.plan.next_step;
                const toolName = step?.type === 'tool' ? step.name : null;

                // --- CUSTOM COMPONENT MAPPING (BYPASS AUTH IF LOGGED IN) ---
                if (toolName === 'auth_gate' || toolName === 'trigger_auth') {
                    if (!user) {
                        botMsg.component = 'auth'; // Solo mostrar si no hay sesión
                    } else {
                        // Si ya está logueado, JanIA debe continuar suavemente
                        console.log("🔒 [AUTH BYPASS]: Usuario ya logueado, saltando auth_gate.");
                    }
                } else if (toolName === 'offer_upgrade' || toolName === 'offer_plans') {
                    botMsg.component = 'plan_card';
                } else if (toolName === 'start_bogota_flow') {
                    botMsg.component = 'options';
                    botMsg.options = ["Ver Políticas", "Aceptar y Continuar"];
                }

                // Handle Workflow Actions - Step 2: Documental
                const action = response.plan.update_memory?.last_action || step?.name;
                if (action === 'trigger_file_upload') {
                    // Trigger the hidden file input ref with a small delay for UI smoothness
                    setTimeout(() => {
                        fileInputRef.current?.click();
                    }, 500);
                }
            } else {
                // --- KEYWORD DETECTION (Fallback) ---
                const lowerText = cleanText.toLowerCase();

                if (lowerText.includes('registrar')) {
                    botMsg.component = 'auth_options';
                } else if (lowerText.includes('plan') || lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('tarifa') || lowerText.includes('comprar')) {
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
            isSendingRef.current = false; // RELEASE LOCK
        }
    };


    // Helper: Convert File to Base64
    // Helper: Convert File to Base64 (Moved to top of file)

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
                        <div className="hidden md:block px-3 py-1 bg-white/5 rounded text-xs tracking-widest text-stone-400 font-bold uppercase">BETA</div>
                    )}
                </div>

                {/* New Chat Button */}
                <div className={`px-4 mb-6 ${!sidebarOpen && 'flex justify-center px-0'}`}>
                    <button
                        onClick={() => {
                            // 1. GENERATE NEW ID STRICTLY
                            const newId = crypto.randomUUID();

                            // 2. STOP PERSISTENCE OF OLD CHAT
                            setChatId(newId);
                            localStorage.setItem('janIA_current_chat_id', newId);

                            // 3. RESET CORE & MEMORY
                            janIACore.reset();

                            // 4. RESET UI
                            const greeting = handleInitialGreeting(user);
                            setMessages([{ type: 'bot', text: greeting, component: 'greeting' }]);
                            localStorage.removeItem('janIA_chat_messages');
                            setToast({ message: 'Nuevo chat iniciado', type: 'info' }); // User feedback

                            // 5. CLOSE SIDEBAR
                            if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-transparent rounded-full text-stone-200 transition-all shadow-md backdrop-blur-md ${sidebarOpen ? 'px-4 py-3 w-full' : 'p-3 rounded-full'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {sidebarOpen && <span className="text-sm font-medium">Nuevo chat</span>}
                    </button>
                </div>

                {/* Recent Chats List - Real Data */}
                <div className="flex-grow overflow-y-auto px-2 no-scrollbar">
                    {sidebarOpen && (
                        <div className="mb-2 px-4 text-xs font-medium text-stone-500 italic">Historial</div>
                    )}
                    <div className="space-y-1">
                        {history.length > 0 ? (
                            history.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={async () => {
                                        const detail = await getChatDetail(chat.id);
                                        if (detail) {
                                            setChatId(chat.id);
                                            setMessages(detail.messages);
                                            // 🧩 REGRESO AL FUTURO: Restauración de Consciencia Plena
                                            if (detail.metadata) {
                                                janIACore.setMemory(detail.metadata);
                                                console.log("🧠 [MEMORIA RESTAURADA]:", detail.metadata);
                                            }
                                            localStorage.setItem('janIA_chat_messages', JSON.stringify(detail.messages));
                                            localStorage.setItem('janIA_current_chat_id', chat.id);
                                            setSidebarOpen(false); // Close on mobile
                                        }
                                    }}
                                    className={`flex items-center gap-3 p-2.5 rounded-full hover:bg-white/10 w-full text-left group transition-all ${chatId === chat.id ? 'bg-white/5 border border-white/10' : ''} ${!sidebarOpen && 'justify-center'}`}
                                    title={chat.title}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-colors ${chatId === chat.id ? 'text-brand-accent' : 'text-stone-400 group-hover:text-white'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                                    {sidebarOpen && (
                                        <>
                                            <span className={`text-xs truncate flex-1 ${chatId === chat.id ? 'text-white font-bold' : 'text-stone-300 group-hover:text-white'}`}>{chat.title}</span>
                                            <div
                                                onClick={(e) => triggerDeleteChat(e, chat.id)}
                                                className="p-1 rounded text-stone-400 hover:text-red-400 transition-all opacity-70 hover:opacity-100"
                                                title="Eliminar Chat"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            </div>
                                        </>
                                    )}
                                </button>
                            ))
                        ) : (
                            sidebarOpen && <p className="px-4 text-[10px] text-stone-600">No hay avalúos recientes</p>
                        )}
                    </div>
                    <div className="pt-2 px-2 pb-6 border-t border-white/5 mt-auto">
                        <button
                            onClick={triggerClearHistory}
                            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-stone-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            {sidebarOpen && <span>Limpiar Historial</span>}
                        </button>
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
                            <GlassAvatar
                                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                name={user?.user_metadata?.full_name || user?.email || 'Usuario'}
                                size="md"
                            />
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
                            <div className={`fixed inset-0 m-auto w-[90%] sm:w-64 h-fit border rounded-2xl z-[60] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1 md:absolute md:inset-auto md:left-[105%] md:bottom-0 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#2c2420]'} border-white/10 shadow-xl`}>
                                {/* Profile Header content... */}
                                <div className="px-3 py-3 border-b border-white/10 flex items-center gap-3">
                                    <GlassAvatar
                                        src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                        name={user?.user_metadata?.full_name || user?.email || 'Invitado'}
                                        size="md"
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Invitado'}</span>
                                        <span className="text-[10px] text-stone-500 truncate">{user?.email || 'Regístrate hoy'}</span>
                                    </div>
                                </div>
                                <div className="px-3 py-2 space-y-2">
                                    <div className={`text-[10px] px-2 py-1 rounded-md font-bold text-center uppercase tracking-wider ${theme === 'dark' ? 'bg-white/5 text-brand-accent' : 'bg-brand-coffee-light/20 text-brand-gold'}`}>
                                        {user ? 'Plan Café' : 'Plan Invitado'}
                                    </div>
                                    {/* TERMS BADGE */}
                                    {hasAcceptedTerms && (
                                        <div className="flex items-center justify-center gap-1.5 text-[9px] text-emerald-400 font-medium bg-emerald-500/10 py-1 rounded border border-emerald-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                            Legal Aceptado
                                        </div>
                                    )}
                                </div>
                                {!user ? (
                                    <>
                                        <button onClick={() => setAuthModalOpen(true)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                            <span className="text-sm text-stone-300 group-hover:text-white font-medium">Iniciar sesión</span>
                                        </button>
                                        <button onClick={() => setAuthModalOpen(true)} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                                            <span className="text-sm text-stone-300 group-hover:text-white font-medium">Registrarse</span>
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={async () => {
                                        await supabase.auth.signOut();
                                        janIACore.reset();
                                        localStorage.removeItem('janIA_chat_messages');
                                        localStorage.removeItem('janIA_current_chat_id');
                                        const newId = crypto.randomUUID();
                                        setChatId(newId);
                                        setMessages([{ type: 'bot', text: 'Soy JanIA, tu experta en análisis inmobiliario. ¿Qué quieres descubrir hoy?', component: 'greeting' }]);
                                        setProfileOpen(false);
                                    }} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left group transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-stone-400 group-hover:text-red-400 group-hover:scale-110 transition-all"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                        <span className="text-sm font-medium text-stone-400 group-hover:text-red-400">Cerrar sesión</span>
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
                        <div className={`fixed inset-0 m-auto w-[90%] sm:w-64 h-fit border rounded-2xl z-[60] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1 md:absolute md:inset-auto md:left-[105%] md:bottom-0 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#2c2420]'} border-white/10 shadow-xl`}>

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
                            <span className="text-[8px] md:text-[10px] text-[#00ff22]">● Conectado</span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-brand-accent/50 transition-all overflow-hidden p-1.5 border border-white/10">
                            <img
                                src="/animacion-vecy-blanco.gif"
                                alt="User"
                                className="w-full h-full object-contain opacity-90"
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
                                            <GlassAvatar
                                                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
                                                name={user?.user_metadata?.full_name || user?.email || 'Tú'}
                                                size="md"
                                                className="shrink-0 mt-1 ring-1 ring-white/10"
                                            />
                                            <span className="text-xs font-bold text-white/50">{user ? 'Tú' : 'Invitado'}</span>
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
                                                    Hola, soy JanIA
                                                </h1>
                                                <p className="text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto px-4">
                                                    {(() => {
                                                        const { name } = getNeighborGreeting(user?.user_metadata?.full_name || user?.email?.split('@')[0]);
                                                        // Use name if user is logged in, else 'vecino/a'
                                                        const displayName = user ? name : 'vecino/a';
                                                        return `Tu avaluadora experta ¿Qué inmueble vamos a avaluar hoy ${displayName}?`;
                                                    })()}
                                                </p>
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
                                                                {chip.icon === 'user' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.331 0-4.512-.645-6.374-1.766z" /></svg>}
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
                                                ? 'bg-brand-accent text-black font-medium rounded-tr-sm border-t border-white/40 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)]'
                                                : 'bg-white/10 text-stone-200 border border-white/10 rounded-tl-sm'
                                                }`}>

                                                {/* MARKDOWN RENDERING SAFEGUARD - Simplified to avoid plugin crashes */}
                                                {/* MARKDOWN RENDERING SAFEGUARD */}
                                                {msg?.text ? (
                                                    <div className={`prose prose-sm max-w-none ${msg?.type === 'user' ? 'text-black prose-p:text-black prose-headings:text-black prose-strong:text-black' : 'prose-invert'}`}>
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
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

                                    {/* Generic Options Component (JanIA 3.0) */}
                                    {msg?.component === 'options' && msg?.options && (
                                        <div className="mt-4 flex flex-wrap gap-2 animate-fade-in-up">
                                            {msg.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSendMessage(opt)}
                                                    className="bg-white/5 hover:bg-brand-accent/20 text-white hover:text-brand-accent border border-white/10 hover:border-brand-accent/50 px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-md"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Auth & Identity Components (JanIA 3.0) */}
                                    {(msg?.component === 'auth' || msg?.component === 'auth_options') && (
                                        <div className="mt-4 ml-2 animate-fade-in-up">
                                            <AuthOptions onSelect={handleAuthSelect} />
                                        </div>
                                    )}

                                    {/* Pricing Plans Component */}
                                    {msg?.component === 'plan_card' && (
                                        <div className="w-full mt-4 animate-fade-in-up flex justify-center">
                                            <div className="w-full max-w-4xl scale-95 md:scale-100 origin-top">
                                                <PricingCards
                                                    propertyData={janIACore.memory.property_data}
                                                    onSelect={(plan) => {
                                                        initiateCheckout({
                                                            amount: plan.amount,
                                                            name: `${plan.name} - Vecy Avalúos`,
                                                            description: `Avalúo profesional para el inmueble en ${janIACore.memory.property_data?.barrio || 'Bogotá'}`
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
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
                                                            // Logic: Accept triggers the unified auth component
                                                            const notifyMsg = { id: Date.now(), type: 'bot', text: '¡Excelente! Ahora elige cómo prefieres guardar tu progreso en la nube:', component: 'auth' };
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
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-3 ml-4 mt-2 mb-2 animate-fade-in transition-all duration-500">
                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                        {/* Golden Glow Pulse */}
                                        <div className="absolute inset-0 bg-brand-gold/60 rounded-full blur-[6px] animate-pulse"></div>
                                        {/* Avatar */}
                                        <img
                                            src="/perfil.png"
                                            alt="JanIA"
                                            className="relative z-10 w-6 h-6 rounded-full border border-brand-gold/40 object-cover shadow-sm"
                                        />
                                    </div>
                                    <span className="text-stone-400 text-xs font-light tracking-wide italic animate-pulse min-w-[180px]">
                                        {thinkingText}{typingDots}
                                    </span>
                                </div>
                            )}

                            {!isTyping && isAnalyzing && (
                                <div className="flex items-center gap-2 text-brand-gold/70 text-[10px] ml-4 animate-pulse transition-opacity duration-500">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    {thinkingText}
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
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                        e.preventDefault();
                                        handleSendMessage(input, attachments.map(a => a.file));
                                    }
                                }}
                                placeholder="Pega un link, escribe un mensaje o sube un PDF..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-stone-400 text-sm"
                                onFocus={() => { setProfileOpen(false); setSettingsOpen(false); }}
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
                        {/* Disclaimer - STANDARD VECY COMPONENT */}
                        <DisclaimerText />
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

            {/* TERMS GATE MODAL (PHASE 5.1) - REDESIGNED */}
            {termsModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white/20 backdrop-blur-3xl border border-white/20 rounded-[32px] p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(204,172,78,0.25)] overflow-hidden">

                        {/* Background Shine */}
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine pointer-events-none"></div>

                        <div className="text-center mb-8 relative z-10">
                            {/* Icon Container */}
                            <div className="w-20 h-20 mx-auto bg-brand-gold/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_30px_rgba(204,172,78,0.2)]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-gold drop-shadow-sm">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 font-outfit tracking-tight">¡Bienvenido, Vecino!</h3>
                            <p className="text-stone-400 text-sm leading-relaxed px-4 font-light">
                                Antes de iniciar, acepta nuestras políticas de <strong className="text-orange-400 font-medium">"Inteligencia Colectiva"</strong> para proteger tus datos.
                            </p>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            <div className="flex gap-4 text-xs text-stone-400 justify-center font-medium tracking-wide">
                                <Link to="/terminos" target="_blank" className="flex items-center gap-1.5 hover:text-brand-gold transition-colors duration-300 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                    <span className="text-stone-700 font-bold bg-white/50 px-2 py-0.5 rounded">Leer Términos</span>
                                </Link>
                                <span className="text-stone-500">|</span>
                                <Link to="/privacidad" target="_blank" className="flex items-center gap-1.5 hover:text-brand-gold transition-colors duration-300 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                                    <span className="text-stone-700 font-bold bg-white/50 px-2 py-0.5 rounded">Leer Privacidad</span>
                                </Link>
                            </div>
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    // 1. Reset Logic (Fresh Chat)
                                    janIACore.reset();
                                    setMessages([]);

                                    // 2. Persistence (Immediate)
                                    localStorage.setItem('janIA_guest_terms_accepted', 'true');
                                    if (user) {
                                        // Async update, don't block UI
                                        supabase.from('profiles').update({ accepted_terms: true }).eq('id', user.id).then(({ error }) => {
                                            if (error) console.error("Error updating terms:", error);
                                        });
                                    }

                                    // 3. UI Update (Close Modal)
                                    setTermsModalOpen(false);
                                    setHasAcceptedTerms(true);

                                    // 4. Initial Greeting (New Chat with Avatar Fix)
                                    const greeting = handleInitialGreeting(user);
                                    // FIXED: Added component: 'greeting' and type: 'bot' to trigger avatar rendering
                                    const msg = {
                                        id: Date.now(),
                                        text: greeting,
                                        type: 'bot',
                                        sender: 'JanIA', // Explicit sender for potential future use
                                        component: 'greeting' // Critical for Avatar
                                    };
                                    setMessages([msg]);
                                    janIACore.history.push({ role: 'assistant', content: greeting });

                                } catch (e) { console.error(e); }
                            }}
                            className="group relative w-full py-4 bg-gradient-to-r from-brand-accent to-brand-gold text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,172,78,0.6)] hover:brightness-110 shadow-lg shadow-brand-accent/30 relative overflow-hidden z-10"
                        >
                            <span className="relative z-10 drop-shadow-sm flex items-center justify-center gap-2">
                                ACEPTAR Y CONTINUAR 🚀
                            </span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                        </button>
                    </div>
                </div>
            )}

            {/* GLASS UI ALERTS */}
            <GlassToast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, message: null })}
            />
            <GlassConfirm
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                isDanger={confirmModal.isDanger}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div >
    );
};

// Export Agent Component
export default JanIAAgent;
