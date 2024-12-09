import React, { useState } from 'react';
import { Play, Users, X } from 'lucide-react';

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleViewPlans = () => {
    const programsSection = document.getElementById('programs');
    if (programsSection) {
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        programsSection.scrollIntoView({ behavior: 'instant' });
        const plansButton = document.querySelector('[data-category="plans"]') as HTMLButtonElement;
        if (plansButton) {
          plansButton.click();
        }
        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');
        
        setTimeout(() => {
          document.body.classList.remove('fade-in');
        }, 500);
      }, 500);
    }
  };

  return (
    <>
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-6xl aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/AvgLCEj4g6Y?autoplay=1"
              title="Howkings Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div 
        className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        role="region"
        aria-label="Hero Section"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] 
            bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-bold text-white mb-8 
              tracking-tight leading-tight animate-fade-in">
              Welcome to the new age university where you can achieve <span className="text-gradient">lifelong learning</span> 
              <br/>and land your <span className="text-gradient">dream job</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12">
              Howkings University - revolutionary platform offering everyday learners non-duplicating, affordable, multilingual learning content created by lecturers, scientists, and subject matter experts with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button 
                onClick={() => setShowVideo(true)}
                className="group relative px-8 py-3 bg-blue-600 text-white rounded-full 
                  overflow-hidden transition-all duration-300 ease-out hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </span>
                <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 
                  transition-transform origin-left duration-300"></div>
              </button>

              <button 
                onClick={handleViewPlans}
                className="group px-8 py-3 border-2 border-white text-white rounded-full 
                  transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                View Plans
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'People waiting for Platform Launch', value: '200+' },
                { label: 'Submitted Requests to Learn', value: '100+' },
                { label: 'Submitted Requests to Teach', value: '100+' }
              ].map((stat) => (
                <div 
                  key={stat.label} 
                  className="text-center transform transition-all duration-300 hover:scale-110 cursor-pointer group"
                >
                  <div className="text-3xl font-bold transition-colors duration-300 group-hover:text-purple-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;