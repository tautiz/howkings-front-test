import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { ModuleRequest } from './types';
import { VoteError } from '../../services/api';
import RequestList from './RequestList';
import RequestForm from './RequestForm/index';
import Pagination from './Pagination';
import SortControls from './SortControls';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { showToast } from '../../utils/toast';
import { listRequests, addVote } from '../../services/api';

const ITEMS_PER_PAGE = 6;

// Rūšiavimo tipai
export type SortField = 'votes' | 'date' | 'name';
export type SortDirection = 'asc' | 'desc';

const RequestPool = () => {
  const { isAuthenticated, setAuthForm } = useAuth();
  const { translations } = useLanguage();
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [votedRequests] = useState<Set<number>>(new Set());
  const [requests, setRequests] = useState<ModuleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('votes');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [votingInProgress] = useState<Set<number>>(new Set());
  const [voteError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listRequests();
        setRequests(response || []);
      } catch (err) {
        setError(translations.requestPool.errors.fetchFailed);
        console.error('Error fetching requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [translations]);

  const handleVote = async (requestId: number) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      showToast(translations.requestPool.errors.loginRequired, 'info');
      setAuthForm('signin');
      return;
    }

    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return { ...request, votes: request.votes_count + 1, hasVoted: true };
      }
      return request;
    });
    setRequests(updatedRequests);

    try {
      const response = await addVote(requestId);
      
      if (response.status === 'error') {
        setRequests(requests);
        
        switch (response.error) {
          case VoteError.ALREADY_VOTED:
            showToast(translations.requestPool.errors.alreadyVoted, 'error');
            break;
          case VoteError.NOT_AUTHENTICATED:
            setShowLoginPrompt(true);
            setAuthForm('signin');
            showToast(translations.requestPool.errors.loginRequired, 'info');
            break;
          case VoteError.MODULE_NOT_FOUND:
            showToast(translations.requestPool.errors.moduleNotFound, 'error');
            break;
          default:
            showToast(translations.requestPool.errors.voteFailed, 'error');
        }
      } else {
        showToast(translations.requestPool.success.voteRegistered, 'success');
      }
    } catch (error) {
      setRequests(requests);
      console.error('Voting error:', error);
      showToast(translations.requestPool.errors.voteFailed, 'error');
    }
  };

  const sortRequests = (requests: ModuleRequest[]) => {
    return [...requests].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'votes':
          comparison = b.votes_count - a.votes_count;
          break;
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'name':
          comparison = a.module_name.localeCompare(b.module_name);
          break;
      }
      
      return sortDirection === 'asc' ? -comparison : comparison;
    });
  };

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredRequests = (requests || []).filter(request => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search in module name and description
    const matchesNameOrDesc = 
      request.module_name.toLowerCase().includes(searchLower) ||
      request.description.toLowerCase().includes(searchLower);

    // Search in tags
    const matchesTags = request.tags?.some(tag => 
      tag.name.toLowerCase().includes(searchLower)
    );

    return matchesNameOrDesc || matchesTags;
  });

  const sortedRequests = sortRequests(filteredRequests);
  const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <section 
        className="bg-gray-900 py-24" 
        id="request-pool" 
        role="region"
        aria-label="Request Pool">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">{translations.requestPool.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        className="bg-gray-900 py-24" 
        id="request-pool" 
        role="region"
        aria-label="Request Pool">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-gray-900 py-24" 
      id="request-pool" 
      role="region"
      aria-label="Request Pool">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showLoginPrompt && !isAuthenticated && (
          <div className="mb-4 p-4 bg-blue-900/50 border border-blue-500 rounded-lg text-blue-200 flex items-center justify-between">
            <span>{translations.requestPool.loginPrompt}</span>
            <button
              onClick={() => setAuthForm('signin')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translations.requestPool.loginButton}
            </button>
          </div>
        )}
        {voteError && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {voteError}
          </div>
        )}
        <div className="space-y-8">
          {/* Search and Add Request Controls */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={translations.requestPool.searchPlaceholder}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {translations.requestPool.addRequestButton}
            </button>
          </div>

          {/* Sort Controls */}
          <SortControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />

          {/* Request List */}
          <RequestList
            requests={paginatedRequests}
            votedRequests={votedRequests}
            onVote={handleVote}
            votingInProgress={votingInProgress}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Request Form Modal */}
        {isSubmitOpen && (
          <RequestForm onClose={() => setIsSubmitOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default RequestPool;