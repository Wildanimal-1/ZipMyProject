import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShoppingCart, Download, Calendar, Eye, Check, X } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const project = getProject(id || '');

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      alert('Please log in to purchase projects');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('projectnest_token');
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: project.id,
          paymentMethod: 'razorpay' // Default to Razorpay
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowPaymentModal(true);
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    alert('Payment successful! You can now download the project from your purchases.');
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="mb-4">
                <img 
                  src={project.screenshots[selectedImage] || project.thumbnail} 
                  alt={project.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {project.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar size={16} />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye size={16} />
                  <span>125 views</span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-blue-600">₹{project.price}</span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-4">
                <button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      <span>Buy Now - ₹{project.price}</span>
                    </>
                  )}
                </button>

                <div className="text-sm text-gray-500 text-center">
                  <p>✓ Instant download after payment</p>
                  <p>✓ Complete source code included</p>
                  <p>✓ Documentation and setup guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Complete Payment</h3>
              <button
                onClick={handlePaymentCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You are purchasing: <strong>{project.title}</strong>
              </p>
              <p className="text-2xl font-bold text-blue-600 mb-6">₹{project.price}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Pay with Razorpay
                </button>
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Pay with Stripe
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                This is a demo. In production, real payment processing would occur here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;