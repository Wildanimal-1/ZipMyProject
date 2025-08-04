import React, { useState } from 'react';
import { Search, Download, RefreshCw, FileText, Eye } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { OrderDetails } from '../../types';

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  const [orders] = useState<OrderDetails[]>([
    {
      id: 'ORD-001',
      userId: '1',
      projectId: '1',
      amount: 2999,
      status: 'completed',
      paymentId: 'pay_123456789',
      paymentMethod: 'razorpay',
      userInfo: { name: 'Arjun Patel', email: 'arjun@example.com' },
      projectInfo: { 
        title: 'E-Commerce Website', 
        thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400' 
      },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ORD-002',
      userId: '2',
      projectId: '3',
      amount: 4999,
      status: 'completed',
      paymentId: 'pay_987654321',
      paymentMethod: 'stripe',
      userInfo: { name: 'Priya Sharma', email: 'priya@example.com' },
      projectInfo: { 
        title: 'React Native Food App', 
        thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' 
      },
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 'ORD-003',
      userId: '3',
      projectId: '2',
      amount: 3499,
      status: 'pending',
      paymentId: 'pay_pending123',
      paymentMethod: 'razorpay',
      userInfo: { name: 'Rahul Kumar', email: 'rahul@example.com' },
      projectInfo: { 
        title: 'ML Stock Predictor', 
        thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400' 
      },
      createdAt: '2024-01-14T16:45:00Z'
    },
    {
      id: 'ORD-004',
      userId: '1',
      projectId: '4',
      amount: 3999,
      status: 'failed',
      paymentId: 'pay_failed456',
      paymentMethod: 'stripe',
      userInfo: { name: 'Arjun Patel', email: 'arjun@example.com' },
      projectInfo: { 
        title: 'Hospital Management System', 
        thumbnail: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400' 
      },
      createdAt: '2024-01-14T14:20:00Z'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.projectInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
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

  const handleRefund = (orderId: string) => {
    console.log(`Processing refund for order ${orderId}`);
    // In a real app, this would make an API call
  };

  const handleResendDownload = (orderId: string) => {
    console.log(`Resending download link for order ${orderId}`);
    // In a real app, this would make an API call
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Project', 'Amount', 'Status', 'Payment Method', 'Date'],
      ...filteredOrders.map(order => [
        order.id,
        order.userInfo.name,
        order.userInfo.email,
        order.projectInfo.title,
        order.amount,
        order.status,
        order.paymentMethod,
        formatDate(order.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalRevenue = filteredOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FileText size={20} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-gray-900">{filteredOrders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600">
              {filteredOrders.filter(o => o.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-600">Failed Orders</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by order ID, customer, or project..."
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
                <option value="all">All Orders</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        <div className="text-xs text-gray-400 capitalize">{order.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.userInfo.name}</div>
                        <div className="text-sm text-gray-500">{order.userInfo.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={order.projectInfo.thumbnail} 
                          alt={order.projectInfo.title}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">{order.projectInfo.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{order.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {order.status === 'completed' && (
                          <button 
                            onClick={() => handleResendDownload(order.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Resend Download"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        {(order.status === 'completed' || order.status === 'failed') && (
                          <button 
                            onClick={() => handleRefund(order.id)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Process Refund"
                          >
                            <RefreshCw size={16} />
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Order ID:</span>
                        <span className="ml-2 font-medium">{selectedOrder.id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Date:</span>
                        <span className="ml-2 font-medium">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Payment ID:</span>
                        <span className="ml-2 font-medium text-xs">{selectedOrder.paymentId}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="ml-2 font-medium capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{selectedOrder.userInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{selectedOrder.userInfo.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Project Information</h3>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedOrder.projectInfo.thumbnail} 
                      alt={selectedOrder.projectInfo.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.projectInfo.title}</p>
                      <p className="text-2xl font-bold text-blue-600">₹{selectedOrder.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  {selectedOrder.status === 'completed' && (
                    <button 
                      onClick={() => handleResendDownload(selectedOrder.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Resend Download</span>
                    </button>
                  )}
                  {(selectedOrder.status === 'completed' || selectedOrder.status === 'failed') && (
                    <button 
                      onClick={() => handleRefund(selectedOrder.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg flex items-center space-x-2"
                    >
                      <RefreshCw size={16} />
                      <span>Process Refund</span>
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

export default AdminOrders;