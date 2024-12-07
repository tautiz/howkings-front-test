import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ Icon, title, description }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-start space-x-4">
        <Icon className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;