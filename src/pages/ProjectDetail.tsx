import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShoppingCart, Download, Calendar, Eye, Check, X, Star, Code, ExternalLink, Play } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProject } = useProjects();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const project = getProject(id || '');

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const handleAddToCart = () => {
    addToCart(project);
    alert('Project added to cart!');
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      alert('Please log in to purchase projects');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('ZipMyProject_token');
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="mb-4">
                <img 
                  src={project.screenshots[selectedImage] || project.thumbnail} 
                  alt={project.title}
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {project.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${
                      selectedImage === index ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{project.title}</h1>
                {project.isPopular && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </span>
                )}
              </div>
              
              {/* Meta Information */}
              <div className="flex items-center flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="font-medium">{project.rating}</span>
                  <span className="text-gray-500">({project.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar size={16} />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">₹{project.price.toLocaleString()}</span>
                <span className="text-gray-500 ml-2">one-time purchase</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Demo Link */}
              {project.demoUrl && (
                <div className="mb-6">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink size={16} />
                    <span>View Live Demo</span>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 text-center">
                  <div className="flex flex-col items-center">
                    <Check size={16} className="text-green-500 mb-1" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Code size={16} className="text-green-500 mb-1" />
                    <span>Complete source</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Download size={16} className="text-green-500 mb-1" />
                    <span>Documentation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Learn Section */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills</h3>
                <ul className="space-y-2 text-gray-700">
                  {project.techStack.map((tech, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{tech} implementation and best practices</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Concepts</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Project architecture and design patterns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Database design and optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Security implementation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Testing and deployment strategies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Related projects will be displayed here</p>
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
              <p className="text-2xl font-bold text-blue-600 mb-6">₹{project.price.toLocaleString()}</p>
              
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