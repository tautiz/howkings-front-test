import React, { useEffect } from 'react';
import Navbar from './components/navbar/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import About from './components/About/index';
import RequestPool from './components/RequestPool/index';
import Research from './components/Research';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeUserback, updateUserData } from './services/userbackService';
import { analyticsService } from './services/analyticsService';
import Auth from './components/Auth';
import CookieConsent from './components/CookieConsent';

function AppContent() {
  const { user, authForm, setAuthForm } = useAuth();

  // Initialize Userback and analytics when component mounts
  useEffect(() => {
    initializeUserback(user);
    analyticsService.initializeAnalytics();
  }, []);

  // Update user data when user changes
  useEffect(() => {
    updateUserData(user);
  }, [user]);

  useEffect(() => {
    if (user) {
      analyticsService.trackEvent({
        action: 'user_login',
        category: 'authentication',
        label: user.email
      });
    }
  }, [user]);

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type = 'error' } = event.detail;
      const toastMethod = type === 'success' ? toast.success : 
                         type === 'info' ? toast.info : 
                         type === 'warning' ? toast.warning : 
                         toast.error;
      
      toastMethod(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    };

    window.addEventListener('app:show-toast', handleToast as EventListener);
    
    return () => {
      window.removeEventListener('app:show-toast', handleToast as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <Hero />
        <Programs />
        <About />
        <RequestPool />
        <Research />
      </main>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      <CookieConsent />
      {authForm && (
        <Auth
          initialForm={authForm}
          onClose={() => setAuthForm(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;