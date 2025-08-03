import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
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
  const [projects, setProjects] = useState<Project[]>([
    // Sample data with enhanced fields
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
    },
    {
      id: '4',
      title: 'Hospital Management System',
      description: 'Comprehensive hospital management system with patient records, appointment scheduling, doctor management, billing, and inventory tracking. Built with modern web technologies and includes role-based access control.',
      shortDescription: 'Complete hospital management system with patient and doctor portals',
      price: 3999,
      category: 'web-dev',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Express', 'JWT'],
      difficulty: 'intermediate',
      features: [
        'Patient Management System',
        'Appointment Scheduling',
        'Doctor Portal',
        'Billing & Invoice Generation',
        'Medical Records Management',
        'Inventory Tracking',
        'Role-based Access Control',
        'Report Generation'
      ],
      thumbnail: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
      screenshots: [
        'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      downloadLink: '#',
      isPopular: false,
      rating: 4.5,
      reviewCount: 12,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '5',
      title: 'Data Analytics Dashboard',
      description: 'Interactive data analytics dashboard built with Python and Streamlit. Features data visualization, statistical analysis, and machine learning model integration. Perfect for data science projects and business intelligence applications.',
      shortDescription: 'Interactive data analytics dashboard with Python and Streamlit',
      price: 2499,
      category: 'data-science',
      techStack: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'Scikit-learn'],
      difficulty: 'beginner',
      features: [
        'Interactive Data Visualization',
        'Statistical Analysis Tools',
        'CSV/Excel Data Import',
        'Real-time Chart Updates',
        'Export Functionality',
        'Multiple Chart Types',
        'Data Filtering Options',
        'Responsive Design'
      ],
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      screenshots: [
        'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      downloadLink: '#',
      isPopular: true,
      rating: 4.7,
      reviewCount: 19,
      createdAt: '2023-12-28T10:00:00Z',
      updatedAt: '2023-12-28T10:00:00Z'
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('ZipMyProject_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description,
        shortDescription: projectData.shortDescription,
        price: projectData.price,
        thumbnailUrl: projectData.thumbnail,
        screenshots: projectData.screenshots,
        downloadLink: projectData.downloadLink
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        setProjects(prev => [data, ...prev]);
      }
    })
    .catch(error => console.error('Error adding project:', error));
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description,
        shortDescription: projectData.shortDescription,
        price: projectData.price,
        thumbnailUrl: projectData.thumbnail,
        screenshots: projectData.screenshots,
        downloadLink: projectData.downloadLink
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        setProjects(prev => prev.map(project => 
          project.id === id ? data : project
        ));
      }
    })
    .catch(error => console.error('Error updating project:', error));
  };

  const deleteProject = (id: string) => {
    fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    .then(res => {
      if (res.ok) {
        setProjects(prev => prev.filter(project => project.id !== id));
      }
    })
    .catch(error => console.error('Error deleting project:', error));
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