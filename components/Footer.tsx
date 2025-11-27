import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-beige border-t border-dashed border-black/10 py-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    © {new Date().getFullYear()} DJ Ozzy Entertainment. All rights reserved.
                </div>
                
                <div className="flex items-center space-x-6">
                    <a href="https://www.instagram.com/partywithdjozzy/" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:opacity-50 transition-opacity">
                        <Instagram size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;