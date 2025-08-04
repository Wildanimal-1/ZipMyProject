import React, { useState } from 'react';
import { Star, Check, X, Eye, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';

interface ReviewData {
  id: string;
  userId: string;
  projectId: string;
  userName: string;
  userEmail: string;
  projectTitle: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  createdAt: string;
}

const AdminReviews: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  const [reviews, setReviews] = useState<ReviewData[]>([
    {
      id: '1',
      userId: '1',
      projectId: '1',
      userName: 'Arjun Patel',
      userEmail: 'arjun@example.com',
      projectTitle: 'E-Commerce Website',
      rating: 5,
      comment: 'Excellent project! The code quality is outstanding and the documentation is very clear. This helped me understand full-stack development completely.',
      status: 'approved',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      userId: '2',
      projectId: '3',
      userName: 'Priya Sharma',
      userEmail: 'priya@example.com',
      projectTitle: 'React Native Food App',
      rating: 5,
      comment: 'Amazing mobile app project! Clean code, modern design, and everything works perfectly. Saved me weeks of development time.',
      status: 'featured',
      createdAt: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      userId: '3',
      projectId: '2',
      userName: 'Rahul Kumar',
      userEmail: 'rahul@example.com',
      projectTitle: 'ML Stock Predictor',
      rating: 4,
      comment: 'Great machine learning project with good documentation. The LSTM implementation is solid and the results are impressive.',
      status: 'pending',
      createdAt: '2024-01-13T09:45:00Z'
    },
    {
      id: '4',
      userId: '4',
      projectId: '1',
      userName: 'Sneha Reddy',
      userEmail: 'sneha@example.com',
      projectTitle: 'E-Commerce Website',
      rating: 2,
      comment: 'The project is okay but the documentation could be better. Some features are not working as expected.',
      status: 'pending',
      createdAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '5',
      userId: '5',
      projectId: '4',
      userName: 'Vikram Singh',
      userEmail: 'vikram@example.com',
      projectTitle: 'Hospital Management System',
      rating: 1,
      comment: 'Poor quality code and incomplete features. Not worth the money.',
      status: 'rejected',
      createdAt: '2024-01-11T11:15:00Z'
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    return statusFilter === 'all' || review.status === statusFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'featured': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStatusChange = (reviewId: string, newStatus: 'approved' | 'rejected' | 'featured') => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ));
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    featured: reviews.filter(r => r.status === 'featured').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and testimonials</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="featured">Featured</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                      <p className="text-sm text-gray-600">{review.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{review.projectTitle}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`font-semibold ${getRatingColor(review.rating)}`}>
                      {review.rating}/5
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center space-x-2">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'featured')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <TrendingUp size={14} />
                          <span>Feature</span>
                        </button>
                      </>
                    )}
                    
                    {review.status === 'approved' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, 'featured')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <TrendingUp size={14} />
                          <span>Feature</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {review.status === 'featured' && (
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove Feature
                      </button>
                    )}

                    {review.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReview(review)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Details Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedReview.userName}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedReview.userEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Review Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Project:</span>
                        <span className="ml-2 font-medium">{selectedReview.projectTitle}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="ml-2 font-medium">{formatDate(selectedReview.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="ml-2 flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < selectedReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className={`ml-2 font-semibold ${getRatingColor(selectedReview.rating)}`}>
                            {selectedReview.rating}/5
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(selectedReview.status)}`}>
                          {selectedReview.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Review Comment</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    {selectedReview.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusChange(selectedReview.id, 'approved');
                            setSelectedReview(null);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange(selectedReview.id, 'featured');
                            setSelectedReview(null);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <TrendingUp size={16} />
                          <span>Feature</span>
                        </button>
                        <button
                          onClick={() => {
                            handleStatusChange(selectedReview.id, 'rejected');
                            setSelectedReview(null);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;