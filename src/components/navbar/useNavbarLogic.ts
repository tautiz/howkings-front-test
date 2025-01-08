// src/components/navbar/useNavbarLogic.ts
import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthFormType } from '../Auth';

export type NavigationItem = 'home' | 'programs' | 'about' | 'research';

export const useNavbarLogic = () => {
  const { user, logout: authLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authForm, setAuthForm] = useState<AuthFormType>(null);
  const [showSearch, setShowSearch] = useState(false);

  const navigationItems: NavigationItem[] = ['home', 'programs', 'about', 'research'];

  const handleNavigation = useCallback((section: string) => {
    setIsTransitioning(true);
    setIsOpen(false);
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
    setAuthForm(null);
  }, [authLogout]);

  // Rodome auth mygtukus tik kai nėra prisijungusio vartotojo
  const showAuthButtons = !user;

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
