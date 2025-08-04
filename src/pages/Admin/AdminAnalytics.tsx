import React, { useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, Download, Eye, Calendar } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 267500,
      totalUsers: 156,
      totalProjects: 24,
      totalOrders: 89,
      conversionRate: 12.5,
      avgOrderValue: 3006
    },
    revenueData: [
      { month: 'Jan', revenue: 45000, orders: 15 },
      { month: 'Feb', revenue: 52000, orders: 18 },
      { month: 'Mar', revenue: 48000, orders: 16 },
      { month: 'Apr', revenue: 61000, orders: 21 },
      { month: 'May', revenue: 55000, orders: 19 },
      { month: 'Jun', revenue: 67500, orders: 23 }
    ],
    topProjects: [
      { id: '1', title: 'E-Commerce Website', sales: 23, revenue: 68977, views: 1250 },
      { id: '2', title: 'React Native Food App', sales: 18, revenue: 89982, views: 980 },
      { id: '3', title: 'ML Stock Predictor', sales: 15, revenue: 52485, views: 750 },
      { id: '4', title: 'Hospital Management', sales: 12, revenue: 47988, views: 650 },
      { id: '5', title: 'Data Analytics Dashboard', sales: 10, revenue: 24990, views: 520 }
    ],
    userGrowth: [
      { month: 'Jan', users: 25 },
      { month: 'Feb', users: 32 },
      { month: 'Mar', users: 28 },
      { month: 'Apr', users: 35 },
      { month: 'May', users: 42 },
      { month: 'Jun', users: 38 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 2450, percentage: 35 },
      { source: 'Google Search', visitors: 1890, percentage: 27 },
      { source: 'Social Media', visitors: 1260, percentage: 18 },
      { source: 'Referrals', visitors: 980, percentage: 14 },
      { source: 'Email', visitors: 420, percentage: 6 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your platform's performance and growth</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers}</p>
                <p className="text-sm text-green-600">+8.2% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalProjects}</p>
                <p className="text-sm text-blue-600">+3 this month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalOrders}</p>
                <p className="text-sm text-green-600">+15.3% from last month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Download className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.conversionRate}%</p>
                <p className="text-sm text-green-600">+2.1% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.avgOrderValue)}</p>
                <p className="text-sm text-green-600">+5.8% from last month</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.revenueData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{data.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(data.revenue)}</div>
                    <div className="text-xs text-gray-500">{data.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Projects</h2>
              <Package className="text-purple-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.topProjects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{project.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Download size={12} />
                          <span>{project.sales} sales</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{project.views} views</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{formatCurrency(project.revenue)}</p>
                    <p className="text-xs text-gray-500">{((project.sales / project.views) * 100).toFixed(1)}% conv.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Growth</h2>
              <Users className="text-blue-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.userGrowth.map((data) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{data.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">+{data.users} users</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Traffic Sources</h2>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            
            <div className="space-y-4">
              {analytics.trafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-purple-500' : 
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{source.visitors.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Calendar className="text-gray-500" size={20} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registration: Arjun Patel</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Project purchased: E-Commerce Website</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New project added: Blockchain Voting System</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Support ticket resolved: Download issue</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;