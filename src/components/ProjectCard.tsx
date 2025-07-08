import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Calendar } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
          ₹{project.price}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.shortDescription}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/projects/${project.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </Link>
          
          <Link 
            to={`/projects/${project.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={16} />
            <span>Buy Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;