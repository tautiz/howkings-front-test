import React from 'react';

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  color: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, description, color }) => {
  return (
    <div className="relative pl-12">
      {/* Dot indicator */}
      <div 
        className={`absolute left-3 w-3 h-3 rounded-full bg-${color}-500 
          transform -translate-x-1/2 top-2
          ring-4 ring-gray-900`}
      />
      
      {/* Content */}
      <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;