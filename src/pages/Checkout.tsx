import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in to continue</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to complete your purchase</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    clearCart();
    navigate('/', { state: { paymentSuccess: true } });
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.project.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.project.thumbnail}
                    alt={item.project.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.project.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.project.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600">₹{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="razorpay"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="razorpay" className="flex items-center space-x-3 cursor-pointer">
                  <div className="bg-blue-100 p-2 rounded">
                    <CreditCard className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</p>
                  </div>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="stripe"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="stripe" className="flex items-center space-x-3 cursor-pointer">
                  <div className="bg-purple-100 p-2 rounded">
                    <CreditCard className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-gray-600">International Cards</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2 text-green-700">
                <Shield size={16} />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Pay ₹{getTotalPrice().toLocaleString()}</span>
                </>
              )}
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>By completing your purchase, you agree to our Terms of Service</p>
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
                Total Amount: <strong>₹{getTotalPrice().toLocaleString()}</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Payment Method: <strong className="capitalize">{paymentMethod}</strong>
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Simulate Successful Payment</span>
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

export default Checkout;