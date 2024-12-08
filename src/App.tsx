import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import About from './components/About/index';
import RequestPool from './components/RequestPool/index';
import Research from './components/Research';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type = 'error' } = event.detail;
      toast[type](message, {
        position: "top-right",
        autoClose: 3000,
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
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Hero />
        <Programs />
        <About />
        <RequestPool />
        <Research />
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
      </div>
    </AuthProvider>
  );
}

export default App;