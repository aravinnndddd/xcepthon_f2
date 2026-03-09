import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const handleNavClick = (e, href) => {
        e.preventDefault();
        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <footer className="bg-goku-indigo pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
            {/* Decorative effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-goku-yellow/10 blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-heading text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-goku-orange to-goku-yellow">
                                XCEPTHON
                            </span>
                        </div>
                        <p className="text-gray-400 font-sans max-w-sm mb-6">
                            <span className="text-paper font-bold">Where Exceptions Become Innovation.</span> The ultimate 48-hour battleground for developers, designers, and visionaries.
                        </p>
                        <div className="flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-goku-yellow transition-colors"><Twitter size={24} /></a>
                            <a href="#" className="hover:text-goku-yellow transition-colors"><Linkedin size={24} /></a>
                            <a href="#" className="hover:text-goku-yellow transition-colors"><Github size={24} /></a>
                            <a href="#" className="hover:text-goku-yellow transition-colors"><Mail size={24} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading text-xl text-white mb-4 tracking-wide">Quick Links</h4>
                        <ul className="space-y-2 font-sans text-gray-400">
                            <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-goku-yellow transition-colors">About</a></li>
                            <li><a href="#tracks" onClick={(e) => handleNavClick(e, "#tracks")} className="hover:text-goku-yellow transition-colors">Tracks</a></li>
                            <li><a href="#prizes" onClick={(e) => handleNavClick(e, "#prizes")} className="hover:text-goku-yellow transition-colors">Prizes</a></li>
                            <li><a href="#schedule" onClick={(e) => handleNavClick(e, "#schedule")} className="hover:text-goku-yellow transition-colors">Schedule</a></li>
                            <li><a href="#sponsors" onClick={(e) => handleNavClick(e, "#sponsors")} className="hover:text-goku-yellow transition-colors">Sponsors</a></li>
                            <li><a href="#faq" onClick={(e) => handleNavClick(e, "#faq")} className="hover:text-goku-yellow transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading text-xl text-white mb-4 tracking-wide">Legal</h4>
                        <ul className="space-y-2 font-sans text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Code of Conduct</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 font-sans text-sm">
                    <p>&copy; 2026 XCEPTHON. All rights reserved.</p>
                    <p className="flex items-center gap-1 mt-2 md:mt-0">
                        Powered by <span className="text-goku-yellow font-heading tracking-widest ml-1">ASCI'26</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
