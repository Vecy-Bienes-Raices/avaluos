import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faXTwitter, faFacebook, faInstagram, faLinkedin, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="py-12 px-4 bg-transparent mt-12 border-t border-white/5">
            <div className="max-w-4xl mx-auto text-center">

                {/* 1. Social Icons */}
                <div className="flex justify-center items-center gap-6 mb-6">
                    {[
                        { icon: faGithub, url: 'https://github.com/Vecy-Bienes-Raices' },
                        { icon: faXTwitter, url: 'https://twitter.com/vecy_avaluos' },
                        { icon: faFacebook, url: 'https://facebook.com/vecyavaluos' },
                        { icon: faInstagram, url: 'https://instagram.com/vecy.avaluos' },
                        { icon: faLinkedin, url: 'https://linkedin.com/company/vecy-avaluos' },
                        { icon: faYoutube, url: 'https://youtube.com/@vecyavaluos' },
                        { icon: faTiktok, url: 'https://tiktok.com/@vecyavaluos' }
                    ].map((item, i) => (
                        <a
                            key={i}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-500 hover:text-brand-accent transition-all duration-300 hover:scale-110"
                        >
                            <FontAwesomeIcon icon={item.icon} className="text-xl" />
                        </a>
                    ))}
                </div>

                {/* 2. Copyright / Agent Info */}
                <div className="mb-4 text-stone-400 font-medium text-sm tracking-wide">
                    Agente JanIA v2.0 © 2025 Vecy Avalúos
                </div>

                {/* 3. Legal Links */}
                <div className="flex justify-center gap-6 text-xs text-stone-600 font-medium">
                    <Link to="/privacidad" className="hover:text-stone-300 transition-colors">Política de Privacidad</Link>
                    <Link to="/terminos" className="hover:text-stone-300 transition-colors">Términos y Condiciones</Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
