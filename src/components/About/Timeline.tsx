import React from 'react';

const Timeline: React.FC = () => {
  const milestones = [
    {
      date: '2024 Q1',
      title: "Established Founder's Team",
      description: 'Karilė (CEO) and Tautvydas (CTO) kickstarted the journey of Howkings University',
      color: 'green',
      align: 'left'
    },
    {
      date: '2024 Q4',
      title: 'Launch Website',
      description: 'Soon we will launch initial Howkings website to introduce the idea of Howkings University, as well as to gather requests on what people want to learn and teach',
      color: 'green',
      align: 'right'
    },
    {
      date: '2024 Q4',
      title: 'Pre-Seed Round',
      description: 'We are seeking a $250K pre-seed investment to fully finish developing the MVP and create the first 50 modules',
      color: 'blue',
      align: 'left'
    },
    {
      date: '2025',
      title: 'Launch Howkings',
      description: 'After finishing developing MVP + testing first Modules, we are ready to release Howkings platform',
      color: 'purple',
      align: 'right'
    }
  ];

  return (
    <div className="relative max-w-4xl mx-auto pt-12">
      <h3 className="text-2xl font-bold text-white text-center mb-16">Our Journey</h3>

      {/* Center line */}
      <div className="absolute left-1/2 top-24 bottom-0 w-px bg-gray-800 transform -translate-x-1/2" />

      {/* Timeline content */}
      <div className="relative">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative mb-24 last:mb-0">
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className={`w-4 h-4 rounded-full bg-${milestone.color}-500 ring-4 ring-gray-900`} />
            </div>

            {/* Content container */}
            <div className={`flex ${milestone.align === 'left' ? 'justify-start' : 'justify-end'} items-center`}>
              <div className={`w-5/12 ${milestone.align === 'right' && 'ml-auto'}`}>
                {/* Date */}
                <div className={`text-${milestone.color}-500 font-semibold mb-2`}>
                  {milestone.date}
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-white mb-2">
                  {milestone.title}
                </h4>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {milestone.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;