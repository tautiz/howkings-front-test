import React from 'react';
import { Menu, X, Search, Linkedin, LogOut } from 'lucide-react';
import TeleportTransition from '../TeleportTransition';
import Auth from '../Auth';
import LanguageSwitch from '../LanguageSwitch';
import { useNavbarLogic, NavigationItem } from './useNavbarLogic';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar = () => {
  const {
    user,
    isOpen,
    isTransitioning,
    authForm,
    showAuthButtons,
    showSearch,
    handleNavigation,
    handleLogoClick,
    setIsOpen,
    setAuthForm,
    logout,
    navigationItems
  } = useNavbarLogic();

  const { translations } = useLanguage();

  return (
    <>
      <TeleportTransition
        isActive={isTransitioning} 
        onComplete={() => {/* no-op */}} 
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

            <div id="menu" className="hidden md:block flex-1">
              <div className="flex items-baseline justify-center space-x-6">
                {navigationItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item)}
                    className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {translations.nav[item]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitch />
              {/* Desktop mygtukai */}
              <div className="hidden md:flex items-center space-x-4">
                {showAuthButtons && !user && (
                  <>
                    <button 
                      onClick={() => setAuthForm('signin')}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium 
                        hover:bg-blue-600 transition-colors"
                    >
                      {translations.nav.signIn}
                    </button>
                    <button 
                      onClick={() => setAuthForm('signup')}
                      className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium 
                        border-2 border-white hover:bg-white hover:text-black transition-colors"
                    >
                      {translations.nav.signUp}
                    </button>
                  </>
                )}
                {user && (
                  <div className="flex items-center space-x-4">
                    <span className="text-white">{translations.nav.hello}, {user.name}</span>
                    <button 
                      onClick={logout}
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                      title={translations.nav.logout}
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Burger meniu mygtukas */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
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
                onClick={() => handleNavigation(item)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium
                  transition-all duration-300 hover:bg-gray-800 w-full text-left"
                disabled={isTransitioning}
              >
                {translations.nav[item]}
              </button>
            ))}

            {showAuthButtons && !user && (
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setAuthForm('signin');
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium 
                    hover:bg-blue-600 transition-colors"
                >
                  {translations.nav.signIn}
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setAuthForm('signup');
                  }}
                  className="w-full px-4 py-2 bg-black text-white rounded-full text-sm font-medium 
                    border-2 border-white hover:bg-white hover:text-black transition-colors"
                >
                  {translations.nav.signUp}
                </button>
              </div>
            )}

            {user && (
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <span className="text-white">{translations.nav.hello}, {user.name}</span>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium 
                    hover:bg-red-600 transition-colors"
                >
                  {translations.nav.logout}
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
