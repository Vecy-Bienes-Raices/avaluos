
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Close menu on scroll to section
    const scrollToSection = (id) => {
        setIsMenuOpen(false); // Close mobile menu first
        const element = document.getElementById(id);
        if (element) {
            // Need a timeout to allow the menu to close and layout to stabilize
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // Add scroll listener for styling if needed later (optional optimization)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: 'Inicio', target: 'hero' },
        { label: 'Inmueble', target: 'property' },
        { label: 'Mercado', target: 'market' },
        { label: 'Valoración', target: 'valuation' }
    ];

    return (
        <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
            <div className="glass-panel px-6 py-3 flex justify-between items-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative bg-white/10 backdrop-blur-md border border-white/20">
                {/* Logo Section */}
                <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
                    <img src="/logovecy.ico" alt="Vecy Avalúos Logo" className="w-10 h-10 mr-3 object-contain drop-shadow-md" />
                    <div>
                        <span className="font-bold text-lg tracking-tight text-brand-accent drop-shadow-[0_0_8px_rgba(217,119,6,0.8)] block leading-none">VECY</span>
                        <span className="text-[0.65rem] uppercase tracking-widest text-[#BCAAA4] font-bold">Bienes Raíces</span>
                    </div>
                </div>

                {/* Desktop Menu (Hidden on Mobile) */}
                <div className="hidden md:flex space-x-1 p-1 bg-slate-100/50 rounded-full backdrop-blur-sm shadow-inner">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => scrollToSection(item.target)}
                            className="px-5 py-2 text-sm font-bold text-stone-700 rounded-full hover:bg-white hover:text-brand-primary hover:shadow-md transition-all duration-300"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-stone-200 focus:outline-none p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Overlay) */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 px-4 md:hidden animate-fade-in origin-top z-40">
                    <div className="glass-panel-dark p-6 flex flex-col space-y-4 shadow-2xl border border-white/10 rounded-3xl bg-[#2C241E]/95 backdrop-blur-xl">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => scrollToSection(item.target)}
                                className="w-full text-center py-4 text-lg font-bold text-brand-gold border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-all active:scale-95"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
