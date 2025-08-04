import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Users, Package, TrendingUp, Eye, ShoppingCart, Star } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { Analytics, OrderDetails } from '../../types';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 156,
    totalProjects: 24,
    totalOrders: 89,
    totalRevenue: 267500,
    monthlyRevenue: 45000,
    bestSellingProjects: [
      { id: '1', title: 'E-Commerce Website', sales: 23, revenue: 68977 },
      { id: '2', title: 'React Native Food App', sales: 18, revenue: 89982 },
      { id: '3', title: 'ML Stock Predictor', sales: 15, revenue: 52485 },
    ],
    recentOrders: [
      {
        id: '1',
        userId: '1',
        projectId: '1',
        amount: 2999,
        status: 'completed',
        paymentId: 'pay_123',
        paymentMethod: 'razorpay',
        userInfo: { name: 'Arjun Patel', email: 'arjun@example.com' },
        projectInfo: { title: 'E-Commerce Website', thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400' },
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        userId: '2',
        projectId: '3',
        amount: 4999,
        status: 'completed',
        paymentId: 'pay_124',
        paymentMethod: 'stripe',
        userInfo: { name: 'Priya Sharma', email: 'priya@example.com' },
        projectInfo: { title: 'React Native Food App', thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
        createdAt: '2024-01-15T09:15:00Z'
      }
    ]
  });

  const stats = [
    { 
      name: 'Total Revenue', 
      value: `₹${analytics.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    { 
      name: 'Total Users', 
      value: analytics.totalUsers.toString(), 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    { 
      name: 'Total Projects', 
      value: analytics.totalProjects.toString(), 
      icon: Package, 
      color: 'bg-purple-500',
      change: '+3 this month',
      changeType: 'neutral'
    },
    { 
      name: 'Total Orders', 
      value: analytics.totalOrders.toString(), 
      icon: ShoppingCart, 
      color: 'bg-orange-500',
      change: '+15.3%',
      changeType: 'positive'
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Best Selling Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Best Selling Projects</h2>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.bestSellingProjects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-sm text-gray-600">{project.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{project.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Eye className="text-blue-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={order.projectInfo.thumbnail} 
                      alt={order.projectInfo.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{order.userInfo.name}</p>
                      <p className="text-sm text-gray-600">{order.projectInfo.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <Package className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-sm font-medium text-blue-900">Add New Project</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <Users className="mx-auto mb-2 text-green-600" size={24} />
              <p className="text-sm font-medium text-green-900">Manage Users</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <Star className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="text-sm font-medium text-purple-900">Review Testimonials</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <BarChart3 className="mx-auto mb-2 text-orange-600" size={24} />
              <p className="text-sm font-medium text-orange-900">View Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;