import React from 'react';
import { ArrowUp, Clock, CheckCircle, HourglassIcon, XCircle } from 'lucide-react';
import { ModuleRequest } from './types';
import RequestTag from './RequestTag';

interface RequestListProps {
  requests: ModuleRequest[];
  onVote: (index: number) => void;
  votedRequests: Set<number>;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onVote, votedRequests }) => {
  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { label: 'Pending', color: 'text-yellow-500', icon: <Clock className="w-5 h-5" /> };
      case 2:
        return { label: 'Review', color: 'text-blue-500', icon: <HourglassIcon className="w-5 h-5" /> };
      case 3:
        return { label: 'Approved', color: 'text-green-500', icon: <CheckCircle className="w-5 h-5" /> };
      default:
        return { label: 'Rejected', color: 'text-red-500', icon: <XCircle className="w-5 h-5" /> };
    }
  };

  return (
    <>
      {requests.map((request, index) => {
        const status = getStatusInfo(request.status_id);
        const mainTag = request.tags.find(tag => tag.type === 'module_request');
        const subTags = request.tags.filter(tag => tag.type === 'tag');

        return (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors h-full"
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onVote(index)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  votedRequests.has(index) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {Math.floor(Math.random() * 200) + 50}
                </span>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{request.module_name}</h3>
                  <span className={`flex items-center gap-1 text-sm ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div 
                  className="text-gray-400 mb-4"
                  dangerouslySetInnerHTML={{ __html: request.description }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  {mainTag && <RequestTag tag={mainTag} />}
                  {subTags.map(tag => (
                    <RequestTag key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RequestList;