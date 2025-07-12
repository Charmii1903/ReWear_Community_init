import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { User, Users, MessageSquare, Star, Plus, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSwaps: 0,
    pendingSwaps: 0,
    completedSwaps: 0,
    averageRating: 0
  });
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [swapsResponse] = await Promise.all([
          axios.get('/api/swaps/my-swaps?limit=5')
        ]);

        const swaps = swapsResponse.data.swaps;
        const pending = swaps.filter(swap => swap.status === 'pending').length;
        const completed = swaps.filter(swap => swap.status === 'completed').length;

        setStats({
          totalSwaps: swaps.length,
          pendingSwaps: pending,
          completedSwaps: completed,
          averageRating: user.rating?.average || 0
        });

        setRecentSwaps(swaps.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your skill swaps
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/browse"
              className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-900">Browse Users</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Edit className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-900">Edit Profile</span>
            </Link>
            <Link
              to="/my-swaps"
              className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-purple-900">View My Swaps</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Skills Offered ({user.skillsOffered?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="skill-tag skill-offered">
                    {skill.name}
                  </span>
                ))}
                {(!user.skillsOffered || user.skillsOffered.length === 0) && (
                  <p className="text-gray-500 text-sm">No skills offered yet</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Skills Wanted ({user.skillsWanted?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="skill-tag skill-wanted">
                    {skill.name}
                  </span>
                ))}
                {(!user.skillsWanted || user.skillsWanted.length === 0) && (
                  <p className="text-gray-500 text-sm">No skills wanted yet</p>
                )}
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add more skills
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Swaps */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Swaps</h3>
          <Link to="/my-swaps" className="text-blue-600 hover:text-blue-700 text-sm">
            View all
          </Link>
        </div>
        
        {recentSwaps.length > 0 ? (
          <div className="space-y-4">
            {recentSwaps.map((swap) => (
              <div key={swap._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {swap.requester._id === user._id ? swap.recipient.name : swap.requester.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {swap.offeredSkill.name} ↔ {swap.requestedSkill.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {swap.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No swaps yet</p>
            <Link to="/browse" className="text-blue-600 hover:text-blue-700 text-sm">
              Start browsing users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 