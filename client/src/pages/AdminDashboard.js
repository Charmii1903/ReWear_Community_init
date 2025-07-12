import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, Shield, MessageSquare, BarChart3, Download, 
  AlertTriangle, CheckCircle, XCircle, Ban, Eye, 
  Send, Filter, Search, TrendingUp, Activity,
  UserCheck, UserX, FileText, Settings, Bell
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ title: '', content: '', type: 'info' });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Fetch admin data (users, swaps, reports)
      const [usersRes, swapsRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/swaps'),
        axios.get('/api/admin/reports')
      ]);
      
      setUsers(usersRes.data.users);
      setSwaps(swapsRes.data.swaps);
      setReports(reportsRes.data.reports);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      await axios.put(/api/admin/users/${userId}/ban, { reason });
      toast.success('User banned successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axios.put(/api/admin/users/${userId}/unban);
      toast.success('User unbanned successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const handleRejectSkill = async (skillId, reason) => {
    try {
      await axios.put(/api/admin/skills/${skillId}/reject, { reason });
      toast.success('Skill rejected successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to reject skill');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/messages', messageForm);
      toast.success('Message sent successfully');
      setShowMessageModal(false);
      setMessageForm({ title: '', content: '', type: 'info' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDownloadReport = async (type) => {
    try {
      const response = await axios.get(/api/admin/reports/${type}, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ${type}-report.csv);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEEFE0]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Shield className="w-16 h-16 text-[#819A91] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2D3748] mb-2">Access Denied</h2>
          <p className="text-[#4A5568]">You don't have permission to access the admin panel.</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEEFE0]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Users', value: users.length, icon: <Users className="w-6 h-6" />, color: 'from-[#A7C1A8] to-[#819A91]' },
    { title: 'Active Swaps', value: swaps.filter(s => s.status === 'accepted').length, icon: <Activity className="w-6 h-6" />, color: 'from-[#D1D8BE] to-[#A7C1A8]' },
    { title: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, icon: <AlertTriangle className="w-6 h-6" />, color: 'from-[#819A91] to-[#6B8A7D]' },
    { title: 'Banned Users', value: users.filter(u => u.isBanned).length, icon: <Ban className="w-6 h-6" />, color: 'from-red-400 to-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEFE0] via-white to-[#D1D8BE]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#2D3748] mb-2">Admin Dashboard</h1>
          <p className="text-[#4A5568]">Manage your platform and monitor user activity</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card hover-lift"
            >
              <div className={w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-[#2D3748] mb-1">{stat.value}</h3>
              <p className="text-[#4A5568]">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
              { id: 'content', label: 'Content Moderation', icon: <Shield className="w-4 h-4" /> },
              { id: 'swaps', label: 'Swap Monitoring', icon: <Activity className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
              { id: 'messaging', label: 'Messaging', icon: <MessageSquare className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#819A91] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#2D3748] hover:bg-[#EEEFE0]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'users' && <UsersTab users={users} onBanUser={handleBanUser} onUnbanUser={handleUnbanUser} />}
          {activeTab === 'content' && <ContentTab reports={reports} onRejectSkill={handleRejectSkill} />}
          {activeTab === 'swaps' && <SwapsTab swaps={swaps} />}
          {activeTab === 'reports' && <ReportsTab onDownloadReport={handleDownloadReport} />}
          {activeTab === 'messaging' && <MessagingTab onSendMessage={() => setShowMessageModal(true)} />}
        </motion.div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-[#2D3748] mb-4">Send Platform Message</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="form-label">Message Type</label>
                <select
                  value={messageForm.type}
                  onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value })}
                  className="input-field"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Message title"
                  required
                />
              </div>
              <div>
                <label className="form-label">Content</label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Message content"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Tab Components
const OverviewTab = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#2D3748] mb-4">Platform Overview</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[#EEEFE0] rounded-lg">
            <div className="w-2 h-2 bg-[#819A91] rounded-full"></div>
            <span className="text-sm text-[#4A5568]">New user registration</span>
            <span className="text-xs text-[#819A91] ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#EEEFE0] rounded-lg">
            <div className="w-2 h-2 bg-[#A7C1A8] rounded-full"></div>
            <span className="text-sm text-[#4A5568]">Skill swap completed</span>
            <span className="text-xs text-[#819A91] ml-auto">5 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#EEEFE0] rounded-lg">
            <div className="w-2 h-2 bg-[#D1D8BE] rounded-full"></div>
            <span className="text-sm text-[#4A5568]">New skill added</span>
            <span className="text-xs text-[#819A91] ml-auto">10 min ago</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full btn-primary text-left flex items-center space-x-3">
            <Shield className="w-4 h-4" />
            <span>Review Pending Reports</span>
          </button>
          <button className="w-full btn-secondary text-left flex items-center space-x-3">
            <MessageSquare className="w-4 h-4" />
            <span>Send Platform Message</span>
          </button>
          <button className="w-full btn-secondary text-left flex items-center space-x-3">
            <Download className="w-4 h-4" />
            <span>Download Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

const UsersTab = ({ users, onBanUser, onUnbanUser }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-[#2D3748]">User Management</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search users..."
          className="input-field max-w-xs"
        />
        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#D1D8BE]">
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">User</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Email</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Rating</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <motion.tr
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-[#D1D8BE] hover:bg-[#EEEFE0]"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#819A91] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user.name[0]}</span>
                  </div>
                  <span className="font-medium text-[#2D3748]">{user.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-[#4A5568]">{user.email}</td>
              <td className="py-3 px-4">
                {user.isBanned ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Ban className="w-3 h-3 mr-1" />
                    Banned
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-[#4A5568]">
                {user.rating?.average?.toFixed(1) || '0.0'} ({user.rating?.count || 0})
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button className="text-[#819A91] hover:text-[#6B8A7D]">
                    <Eye className="w-4 h-4" />
                  </button>
                  {user.isBanned ? (
                    <button
                      onClick={() => onUnbanUser(user._id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onBanUser(user._id, 'Policy violation')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ContentTab = ({ reports, onRejectSkill }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#2D3748]">Content Moderation</h2>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Pending Reports</h3>
        <div className="space-y-3">
          {reports.filter(r => r.status === 'pending').map((report) => (
            <motion.div
              key={report._id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-[#EEEFE0] rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-[#2D3748]">{report.type}</span>
                <span className="text-xs text-[#819A91]">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-[#4A5568] mb-3">{report.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onRejectSkill(report.skillId, 'Inappropriate content')}
                  className="btn-danger text-sm"
                >
                  Reject
                </button>
                <button className="btn-secondary text-sm">
                  Approve
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Moderation Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Total Reports</span>
            <span className="font-semibold text-[#2D3748]">{reports.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Pending Review</span>
            <span className="font-semibold text-[#2D3748]">{reports.filter(r => r.status === 'pending').length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Resolved</span>
            <span className="font-semibold text-[#2D3748]">{reports.filter(r => r.status === 'resolved').length}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SwapsTab = ({ swaps }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#2D3748]">Swap Monitoring</h2>
    
    <div className="grid md:grid-cols-3 gap-6 mb-6">
      <motion.div whileHover={{ scale: 1.02 }} className="card text-center">
        <div className="text-3xl font-bold text-[#819A91] mb-2">{swaps.filter(s => s.status === 'pending').length}</div>
        <div className="text-[#4A5568]">Pending Swaps</div>
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} className="card text-center">
        <div className="text-3xl font-bold text-[#A7C1A8] mb-2">{swaps.filter(s => s.status === 'accepted').length}</div>
        <div className="text-[#4A5568]">Active Swaps</div>
      </motion.div>
      <motion.div whileHover={{ scale: 1.02 }} className="card text-center">
        <div className="text-3xl font-bold text-[#D1D8BE] mb-2">{swaps.filter(s => s.status === 'completed').length}</div>
        <div className="text-[#4A5568]">Completed Swaps</div>
      </motion.div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#D1D8BE]">
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Users</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Skills</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Status</th>
            <th className="text-left py-3 px-4 text-[#2D3748] font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {swaps.slice(0, 10).map((swap) => (
            <motion.tr
              key={swap._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-[#D1D8BE] hover:bg-[#EEEFE0]"
            >
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div className="font-medium text-[#2D3748]">{swap.requester.name} ↔ {swap.recipient.name}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-[#4A5568]">
                {swap.requestedSkill.name} ↔ {swap.offeredSkill.name}
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-[#4A5568]">
                {new Date(swap.createdAt).toLocaleDateString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReportsTab = ({ onDownloadReport }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#2D3748]">Reports & Analytics</h2>
    
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Download Reports</h3>
        <div className="space-y-3">
          <button
            onClick={() => onDownloadReport('users')}
            className="w-full btn-primary flex items-center justify-between"
          >
            <span>User Activity Report</span>
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownloadReport('swaps')}
            className="w-full btn-secondary flex items-center justify-between"
          >
            <span>Swap Statistics</span>
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownloadReport('feedback')}
            className="w-full btn-secondary flex items-center justify-between"
          >
            <span>Feedback Logs</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.02 }} className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Analytics Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Total Users</span>
            <span className="font-semibold text-[#2D3748]">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Active Swaps</span>
            <span className="font-semibold text-[#2D3748]">567</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Avg. Rating</span>
            <span className="font-semibold text-[#2D3748]">4.8/5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#4A5568]">Success Rate</span>
            <span className="font-semibold text-[#2D3748]">94%</span>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const MessagingTab = ({ onSendMessage }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#2D3748]">Platform Messaging</h2>
    
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div whileHover={{ scale: 1.02 }} className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Send Message</h3>
        <p className="text-[#4A5568] mb-4">
          Send platform-wide messages to all users. Choose the message type and content.
        </p>
        <button onClick={onSendMessage} className="btn-primary">
          <Send className="w-4 h-4 mr-2" />
          Compose Message
        </button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.02 }} className="card">
        <h3 className="text-lg font-semibold text-[#2D3748] mb-4">Recent Messages</h3>
        <div className="space-y-3">
          <div className="p-3 bg-[#EEEFE0] rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-[#2D3748]">Platform Update</span>
              <span className="text-xs text-[#819A91]">2 hours ago</span>
            </div>
            <p className="text-sm text-[#4A5568]">New features have been added to the platform...</p>
          </div>
          <div className="p-3 bg-[#EEEFE0] rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-[#2D3748]">Maintenance Notice</span>
              <span className="text-xs text-[#819A91]">1 day ago</span>
            </div>
            <p className="text-sm text-[#4A5568]">Scheduled maintenance will occur on Sunday...</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default AdminDashboard;