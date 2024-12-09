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
import Auth from './components/Auth';

function AppContent() {
  const { user, authForm, setAuthForm } = useAuth();

  // Initialize Userback when component mounts
  useEffect(() => {
    initializeUserback(user);
  }, []);

  // Update user data when user changes
  useEffect(() => {
    updateUserData(user);
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