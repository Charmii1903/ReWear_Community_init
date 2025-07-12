import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, MapPin, Star, MessageSquare, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [swapForm, setSwapForm] = useState({
    requestedSkill: '',
    offeredSkill: '',
    message: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    
    if (!swapForm.requestedSkill || !swapForm.offeredSkill) {
      toast.error('Please select both skills for the swap');
      return;
    }

    try {
      const response = await axios.post('/api/swaps', {
        recipientId: userId,
        requestedSkill: { name: swapForm.requestedSkill },
        offeredSkill: { name: swapForm.offeredSkill },
        message: swapForm.message
      });
      
      toast.success('Swap request sent successfully!');
      setShowSwapForm(false);
      setSwapForm({ requestedSkill: '', offeredSkill: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or their profile is private.</p>
          <button
            onClick={() => navigate('/browse')}
            className="btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                {user.rating?.average?.toFixed(1) || '0.0'} ({user.rating?.count || 0} reviews)
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              onClick={() => setShowSwapForm(true)}
              className="btn-primary"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Swap
            </button>
          )}
        </div>
      </div>

      {/* Profile Photo */}
      <div className="card mb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Skills I Can Offer</h3>
        {user.skillsOffered && user.skillsOffered.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {user.skillsOffered.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {skill.level}
                  </span>
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-600">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No skills offered yet</p>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Skills I Want to Learn</h3>
        {user.skillsWanted && user.skillsWanted.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {user.skillsWanted.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    skill.priority === 'High' ? 'bg-red-100 text-red-800' :
                    skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {skill.priority} Priority
                  </span>
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-600">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No skills wanted yet</p>
        )}
      </div>

      {/* Availability */}
      {user.availability && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Availability</h3>
          <div className="flex flex-wrap gap-2">
            {user.availability.weekdays && (
              <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Weekdays
              </span>
            )}
            {user.availability.weekends && (
              <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Weekends
              </span>
            )}
            {user.availability.evenings && (
              <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Evenings
              </span>
            )}
            {!user.availability.weekdays && !user.availability.weekends && !user.availability.evenings && (
              <span className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                <XCircle className="w-4 h-4 mr-1" />
                No availability set
              </span>
            )}
          </div>
          {user.availability.customSchedule && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Custom Schedule:</strong> {user.availability.customSchedule}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Request Skill Swap</h3>
              <button
                onClick={() => setShowSwapForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSwapRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I want to learn from {user.name}:
                </label>
                <select
                  value={swapForm.requestedSkill}
                  onChange={(e) => setSwapForm({ ...swapForm, requestedSkill: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a skill</option>
                  {user.skillsOffered?.map((skill, index) => (
                    <option key={index} value={skill.name}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I can offer in return:
                </label>
                <select
                  value={swapForm.offeredSkill}
                  onChange={(e) => setSwapForm({ ...swapForm, offeredSkill: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a skill</option>
                  {currentUser?.skillsOffered?.map((skill, index) => (
                    <option key={index} value={skill.name}>
                      {skill.name} ({skill.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional):
                </label>
                <textarea
                  value={swapForm.message}
                  onChange={(e) => setSwapForm({ ...swapForm, message: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Tell them why you'd like to swap skills..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowSwapForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 