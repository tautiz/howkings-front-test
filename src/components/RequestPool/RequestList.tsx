import React from 'react';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { ModuleRequest } from './types';

interface RequestListProps {
  requests: ModuleRequest[];
  votedRequests: Set<number>;
  votingInProgress: Set<number>;
  onVote: (requestId: number) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  votedRequests,
  votingInProgress,
  onVote,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">
              {request.module_name}
            </h3>
            <button
              onClick={() => onVote(request.id)}
              disabled={votingInProgress.has(request.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                votedRequests.has(request.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label={`Balsuoti už ${request.module_name}`}
            >
              {votingInProgress.has(request.id) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ThumbsUp className={`w-5 h-5 ${
                  votedRequests.has(request.id) ? 'fill-current' : ''
                }`} />
              )}
              <span>{request.votes_count}</span>
            </button>
          </div>

          <p className="text-gray-300 mb-4">{request.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {request.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-sm bg-gray-700 text-gray-300 rounded-md"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Kalba: {request.language}</span>
            <span>
              {new Date(request.created_at).toLocaleDateString('lt-LT')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestList;