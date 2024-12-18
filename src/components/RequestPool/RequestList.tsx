import React from 'react';
import { ArrowUp } from 'lucide-react';
import { ModuleRequest } from './types';
import RequestTag from './RequestTag';
import { useVote } from '../../hooks/useVote';

interface RequestListProps {
  requests: ModuleRequest[];
  onVote: (index: number) => void;
  votedRequests: Set<number>;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onVote, votedRequests }) => {
  const { handleVote: handleVoteAction } = useVote();

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    window.dispatchEvent(new CustomEvent('app:show-toast', {
      detail: { message, type }
    }));
  };

  const handleVote = async (request: ModuleRequest, index: number) => {
    const success = await handleVoteAction(request.id);
    if (success) {
      showToast('Vote added successfully!', 'success');
      onVote(index);
    } else {
      // Let the API interceptor handle the error toast
    }
  };

  return (
    <>
      {requests.map((request, index) => {
        const mainTag = request.tags?.find(tag => tag.type === 'module_request');
        const subTags = request.tags?.filter(tag => tag.type === 'tag') || [];
        
        return (
          <div
            key={request.id}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors h-full"
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleVote(request, index)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  votedRequests.has(index) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {request.votes_count}
                </span>
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{request.module_name}</h3>
                </div>

                <div 
                  className="text-gray-400 mb-4"
                  dangerouslySetInnerHTML={{ __html: request.description }}
                />

                {(mainTag || subTags.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {mainTag && (
                      <RequestTag 
                        key={mainTag.id} 
                        tag={mainTag} 
                      />
                    )}
                    {subTags.map(tag => (
                      <RequestTag 
                        key={tag.id} 
                        tag={tag} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RequestList;