import React from 'react';
import { History, Users, Award, Target } from 'lucide-react';
import Timeline from './Timeline';
import InfoCard from './InfoCard';

const About = () => {
  const infoCards = [
    {
      Icon: History,
      title: 'Our Vision',
      description: 'To revolutionize science education by making it accessible, engaging, and directly connected to career opportunities.'
    },
    {
      Icon: Users,
      title: 'Our Community',
      description: 'A growing community of learners, educators, and industry experts collaborating to shape the future of education.'
    },
    {
      Icon: Award,
      title: 'Our Approach',
      description: 'Combining expert knowledge, cutting-edge technology, and market demands to create relevant, engaging learning experiences.'
    },
    {
      Icon: Target,
      title: 'Our Mission',
      description: 'To empower individuals with the knowledge and skills needed to succeed in the rapidly evolving scientific landscape.'
    }
  ];

  return (
    <section 
      className="bg-black py-24" 
      id="about"
      role="region"
      aria-label="About Howkings University">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            About Howkings University
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A revolutionary learning platform transforming how people explore and grow in science.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
            alt="Future of Education" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-2xl font-bold text-white mb-2">Shaping the Future</h3>
            <p className="text-gray-200">Pioneering the next generation of scientific education and discovery</p>
          </div>
        </div>
        
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {infoCards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>

        {/* Timeline Section */}
        <Timeline />
      </div>
    </section>
  );
};

export default About;