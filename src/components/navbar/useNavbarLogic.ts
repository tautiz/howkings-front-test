// src/components/navbar/useNavbarLogic.ts
import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export type NavigationItem = 'home' | 'programs' | 'about' | 'research' | 'contact';

export const useNavbarLogic = () => {
  const { user, logout: authLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authForm, setAuthForm] = useState<'signin' | 'signup' | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const navigationItems: NavigationItem[] = ['home', 'programs', 'about', 'research', 'contact'];

  const handleNavigation = useCallback((section: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleLogoClick = useCallback(() => {
    handleNavigation('home');
  }, [handleNavigation]);

  const logout = useCallback(() => {
    authLogout();
    setIsOpen(false);
  }, [authLogout]);

  const showAuthButtons = !user && !authForm;

  return {
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
  };
};
