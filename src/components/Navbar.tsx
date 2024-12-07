import React, { useState } from 'react';
import { Menu, X, Search, Linkedin, LogOut } from 'lucide-react';
import TeleportTransition from './TeleportTransition';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useAuth } from '../contexts/AuthContext';
import Auth from './Auth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authForm, setAuthForm] = useState<'login' | 'signup' | null>(null);
  
  const showAuthButtons = useFeatureFlag('FEATURE_ALLOW_USER_REGISTRATION');
  const showSearch = useFeatureFlag('FEATURE_ENABLE_SEARCH');

  const handleNavigation = (sectionId: string) => {
    setIsTransitioning(true);
    setIsOpen(false);
    
    const targetSection = document.getElementById(sectionId === 'plans' || sectionId === 'features' ? 'programs' : sectionId);
    if (targetSection) {
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'instant' });
        
        // If navigating to Programs section, click the corresponding category button
        if (sectionId === 'plans' || sectionId === 'features') {
          const categoryButton = document.querySelector(`[data-category="${sectionId}"]`) as HTMLButtonElement;
          if (categoryButton) {
            categoryButton.click();
          }
        }

        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');
        
        setTimeout(() => {
          setIsTransitioning(false);
          document.body.classList.remove('fade-in');
        }, 1000);
      }, 750);
    }
  };

  const handleLogoClick = () => {
    setIsTransitioning(true);
    setIsOpen(false);
    
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.classList.add('fade-out');
    
    setTimeout(() => {
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
      
      setTimeout(() => {
        setIsTransitioning(false);
        document.body.classList.remove('fade-in');
      }, 1000);
    }, 750);
  };

  const navigationItems = ['About', 'Request pool', 'Plans', 'Features', 'Research'];

  return (
    <>
      <TeleportTransition 
        isActive={isTransitioning} 
        onComplete={() => setIsTransitioning(false)} 
      />
      
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={handleLogoClick}
                className="text-white font-bold text-xl tracking-wider hover:text-blue-500 transition-colors"
              >
                HOWKINGS
              </button>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item.toLowerCase().replace(' ', '-'))}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium
                      transition-all duration-300 hover:scale-105 relative
                      after:content-[''] after:absolute after:bottom-0 after:left-0 
                      after:w-0 after:h-0.5 after:bg-blue-500 
                      after:transition-all after:duration-300
                      hover:after:w-full
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTransitioning}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {showSearch && (
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Search className="h-5 w-5 text-gray-300" />
                </button>
              )}
              <a 
                href="https://www.linkedin.com/company/howkings/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-gray-300" />
              </a>
              {showAuthButtons && !user && (
                <>
                  <button 
                    onClick={() => setAuthForm('login')}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium 
                      hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setAuthForm('signup')}
                    className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium 
                      border-2 border-white hover:bg-white hover:text-black transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Hello, {user.name}</span>
                  <button 
                    onClick={logout}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90">
            {navigationItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(item.toLowerCase().replace(' ', '-'))}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium
                  transition-all duration-300 hover:bg-gray-800 w-full text-left
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isTransitioning}
              >
                {item}
              </button>
            ))}
            {showAuthButtons && !user && (
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setAuthForm('login');
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium 
                    hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setAuthForm('signup');
                  }}
                  className="w-full px-4 py-2 bg-black text-white rounded-full text-sm font-medium 
                    border-2 border-white hover:bg-white hover:text-black transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
            {user && (
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <span className="text-white">Hello, {user.name}</span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium 
                    hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {authForm && (
        <Auth
          initialForm={authForm}
          onClose={() => setAuthForm(null)}
        />
      )}
    </>
  );
};

export default Navbar;