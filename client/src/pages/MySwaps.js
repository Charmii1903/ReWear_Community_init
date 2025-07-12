
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageSquare, Clock, CheckCircle, XCircle, User, ArrowRight, Filter, Star } from 'lucide-react';

const MySwaps = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchSwaps();
  }, [statusFilter, currentPage]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`/api/swaps/my-swaps?${params}`);
      setSwaps(response.data.swaps);
      setHasNext(response.data.pagination.hasNext);
      setHasPrev(response.data.pagination.hasPrev);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      toast.error('Failed to load swaps');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapAction = async (swapId, action) => {
    try {
      await axios.put(`/api/swaps/${swapId}/${action}`);
      toast.success(`Swap ${action}ed successfully`);
      fetchSwaps(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} swap`);
    }
  };

  const handleFeedback = async (swapId) => {
    try {
      await axios.post(`/api/swaps/${swapId}/feedback`, feedbackForm);
      toast.success('Feedback submitted successfully');
      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 5, comment: '' });
      fetchSwaps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const isRequester = (swap) => swap.requester._id === user._id;
  const canCancel = (swap) => isRequester(swap) && swap.status === 'pending';
  const canAccept = (swap) => !isRequester(swap) && swap.status === 'pending';
  const canReject = (swap) => !isRequester(swap) && swap.status === 'pending';
  const canComplete = (swap) => swap.status === 'accepted';
  const canProvideFeedback = (swap) => swap.status === 'completed' && !swap.feedback?.requesterRating && !swap.feedback?.recipientRating;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
        <p className="text-gray-600">
          Manage your skill swap requests and track their status
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field max-w-xs"
            >
              <option value="">All Swaps</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {swaps.length} swap{swaps.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Swaps List */}
      {swaps.length > 0 ? (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div key={swap._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Swap Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(swap.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                          {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isRequester(swap) ? 'You requested' : 'You received'}
                    </div>
                  </div>

                  {/* Swap Details */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">You {isRequester(swap) ? 'want to learn' : 'can teach'}</h4>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {isRequester(swap) ? swap.requestedSkill.name : swap.offeredSkill.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">You {isRequester(swap) ? 'can teach' : 'want to learn'}</h4>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {isRequester(swap) ? swap.offeredSkill.name : swap.requestedSkill.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Other User */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {isRequester(swap) ? swap.recipient.name : swap.requester.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isRequester(swap) ? 'You requested from them' : 'They requested from you'}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  {swap.message && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Message:</strong> {swap.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {canCancel(swap) && (
                      <button
                        onClick={() => handleSwapAction(swap._id, 'cancel')}
                        className="btn-danger text-sm"
                      >
                        Cancel Request
                      </button>
                    )}
                    {canAccept(swap) && (
                      <button
                        onClick={() => handleSwapAction(swap._id, 'accept')}
                        className="btn-primary text-sm"
                      >
                        Accept
                      </button>
                    )}
                    {canReject(swap) && (
                      <button
                        onClick={() => handleSwapAction(swap._id, 'reject')}
                        className="btn-danger text-sm"
                      >
                        Reject
                      </button>
                    )}
                    {canComplete(swap) && (
                      <button
                        onClick={() => handleSwapAction(swap._id, 'complete')}
                        className="btn-primary text-sm"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {canProvideFeedback(swap) && (
                      <button
                        onClick={() => {
                          setSelectedSwap(swap);
                          setShowFeedbackModal(true);
                        }}
                        className="btn-secondary text-sm"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Provide Feedback
                      </button>
                    )}
                  </div>

                  {/* Feedback Display */}
                  {swap.feedback && (swap.feedback.requesterRating || swap.feedback.recipientRating) && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Feedback</h5>
                      {swap.feedback.requesterRating && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-600">Requester:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < swap.feedback.requesterRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {swap.feedback.recipientRating && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-600">Recipient:</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < swap.feedback.recipientRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!hasPrev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!hasNext}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps found</h3>
          <p className="text-gray-500 mb-4">
            {statusFilter ? `No ${statusFilter} swaps found.` : 'You haven\'t made any swap requests yet.'}
          </p>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="btn-primary"
            >
              View All Swaps
            </button>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Provide Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Rate your experience with {isRequester(selectedSwap) ? selectedSwap.recipient.name : selectedSwap.requester.name}
              </p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                    className="text-2xl"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= feedbackForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment (optional)
              </label>
              <textarea
                value={feedbackForm.comment}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleFeedback(selectedSwap._id)}
                className="btn-primary flex-1"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySwaps; 
