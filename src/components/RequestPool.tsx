import React, { useState } from 'react';
import { Search, ArrowUp, Clock, TrendingUp, Filter, Plus, CheckCircle, HourglassIcon, XCircle } from 'lucide-react';

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  hasVoted?: boolean;
}

const RequestPool = () => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'votes' | 'recent' | 'status'>('votes');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      title: 'Quantum Teleportation Advanced Course',
      description: 'A comprehensive course covering the principles and applications of quantum teleportation in space travel.',
      category: 'Quantum Physics',
      votes: 156,
      status: 'review',
      submittedBy: 'Elena Chen',
      submittedAt: '2024-03-15',
      hasVoted: false
    },
    {
      id: '2',
      title: 'Neural Interface Programming',
      description: 'Hands-on program for developing brain-computer interfaces using quantum neural networks.',
      category: 'Neurotechnology',
      votes: 243,
      status: 'approved',
      submittedBy: 'Marcus Wong',
      submittedAt: '2024-03-14',
      hasVoted: true
    },
    // More example requests...
  ]);

  const handleVote = (requestId: string) => {
    setRequests(requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          votes: request.hasVoted ? request.votes - 1 : request.votes + 1,
          hasVoted: !request.hasVoted
        };
      }
      return request;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitOpen(false);
  };

  const getStatusColor = (status: Request['status']) => {
    const colors = {
      pending: 'text-yellow-500',
      review: 'text-blue-500',
      approved: 'text-green-500',
      rejected: 'text-red-500'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Request['status']) => {
    const icons = {
      pending: <Clock className="w-5 h-5" />,
      review: <HourglassIcon className="w-5 h-5" />,
      approved: <CheckCircle className="w-5 h-5" />,
      rejected: <XCircle className="w-5 h-5" />
    };
    return icons[status];
  };

  const filteredRequests = requests
    .filter(request => 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'recent') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      return 0;
    });

  return (
    <section className="bg-gray-900 py-24" id="request-pool">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Request Pool
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Shape the future of education at Howkings. Submit and vote on new learning modules and programs.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="votes">Most Voted</option>
              <option value="recent">Most Recent</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </div>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div
              key={request.id}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleVote(request.id)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    request.hasVoted ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                  <span className="text-sm font-medium">{request.votes}</span>
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{request.title}</h3>
                    <span className={`flex items-center gap-1 text-sm ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{request.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Submitted by {request.submittedBy}</span>
                    <span>•</span>
                    <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      {request.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Modal */}
        {isSubmitOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4">
              <h3 className="text-2xl font-bold text-white mb-6">Submit New Request</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter request title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option>Quantum Physics</option>
                    <option>Neurotechnology</option>
                    <option>Space Engineering</option>
                    <option>Artificial Intelligence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                    placeholder="Describe your request in detail..."
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RequestPool;