import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import logoImage from '../../contexts/Assets/ZipMyProject.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoImage} 
              alt="ZipMyProject Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">ZipMyProject</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={`${isActive('/projects') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Projects
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`${isActive('/contact') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className="inline mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors px-4 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/projects" 
                className={`${isActive('/projects') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors px-4 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/about" 
                className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors px-4 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`${isActive('/contact') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors px-4 py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <div className="px-4 py-2 border-t">
                  <p className="text-sm text-gray-600 mb-2">Welcome, {user?.name}</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 border-t space-y-2">
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
