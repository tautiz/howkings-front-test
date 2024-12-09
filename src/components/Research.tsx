import React from 'react';
import { Search, Play, Book, Cpu, Link, RefreshCcw, Globe, BrainCircuit } from 'lucide-react';

const Research = () => {
  return (
    <section 
      className="bg-black py-24" 
      id="research"
      role="region"
      aria-label="Research and Innovation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Research & Innovation
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover a revolutionary learning platform that transforms how you explore, learn, and grow in science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <Search className="w-8 h-8" />,
              title: "Smart Module Search",
              features: [
                "Browse modules by country or scientific field",
                "Expanding library across multiple disciplines",
                "Curated by leading experts"
              ]
            },
            {
              icon: <Play className="w-8 h-8" />,
              title: "Multi-Format Learning",
              features: [
                "Read, watch, or listen to modules",
                "Interactive tasks and assessments",
                "Continuously updated content"
              ]
            },
            {
              icon: <Book className="w-8 h-8" />,
              title: "Intelligent Navigation",
              features: [
                "Seamlessly jump between modules",
                "Build comprehensive understanding",
                "Adaptive learning paths"
              ]
            },
            {
              icon: <Cpu className="w-8 h-8" />,
              title: "Progress Tracking",
              features: [
                "Track completed modules",
                "Visualize learning journey",
                "Build knowledge portfolio"
              ]
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-blue-500 mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <ul className="space-y-2">
                {feature.features.map((item, index) => (
                  <li key={index} className="text-gray-400 flex items-start">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Link className="w-8 h-8" />,
              title: "Career Integration",
              features: [
                "Browse matching job opportunities",
                "Real-time compatibility scoring",
                "Direct application portal"
              ]
            },
            {
              icon: <RefreshCcw className="w-8 h-8" />,
              title: "Verified Content",
              features: [
                "Expert-reviewed information",
                "Regular content updates",
                "Premium Wikipedia alternative"
              ]
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Stay Current",
              features: [
                "Module update notifications",
                "Latest scientific developments",
                "Continuous learning options"
              ]
            },
            {
              icon: <BrainCircuit className="w-8 h-8" />,
              title: "Custom Learning",
              features: [
                "Request specific modules",
                "Premium subscriber priority",
                "Tailored learning paths"
              ]
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-blue-500 mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <ul className="space-y-2">
                {feature.features.map((item, index) => (
                  <li key={index} className="text-gray-400 flex items-start">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;