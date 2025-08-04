import React, { useState } from 'react';
import { Search, UserX, UserCheck, Eye, Download, Mail } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';

interface UserData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalPurchases: number;
  totalSpent: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'banned';
  purchases: Array<{
    id: string;
    projectTitle: string;
    amount: number;
    date: string;
  }>;
}

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [users] = useState<UserData[]>([
    {
      id: '1',
      name: 'Arjun Patel',
      email: 'arjun@example.com',
      joinDate: '2024-01-10T10:00:00Z',
      totalPurchases: 3,
      totalSpent: 12497,
      lastActive: '2024-01-15T14:30:00Z',
      status: 'active',
      purchases: [
        { id: '1', projectTitle: 'E-Commerce Website', amount: 2999, date: '2024-01-15T10:30:00Z' },
        { id: '2', projectTitle: 'React Native Food App', amount: 4999, date: '2024-01-12T15:20:00Z' },
        { id: '3', projectTitle: 'ML Stock Predictor', amount: 3499, date: '2024-01-11T09:45:00Z' }
      ]
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      joinDate: '2024-01-08T15:30:00Z',
      totalPurchases: 2,
      totalSpent: 7498,
      lastActive: '2024-01-14T11:20:00Z',
      status: 'active',
      purchases: [
        { id: '4', projectTitle: 'Hospital Management System', amount: 3999, date: '2024-01-14T11:20:00Z' },
        { id: '5', projectTitle: 'Data Analytics Dashboard', amount: 2499, date: '2024-01-09T16:10:00Z' }
      ]
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      joinDate: '2024-01-05T12:15:00Z',
      totalPurchases: 1,
      totalSpent: 2999,
      lastActive: '2024-01-13T08:45:00Z',
      status: 'active',
      purchases: [
        { id: '6', projectTitle: 'E-Commerce Website', amount: 2999, date: '2024-01-13T08:45:00Z' }
      ]
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      joinDate: '2023-12-20T09:30:00Z',
      totalPurchases: 0,
      totalSpent: 0,
      lastActive: '2024-01-01T10:00:00Z',
      status: 'inactive',
      purchases: []
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    // In a real app, this would make an API call
    console.log(`Changing user ${userId} status to ${newStatus}`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage registered users and their activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.joinDate)}</div>
                      <div className="text-sm text-gray-500">Last active: {formatDate(user.lastActive)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalPurchases} projects</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{user.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </button>
                        {user.status === 'active' ? (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            className="text-red-600 hover:text-red-900"
                            title="Ban User"
                          >
                            <UserX size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="Activate User"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Join Date</p>
                      <p className="font-medium">{formatDate(selectedUser.joinDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Purchase History ({selectedUser.purchases.length} purchases)
                  </h3>
                  
                  {selectedUser.purchases.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.purchases.map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{purchase.projectTitle}</p>
                            <p className="text-sm text-gray-600">{formatDate(purchase.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{purchase.amount.toLocaleString()}</p>
                            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-900">Total Spent:</span>
                          <span className="text-xl font-bold text-blue-900">₹{selectedUser.totalSpent.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No purchases yet</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Send Email
                  </button>
                  {selectedUser.status === 'active' ? (
                    <button 
                      onClick={() => handleStatusChange(selectedUser.id, 'banned')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Ban User
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange(selectedUser.id, 'active')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Activate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;