import React from 'react';
import { Zap, Rocket, Cpu, Globe } from 'lucide-react';

const Research = () => {
  const researchAreas = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quantum Computing",
      description: "Developing next-generation quantum computers and algorithms.",
      publications: 156
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Space Exploration",
      description: "Advanced propulsion systems and space habitat technology.",
      publications: 203
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI & Robotics",
      description: "Autonomous systems and artificial general intelligence.",
      publications: 178
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Climate Engineering",
      description: "Planetary climate control and terraforming technologies.",
      publications: 142
    }
  ];

  return (
    <section className="bg-black py-24" id="research">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Research & Innovation
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pushing the boundaries of human knowledge through groundbreaking research and technological innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {researchAreas.map((area) => (
            <div
              key={area.title}
              className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-colors duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="text-blue-500 mr-4">{area.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{area.title}</h3>
                  <p className="text-blue-400">{area.publications} Publications</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">{area.description}</p>
              <button className="text-blue-500 hover:text-blue-400 transition-colors duration-300 flex items-center">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">$2.5B+</div>
              <div className="text-gray-400">Research Funding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">1,200+</div>
              <div className="text-gray-400">Research Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">300+</div>
              <div className="text-gray-400">Partner Institutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;