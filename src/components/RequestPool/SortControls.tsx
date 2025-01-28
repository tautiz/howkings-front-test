import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortField, SortDirection } from './index';
import { useLanguage } from '../../contexts/LanguageContext';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const { translations } = useLanguage();

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 text-blue-500" /> : 
      <ArrowDown className="w-4 h-4 text-blue-500" />;
  };

  const sortButtons = [
    { field: 'votes' as SortField, label: translations.requestPool.sort.votes },
    // { field: 'date' as SortField, label: translations.requestPool.sort.date },
    { field: 'name' as SortField, label: translations.requestPool.sort.name },
  ];

  return (
    <div className="flex gap-4 items-center mb-4">
      <span className="text-sm text-gray-400">{translations.requestPool.sort.label}</span>
      <div className="flex gap-2">
        {sortButtons.map(({ field, label }) => (
          <button
            key={field}
            onClick={() => onSortChange(field)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
              sortField === field
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
            {getSortIcon(field)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;
