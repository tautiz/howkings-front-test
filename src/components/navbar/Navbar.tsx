// src/components/navbar/Navbar.tsx
import { Menu, X, Search, Linkedin, LogOut } from 'lucide-react';
import TeleportTransition from '../TeleportTransition';
import Auth from '../Auth';
import { useNavbarLogic } from './useNavbarLogic';

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

  return (
    <>
      <TeleportTransition
        isActive={isTransitioning} 
        onComplete={() => {/* no-op, valdymas logikoje */}} 
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
                    onClick={() => handleNavigation(item.toLowerCase().replace(' ', '-'))}
                    className="text-gray-200 px-4 py-2.5 rounded-lg text-[15px] font-medium
                      transition-all duration-300 
                      hover:text-white hover:bg-blue-500/10 hover:scale-105
                      relative group
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isTransitioning}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 
                      transform scale-x-0 transition-transform duration-300 
                      group-hover:scale-x-100" />
                  </button>
                ))}
              </div>
            </div>      

            <div className="flex items-center shrink-0">
              {/* Mobilūs mygtukai (be Login/SignUp) */}
              <div className="md:hidden flex items-center space-x-2">
                {showSearch && (
                  <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                    <Search className="h-4 w-4 text-gray-300" />
                  </button>
                )}
                <a 
                  href="https://www.linkedin.com/company/howkings/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-gray-300" />
                </a>
              </div>

              {/* Desktop mygtukai */}
              <div id="authorization_buttons" className="hidden md:flex items-center justify-start space-x-4">
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
                {/* Login/SignUp mygtukai */}
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
              </div>

              {/* Burger meniu mygtukas */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors ml-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </button>
            </div>


            <div className="flex items-center space-x-4">
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
