import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // Fallback to sample data if database is not set up
        setProjects(getSampleProjects());
      } else {
        // Transform database data to match our Project interface
        const transformedProjects = data.map(project => ({
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          shortDescription: project.short_description,
          price: parseFloat(project.price),
          category: 'web-dev' as const, // Default category
          techStack: project.tech_stack || [],
          difficulty: 'intermediate' as const, // Default difficulty
          features: project.features || [],
          demoUrl: project.demo_url,
          thumbnail: project.thumbnail_url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
          screenshots: project.screenshots || [],
          downloadLink: project.download_link || '#',
          isPopular: project.is_popular || false,
          rating: 4.5, // Default rating
          reviewCount: 0, // Default review count
          createdAt: project.created_at,
          updatedAt: project.updated_at
        }));
        setProjects(transformedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(getSampleProjects());
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            short_description: projectData.shortDescription,
            price: projectData.price,
            thumbnail_url: projectData.thumbnail,
            screenshots: projectData.screenshots,
            download_link: projectData.downloadLink,
            demo_url: projectData.demoUrl,
            tech_stack: projectData.techStack,
            features: projectData.features,
            is_popular: projectData.isPopular,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding project:', error);
        return;
      }

      // Add to local state
      const newProject: Project = {
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        shortDescription: data.short_description,
        price: parseFloat(data.price),
        category: 'web-dev',
        techStack: data.tech_stack || [],
        difficulty: 'intermediate',
        features: data.features || [],
        demoUrl: data.demo_url,
        thumbnail: data.thumbnail_url,
        screenshots: data.screenshots || [],
        downloadLink: data.download_link,
        isPopular: data.is_popular,
        rating: 4.5,
        reviewCount: 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setProjects(prev => [newProject, ...prev]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          short_description: projectData.shortDescription,
          price: projectData.price,
          thumbnail_url: projectData.thumbnail,
          screenshots: projectData.screenshots,
          download_link: projectData.downloadLink,
          demo_url: projectData.demoUrl,
          tech_stack: projectData.techStack,
          features: projectData.features,
          is_popular: projectData.isPopular
        })
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return;
      }

      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_active: false })
        .eq('id', parseInt(id));

      if (error) {
        console.error('Error deleting project:', error);
        return;
      }

      // Remove from local state
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      loading,
      addProject, 
      updateProject, 
      deleteProject, 
      getProject 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Sample data fallback
const getSampleProjects = (): Project[] => [
  {
    id: '1',
    title: 'E-Commerce Website with React & Node.js',
    description: 'A complete full-stack e-commerce solution built with React.js frontend and Node.js backend. Features include user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard. Perfect for learning modern web development practices.',
    shortDescription: 'Full-stack e-commerce website with React, Node.js, and Stripe integration',
    price: 2999,
    category: 'web-dev',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    difficulty: 'intermediate',
    features: [
      'User Authentication & Authorization',
      'Product Catalog with Search & Filters',
      'Shopping Cart & Wishlist',
      'Stripe Payment Integration',
      'Order Management System',
      'Admin Dashboard',
      'Responsive Design',
      'Email Notifications'
    ],
    demoUrl: 'https://demo-ecommerce.example.com',
    thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    screenshots: [
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    downloadLink: '#',
    isPopular: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Machine Learning Stock Price Predictor',
    description: 'Advanced machine learning project that predicts stock prices using LSTM neural networks. Includes data preprocessing, feature engineering, model training, and a web interface for predictions. Great for understanding time series forecasting and deep learning concepts.',
    shortDescription: 'ML project for stock price prediction using LSTM and Python',
    price: 3499,
    category: 'machine-learning',
    techStack: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Flask'],
    difficulty: 'advanced',
    features: [
      'LSTM Neural Network Implementation',
      'Real-time Stock Data Integration',
      'Data Preprocessing Pipeline',
      'Interactive Web Dashboard',
      'Model Performance Metrics',
      'Prediction Visualization',
      'Historical Data Analysis'
    ],
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
    screenshots: [
      'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    downloadLink: '#',
    isPopular: false,
    rating: 4.6,
    reviewCount: 18,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    title: 'React Native Food Delivery App',
    description: 'Complete mobile application for food delivery built with React Native. Features include user registration, restaurant browsing, menu selection, cart management, real-time order tracking, and payment integration. Includes both customer and restaurant owner interfaces.',
    shortDescription: 'Cross-platform food delivery app with React Native',
    price: 4999,
    category: 'mobile-app',
    techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB', 'Stripe'],
    difficulty: 'advanced',
    features: [
      'Cross-platform Mobile App',
      'User & Restaurant Registration',
      'Real-time Order Tracking',
      'Payment Gateway Integration',
      'Push Notifications',
      'GPS Location Services',
      'Rating & Review System',
      'Admin Panel for Management'
    ],
    thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    screenshots: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    downloadLink: '#',
    isPopular: true,
    rating: 4.9,
    reviewCount: 31,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
];