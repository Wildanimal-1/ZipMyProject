import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, BarChart3, DollarSign, Users, Package } from 'lucide-react';
import { useProjects } from '../../contexts/ProjectContext';
import { Project } from '../../types';

const AdminDashboard: React.FC = () => {
  const { projects, deleteProject } = useProjects();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setShowDeleteModal(null);
  };

  const stats = [
    { name: 'Total Projects', value: projects.length, icon: Package, color: 'bg-blue-500' },
    { name: 'Total Revenue', value: '₹45,000', icon: DollarSign, color: 'bg-green-500' },
    { name: 'Active Users', value: '124', icon: Users, color: 'bg-purple-500' },
    { name: 'This Month', value: '12', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Manage Projects</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{project.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(project.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Project</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteModal)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;