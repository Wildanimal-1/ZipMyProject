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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
    const token = localStorage.getItem('projectnest_token');
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