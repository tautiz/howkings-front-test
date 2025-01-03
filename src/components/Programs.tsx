import React, { useState } from 'react';
import { Atom, Brain, Globe, Database, Rocket, Cpu, Shield, Microscope } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Programs: React.FC = () => {
  const { translations } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('plans');

  const categories = [
    { id: 'plans', label: translations.programs.categories.plans },
    { id: 'features', label: translations.programs.categories.content }
  ];

  const plans = [
    {
      icon: <Atom className="w-8 h-8" />,
      title: 'Free',
      description: 'Full access to basic modules',
      price: '0 €',
      period: 'month',
      buttonText: 'Get Started for Free',
      features: [
        'Request new modules you want to learn or teach in our Request pool!',
        'Limited Access all modules!',
        'If you are a lecturer, scientist, or subject matter expert - publish your educational modules, research articles, or even your existing book!',
      ]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Premium',
      description: 'Complete access to growing module library',
      price: '29.99 €',
      period: 'month',
      buttonText: 'Save your spot<br/>Now for <strong style="font-size: 1.3em">5€</strong>',
      features: [
        'Complete access to growing module library',
        'Multi-format learning (text, video, audio)',
        'Interactive assignments & progress tracking',
        'Knowledge portfolio builder',
        'Module update notifications',
        'Community discussions',
        'Priority module requests',
        'Premium support'
      ]
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Enterprise',
      description: 'For organizations and teams',
      price: '35 €',
      period: 'user/month',
      buttonText: 'Save your spot<br/>Now for <strong style="font-size: 1.3em">5€</strong>',
      features: [
        'All Premium features included',
        'Employee learning management',
        'Recruitment tools with module-based assessments',
        'Custom learning paths',
        'Create private/public modules',
        'Priority development & support',
        'Advanced analytics & reporting',
        'Branded learning environment'
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Unique Content",
      description: "No duplicates across the platform"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Expert Created",
      description: "Created by scientists, lecturers, and subject matter experts"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Career Linked",
      description: "Directly linked to job positions"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Market Driven",
      description: "Created based on current market needs"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Always Updated",
      description: "Reflects latest research, comments, and corrections"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Universal Coverage",
      description: "Covers all fields of science"
    },
    {
      icon: <Microscope className="w-8 h-8" />,
      title: "AI Enhanced",
      description: "Created with AI assistance but expert verified"
    }
  ];

  return (
    <section id="programs" className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {activeCategory === 'plans' 
              ? translations.programs.plans.title 
              : translations.programs.content.title}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {activeCategory === 'plans'
              ? translations.programs.plans.subtitle
              : translations.programs.content.subtitle}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg bg-gray-800 p-1">
            <button
              onClick={() => setActiveCategory('plans')}
              className={`${
                activeCategory === 'plans'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              } px-4 py-2 rounded-md transition-colors`}
            >
              {translations.programs.categories.plans}
            </button>
            <button
              onClick={() => setActiveCategory('content')}
              className={`${
                activeCategory === 'content'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              } px-4 py-2 rounded-md transition-colors`}
            >
              {translations.programs.categories.content}
            </button>
          </div>
        </div>

        {activeCategory === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className="group bg-gray-800 rounded-xl p-8 transform transition-all duration-300
                  hover:scale-105 hover:bg-gray-700 flex flex-col h-full"
              >
                <div className="text-blue-500 mb-6 transform transition-transform duration-300
                  group-hover:scale-110 group-hover:text-blue-400">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{plan.title}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a 
                  href="https://www.indiegogo.com/projects/howkings-university/x/38202829#/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg
                    hover:bg-blue-600 transition-colors duration-300 mt-auto text-center"
                  dangerouslySetInnerHTML={{ __html: plan.buttonText }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-gray-800 rounded-xl p-8 transform transition-all duration-300
                  hover:scale-105 hover:bg-gray-700"
              >
                <div className="text-blue-500 mb-6 transform transition-transform duration-300
                  group-hover:scale-110 group-hover:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;