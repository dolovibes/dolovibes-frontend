import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Logo y descripción */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-emerald-400">Dolo</span>Vibes
                        </h3>
                        <p className="text-slate-400 leading-relaxed max-w-md mb-6">
                            Experiencias de montaña únicas en las Dolomitas italianas.
                            Aventura, naturaleza y cultura en cada viaje.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Experiencias */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Experiencias</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/experiencia/hut-2-hut" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    Hut 2 Hut
                                </Link>
                            </li>
                            <li>
                                <Link to="/experiencia/hiking" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    Hiking
                                </Link>
                            </li>
                            <li>
                                <Link to="/experiencia/city-lights" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    City Lights
                                </Link>
                            </li>
                            <li>
                                <Link to="/experiencia/ski-pull" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    Ski Pull
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-slate-400">
                                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <span>Monterrey, México</span>
                            </li>
                            <li>
                                <a href="tel:+528112345678" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                                    <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>+52 81 1234 5678</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@dolovibes.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                                    <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span>info@dolovibes.com</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} DoloVibes. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/about" className="text-slate-500 hover:text-white transition-colors">
                                Nosotros
                            </Link>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                Términos
                            </a>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                Privacidad
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
