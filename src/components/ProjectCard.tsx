import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Calendar, Star, TrendingUp, Code, Smartphone, Brain, BarChart3 } from 'lucide-react';
import { Project } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { addToCart } = useCart();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-dev': return Code;
      case 'mobile-app': return Smartphone;
      case 'machine-learning': return Brain;
      case 'data-science': return BarChart3;
      default: return Code;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CategoryIcon = getCategoryIcon(project.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(project);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{project.price}
        </div>
        {project.isPopular && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <TrendingUp size={12} />
            <span>Popular</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <CategoryIcon size={16} />
            <span className="text-sm capitalize">{project.category.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{project.rating}</span>
            <span className="text-xs text-gray-500">({project.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {project.shortDescription}
        </p>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 gap-2">
          <Link 
            to={`/projects/${project.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
          >
            <Eye size={16} />
            <span>Details</span>
          </Link>
          
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;