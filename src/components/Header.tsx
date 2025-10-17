import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onNavigateToAbout?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToContact?: () => void;
}

export default function Header({ onNavigateToAbout, onNavigateToHome, onNavigateToContact }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'INICIO', action: onNavigateToHome },
    { name: 'ACERCA DE LA MOTORS', action: onNavigateToAbout },
    { name: 'CONTÁCTANOS', action: onNavigateToContact }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={onNavigateToHome} className="flex items-center">
              <img 
                src="https://assets.cdn.filesafe.space/pLPsOipNDbe25NdrJvsQ/media/68e00fe76fa5cab480bb11e0.png" 
                alt="LA Motors Logo" 
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Navigation and Phone Numbers */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Links */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={item.action}
                  className="text-white hover:text-orange-400 font-medium text-sm tracking-wide transition-colors duration-200"
                >
                  {item.name}
                </button>
              </motion.div>
            ))}

            {/* Separator */}
            <div className="h-6 w-px bg-gray-600"></div>

            {/* Phone Numbers */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-sm">+506 6000 3311</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-sm">+506 8991 4651</span>
              </div>
            </div>
          </div>

          {/* Medium screens - Navigation only */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -1 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={item.action}
                  className="text-white hover:text-orange-400 font-medium text-sm tracking-wide transition-colors duration-200"
                >
                  {item.name}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-gray-300 block px-3 py-2 text-sm font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Phone Numbers */}
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex items-center gap-2 px-3 py-1 text-gray-300">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">+506 6000 3311</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 text-gray-300">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">+506 8991 4651</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}