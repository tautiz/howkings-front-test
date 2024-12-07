import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ModuleRequest } from './types';
import RequestList from './RequestList';
import RequestForm from './RequestForm';
import Pagination from './Pagination';
import requestPoolData from './requestPoolData.json';

const ITEMS_PER_PAGE = 6;

const RequestPool = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [votedRequests, setVotedRequests] = useState<Set<number>>(new Set());

  const handleVote = (index: number) => {
    const newVotedRequests = new Set(votedRequests);
    if (votedRequests.has(index)) {
      newVotedRequests.delete(index);
    } else {
      newVotedRequests.add(index);
    }
    setVotedRequests(newVotedRequests);
  };

  const requests: ModuleRequest[] = requestPoolData;

  const filteredRequests = requests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    
    // Search in module name and description
    const matchesNameOrDesc = 
      request.module_name.toLowerCase().includes(searchLower) ||
      request.description.toLowerCase().includes(searchLower);

    // Search in tags (both module_request and regular tags)
    const matchesTags = request.tags.some(tag => 
      tag.name.toLowerCase().includes(searchLower) ||
      tag.description.toLowerCase().includes(searchLower)
    );

    // Search in category (module_request type tags)
    const matchesCategory = request.tags.some(tag => 
      tag.type === 'module_request' && (
        tag.name.toLowerCase().includes(searchLower) ||
        tag.description.toLowerCase().includes(searchLower)
      )
    );

    return matchesNameOrDesc || matchesTags || matchesCategory;
  });

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="bg-gray-900 py-24" id="request-pool">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Request Pool
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Shape the future of education at Howkings. Submit and vote on new learning modules.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, description, tags, or category..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedRequests.map((request, index) => (
            <RequestList
              key={index}
              requests={[request]}
              onVote={handleVote}
              votedRequests={votedRequests}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {isSubmitOpen && <RequestForm onClose={() => setIsSubmitOpen(false)} />}
      </div>
    </section>
  );
};

export default RequestPool;