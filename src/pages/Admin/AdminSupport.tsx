import React, { useState } from 'react';
import { Search, Mail, MessageSquare, Clock, CheckCircle, Reply } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  adminReply?: string;
  repliedAt?: string;
  repliedBy?: string;
}

const AdminSupport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: '1',
      name: 'Arjun Patel',
      email: 'arjun@example.com',
      subject: 'Issue with project download',
      message: 'Hi, I purchased the E-Commerce project yesterday but I\'m unable to download it. The download link seems to be broken. Can you please help me with this?',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      subject: 'Question about React Native project',
      message: 'I have a question about the React Native Food Delivery app. Does it include the backend API as well? I need to understand the complete architecture before purchasing.',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-14T15:20:00Z',
      adminReply: 'Hi Priya, yes the React Native project includes both the mobile app and the complete backend API with Node.js and MongoDB. You\'ll get the full source code for both parts.',
      repliedAt: '2024-01-14T16:45:00Z',
      repliedBy: 'Admin'
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      subject: 'Customization request',
      message: 'I want to customize the Hospital Management System for my college project. Can you provide additional support for customization? What would be the cost?',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-13T09:45:00Z',
      adminReply: 'Hi Rahul, we offer customization services at ₹500/hour. For the Hospital Management System, typical customizations take 2-4 hours. Please let me know what specific changes you need.',
      repliedAt: '2024-01-13T11:30:00Z',
      repliedBy: 'Admin'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      subject: 'Refund request',
      message: 'I purchased the ML Stock Predictor project but it\'s not working as expected. The accuracy is very low and the documentation is incomplete. I would like to request a refund.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      subject: 'Technical support needed',
      message: 'I\'m having trouble setting up the development environment for the E-Commerce project. Can you provide step-by-step installation guide?',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-11T11:15:00Z'
    }
  ]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (messageId: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    setMessages(prev => prev.map(message => 
      message.id === messageId ? { ...message, status: newStatus } : message
    ));
  };

  const handleReply = (messageId: string) => {
    if (!replyText.trim()) return;

    setMessages(prev => prev.map(message => 
      message.id === messageId ? {
        ...message,
        adminReply: replyText,
        repliedAt: new Date().toISOString(),
        repliedBy: 'Admin',
        status: 'in-progress'
      } : message
    ));

    setReplyText('');
    setSelectedMessage(null);
  };

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    inProgress: messages.filter(m => m.status === 'in-progress').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
    highPriority: messages.filter(m => m.priority === 'high').length
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-gray-600 mt-2">Manage customer support requests and inquiries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Messages</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
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
                <option value="all">All Messages</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(message.status)}`}>
                      {message.status.replace('-', ' ')}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(message.priority)}`}>
                      {message.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{message.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatDate(message.createdAt)}</span>
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                  <p className="text-gray-700 mb-4">{message.message}</p>

                  {message.adminReply && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Reply size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Admin Reply</span>
                        <span className="text-xs text-blue-700">
                          {message.repliedAt && formatDate(message.repliedAt)}
                        </span>
                      </div>
                      <p className="text-blue-800">{message.adminReply}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Reply size={14} />
                      <span>Reply</span>
                    </button>

                    {message.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(message.id, 'in-progress')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Clock size={14} />
                        <span>In Progress</span>
                      </button>
                    )}

                    {message.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(message.id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <CheckCircle size={14} />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Reply to Message</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare size={16} className="text-gray-600" />
                    <span className="font-medium text-gray-900">Original Message</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                  </div>
                  <p className="text-gray-700">{selectedMessage.message}</p>
                </div>

                {/* Reply Form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReply(selectedMessage.id)}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center space-x-2"
                  >
                    <Reply size={16} />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;