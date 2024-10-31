import React, { useState } from 'react';
import { Atom, Brain, Globe, Database, Rocket, Cpu, Shield, Microscope } from 'lucide-react';

const Programs = () => {
  const [activeCategory, setActiveCategory] = useState('undergraduate');

  const categories = [
    { id: 'undergraduate', label: 'Undergraduate' },
    { id: 'graduate', label: 'Graduate' },
    { id: 'doctorate', label: 'Doctorate' },
    { id: 'research', label: 'Research' }
  ];

  const programs = {
    undergraduate: [
      {
        icon: <Atom className="w-8 h-8" />,
        title: 'Quantum Engineering',
        description: 'Explore quantum mechanics and its applications in computing.',
        duration: '4 years',
        credits: 120
      },
      {
        icon: <Brain className="w-8 h-8" />,
        title: 'Neural Sciences',
        description: 'Study artificial intelligence and cognitive systems.',
        duration: '4 years',
        credits: 120
      },
      {
        icon: <Globe className="w-8 h-8" />,
        title: 'Space Technology',
        description: 'Learn about spacecraft and propulsion systems.',
        duration: '4 years',
        credits: 120
      },
      {
        icon: <Database className="w-8 h-8" />,
        title: 'Data Architecture',
        description: 'Master future information systems.',
        duration: '4 years',
        credits: 120
      }
    ],
    graduate: [
      {
        icon: <Rocket className="w-8 h-8" />,
        title: 'Advanced Propulsion',
        description: 'Research in spacecraft propulsion technologies.',
        duration: '2 years',
        credits: 60
      },
      {
        icon: <Cpu className="w-8 h-8" />,
        title: 'Quantum Computing',
        description: 'Advanced study of quantum information systems.',
        duration: '2 years',
        credits: 60
      }
    ],
    doctorate: [
      {
        icon: <Shield className="w-8 h-8" />,
        title: 'Cybernetic Systems',
        description: 'Research in human-machine integration.',
        duration: '4-5 years',
        credits: 90
      },
      {
        icon: <Microscope className="w-8 h-8" />,
        title: 'Nano Engineering',
        description: 'Advanced research in molecular engineering.',
        duration: '4-5 years',
        credits: 90
      }
    ],
    research: [
      {
        icon: <Brain className="w-8 h-8" />,
        title: 'AI Ethics',
        description: 'Research in artificial intelligence ethics.',
        duration: 'Varies',
        credits: null
      },
      {
        icon: <Globe className="w-8 h-8" />,
        title: 'Space Colonization',
        description: 'Research in sustainable space habitats.',
        duration: 'Varies',
        credits: null
      }
    ]
  };

  return (
    <section className="bg-gray-900 py-24" id="programs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Academic Programs
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our cutting-edge programs designed to prepare you for the challenges of tomorrow.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {programs[activeCategory].map((program) => (
            <div
              key={program.title}
              className="group bg-gray-800 rounded-xl p-8 transform transition-all duration-300
                hover:scale-105 hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-blue-500 transform transition-transform duration-300
                  group-hover:scale-110 group-hover:text-blue-400">
                  {program.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{program.title}</h3>
                  <p className="text-gray-400 mb-4">{program.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-blue-400">
                      Duration: {program.duration}
                    </span>
                    {program.credits && (
                      <span className="text-blue-400">
                        Credits: {program.credits}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-full
            hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105">
            Request Program Details
          </button>
        </div>
      </div>
    </section>
  );
};

export default Programs;