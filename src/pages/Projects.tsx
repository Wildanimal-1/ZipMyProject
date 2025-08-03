import React, { useState } from 'react';
import { Search, Filter, Star, TrendingUp, Code, Smartphone, Brain, BarChart3 } from 'lucide-react';
import { useProjects } from '../contexts/ProjectContext';
import ProjectCard from '../components/ProjectCard';

const Projects: React.FC = () => {
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Filter },
    { id: 'web-dev', name: 'Web Development', icon: Code },
    { id: 'mobile-app', name: 'Mobile Apps', icon: Smartphone },
    { id: 'machine-learning', name: 'Machine Learning', icon: Brain },
    { id: 'data-science', name: 'Data Science', icon: BarChart3 }
  ];
  const filteredProjects = projects
    .filter(project => 
      (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === 'all' || project.category === categoryFilter) &&
      (difficultyFilter === 'all' || project.difficulty === difficultyFilter) &&
      project.price >= priceRange[0] && project.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Projects
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover {projects.length} high-quality projects designed to help you succeed in your academic journey.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    categoryFilter === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, description, or tech stack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {filteredProjects.some(p => p.isPopular) && (
            <div className="flex items-center space-x-1 text-orange-600">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Popular projects available</span>
            </div>
          )}
        </div>

        {/* Filters Applied */}
        {(categoryFilter !== 'all' || difficultyFilter !== 'all' || searchTerm) && (
          <div className="flex-1 relative">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>
              {categoryFilter !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {categories.find(c => c.id === categoryFilter)?.name}
                </span>
              )}
              {difficultyFilter !== 'all' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs capitalize">
                  {difficultyFilter}
                </span>
              )}
              {searchTerm && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  "{searchTerm}"
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                  setPriceRange([0, 10000]);
                }}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No projects found matching your criteria.</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;