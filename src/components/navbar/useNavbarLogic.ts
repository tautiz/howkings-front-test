// src/components/navbar/useNavbarLogic.ts
import { useState, useEffect } from 'react';
import { navigationItems } from './navbarHelpers';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { useAuth } from '../../contexts/AuthContext';

interface UseNavbarLogicReturn {
  user: { name: string } | null;
  isOpen: boolean;
  isTransitioning: boolean;
  authForm: 'login' | 'signup' | null;
  showAuthButtons: boolean;
  showSearch: boolean;
  handleNavigation: (sectionId: string) => void;
  handleLogoClick: () => void;
  setIsOpen: (open: boolean) => void;
  setAuthForm: (form: 'login' | 'signup' | null) => void;
  logout: () => Promise<void>;
  navigationItems: string[];
}

export const useNavbarLogic = (): UseNavbarLogicReturn => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authForm, setAuthForm] = useState<'login' | 'signup' | null>(null);

  const showAuthButtons = useFeatureFlag('FEATURE_ALLOW_USER_REGISTRATION');
  const showSearch = useFeatureFlag('FEATURE_ENABLE_SEARCH');

  const handleNavigation = (sectionId: string) => {
    setIsTransitioning(true);
    setIsOpen(false);
    
    const normalizedSectionId = (sectionId === 'plans' || sectionId === 'features') ? 'programs' : sectionId;
    const targetSection = document.getElementById(normalizedSectionId);
    if (targetSection) {
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'instant' });
        
        // If navigating to Programs section, trigger corresponding category button
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
