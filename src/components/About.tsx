import React from 'react';
import { History, Users, Award, Target } from 'lucide-react';

const About = () => {
  return (
    <section className="bg-black py-24" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            About Howkings University
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A legacy of innovation spanning over five decades, shaping the future of humanity through groundbreaking research and education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070"
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <History className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Our History</h3>
                <p className="text-gray-400">Founded in 2040, Howkings University has been at the forefront of technological advancement and space exploration education.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Users className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Our Community</h3>
                <p className="text-gray-400">A diverse community of innovators, researchers, and visionaries from over 100 countries.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Award className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Recognition</h3>
                <p className="text-gray-400">Consistently ranked among the top institutions for space technology and quantum research.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Target className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Our Mission</h3>
                <p className="text-gray-400">To pioneer breakthrough discoveries that advance human knowledge and exploration of the cosmos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;