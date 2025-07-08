import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('projectnest_token');
    
    if (token) {
      // Verify token with backend
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isAdmin: data.user.isAdmin,
          });
        } else {
          localStorage.removeItem('projectnest_token');
        }
      })
      .catch(() => {
        localStorage.removeItem('projectnest_token');
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('projectnest_token', data.token);
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isAdmin: data.user.isAdmin,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('projectnest_token', data.token);
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isAdmin: data.user.isAdmin,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Admin login uses the same endpoint as regular login
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('projectnest_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};