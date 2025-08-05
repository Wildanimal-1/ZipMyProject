import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

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
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile from our custom table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setAuthState({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              createdAt: profile.created_at
            },
            isAuthenticated: true,
            isAdmin: profile.is_admin || false,
          });
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setAuthState({
            user: {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              createdAt: profile.created_at
            },
            isAuthenticated: true,
            isAdmin: profile.is_admin || false,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      if (data.user) {
        // Create user profile in our custom table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              is_admin: email === 'admin@ZipMyProject.in' // Make admin@ZipMyProject.in an admin
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError.message);
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', email)
        .single();
      
      return profile?.is_admin || false;
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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