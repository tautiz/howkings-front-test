import React from 'react';
import { Rocket, Globe2 } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] 
          bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 
            tracking-tight leading-tight animate-fade-in">
            Welcome to <span className="text-blue-500">Howkings</span><br />
            University of the Future
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-12">
            Pioneering the next generation of innovation and discovery in space exploration 
            and advanced technologies.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="group relative px-8 py-3 bg-blue-600 text-white rounded-full 
              overflow-hidden transition-all duration-300 ease-out hover:scale-105">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                Explore Programs
              </span>
              <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 
                transition-transform origin-left duration-300"></div>
            </button>

            <button className="group px-8 py-3 border-2 border-white text-white rounded-full 
              transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-2">
              <Globe2 className="w-5 h-5" />
              Virtual Tour
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Students', value: '15,000+' },
              { label: 'Research Labs', value: '250+' },
              { label: 'Publications', value: '5,000+' },
              { label: 'Success Rate', value: '98%' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 rounded-full bg-gradient-to-b from-blue-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;