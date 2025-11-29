import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigation = (item: string) => {
    if (item === 'About') {
      navigate('/about');
      setIsMenuOpen(false);
    } else if (item === 'Home') {
      navigate('/');
      setIsMenuOpen(false);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(item.toLowerCase());
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(item.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMenuOpen(false);
    }
  };

  const menuItems = ['Home', 'About', 'Services', 'Events', 'Contact'];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-brand-dark bg-brand-beige">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-beige/90 backdrop-blur-sm border-b border-dashed border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] opacity-0 animate-fade-in delay-100">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <button onClick={() => handleNavigation('Home')} className="flex items-center">
            <img 
              src="/Logo.png" 
              alt="DJ Ozzy" 
              className="h-12 w-auto object-contain hover:opacity-80 transition-opacity"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12 text-xs font-medium uppercase tracking-wider">
            {menuItems.map((item) => {
                return (
                    <button 
                        key={item} 
                        onClick={() => handleNavigation(item)} 
                        className="group relative"
                    >
                        {item}
                        {/* Custom animated underline growing from left to right */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-500 ease-out group-hover:w-full"></span>
                    </button>
                );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden z-50 p-2" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Placed outside nav to avoid backdrop-filter stacking context clipping */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-brand-beige z-50 flex flex-col items-center justify-center space-y-8 text-3xl font-serif">
          {/* Close button inside the overlay for better UX */}
          <button className="absolute top-6 right-6 p-2" onClick={toggleMenu}>
             <X size={24} />
          </button>
          
          {menuItems.map((item) => {
              return (
                  <button 
                    key={item} 
                    onClick={() => handleNavigation(item)}
                    className="group relative"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                  </button>
              );
          })}
        </div>
      )}

      {/* Main Content */}
      <main className={`relative z-10 ${location.pathname === '/' ? 'pt-20 -mt-16' : 'pt-20'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;