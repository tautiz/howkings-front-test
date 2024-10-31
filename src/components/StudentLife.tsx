import React, { useState } from 'react';
import { Coffee, Users, Laptop, Dumbbell, Calendar, Star, Music, Book } from 'lucide-react';

const StudentLife = () => {
  const [activeTab, setActiveTab] = useState('campus');

  const tabs = [
    { id: 'campus', label: 'Campus Life' },
    { id: 'activities', label: 'Activities' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'events', label: 'Events' }
  ];

  const content = {
    campus: [
      {
        icon: <Coffee className="w-6 h-6" />,
        title: "Social Spaces",
        description: "Modern lounges and cafes with holographic displays and VR zones.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Student Clubs",
        description: "200+ organizations focused on technology, arts, and exploration.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
      }
    ],
    activities: [
      {
        icon: <Star className="w-6 h-6" />,
        title: "Leadership Programs",
        description: "Develop leadership skills through hands-on projects.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
      },
      {
        icon: <Music className="w-6 h-6" />,
        title: "Arts & Culture",
        description: "Express creativity through digital arts and performances.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070"
      }
    ],
    facilities: [
      {
        icon: <Laptop className="w-6 h-6" />,
        title: "Innovation Labs",
        description: "24/7 access to state-of-the-art laboratories.",
        image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070"
      },
      {
        icon: <Dumbbell className="w-6 h-6" />,
        title: "Recreation",
        description: "Zero-gravity sports and VR fitness centers.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"
      }
    ],
    events: [
      {
        icon: <Calendar className="w-6 h-6" />,
        title: "Tech Symposiums",
        description: "Regular tech talks and innovation showcases.",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2070"
      },
      {
        icon: <Book className="w-6 h-6" />,
        title: "Workshops",
        description: "Skill-building sessions and professional development.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070"
      }
    ]
  };

  return (
    <section className="bg-gray-900 py-24" id="student-life">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Experience Student Life
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Life at Howkings goes beyond the classroom, offering a unique blend of innovation, community, and adventure.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content[activeTab].map((item) => (
            <div
              key={item.title}
              className="group relative h-[400px] rounded-xl overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-500">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-gray-200">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Virtual Tour', 'Event Calendar', 'Club Directory', 'Student Portal'].map((link) => (
            <button
              key={link}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 
                transition-colors duration-300 text-sm"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentLife;