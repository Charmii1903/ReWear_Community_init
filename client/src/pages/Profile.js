import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, MapPin, Eye, EyeOff, Plus, Edit, Trash2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [newSkill, setNewSkill] = useState({ name: '', description: '', level: 'Intermediate' });
  const [newSkillWanted, setNewSkillWanted] = useState({ name: '', description: '', priority: 'Medium' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        location: user.location || '',
        isPublic: user.isPublic
      });
    }
  }, [user, reset]);

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.put('/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully');
      reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkillOffered = async () => {
    if (!newSkill.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      const response = await axios.post('/api/users/skills/offered', newSkill);
      toast.success('Skill added successfully');
      setNewSkill({ name: '', description: '', level: 'Intermediate' });
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add skill');
    }
  };

  const addSkillWanted = async () => {
    if (!newSkillWanted.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    try {
      const response = await axios.post('/api/users/skills/wanted', newSkillWanted);
      toast.success('Skill wanted added successfully');
      setNewSkillWanted({ name: '', description: '', priority: 'Medium' });
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add skill wanted');
    }
  };

  const deleteSkill = async (skillId, type) => {
    try {
      await axios.delete(`/api/users/skills/${type}/${skillId}`);
      toast.success('Skill removed successfully');
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const updateAvailability = async (availability) => {
    try {
      await axios.put('/api/users/availability', availability);
      toast.success('Availability updated successfully');
      // Refresh user data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your profile, skills, and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'skills'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'availability'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Availability
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900">{user.location || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                <p className="text-gray-900">{user.isPublic ? 'Public' : 'Private'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <p className="text-gray-900">
                  {user.rating?.average?.toFixed(1) || '0.0'} ({user.rating?.count || 0} reviews)
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="input-field"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="input-field"
                  {...register('location')}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register('isPublic')}
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  Make my profile public
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skills Offered */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Skills I Can Offer</h3>
            
            {/* Add New Skill */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Add New Skill</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g., Photoshop)"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="input-field"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="input-field"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                onClick={addSkillOffered}
                className="btn-primary mt-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </button>
            </div>

            {/* Existing Skills */}
            <div className="space-y-3">
              {user.skillsOffered?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{skill.name}</h5>
                    {skill.description && <p className="text-sm text-gray-600">{skill.description}</p>}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {skill.level}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSkill(index, 'offered')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!user.skillsOffered || user.skillsOffered.length === 0) && (
                <p className="text-gray-500 text-center py-4">No skills offered yet</p>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Skills I Want to Learn</h3>
            
            {/* Add New Skill Wanted */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Add Skill I Want</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g., Excel)"
                  value={newSkillWanted.name}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newSkillWanted.description}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, description: e.target.value })}
                  className="input-field"
                />
                <select
                  value={newSkillWanted.priority}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              <button
                onClick={addSkillWanted}
                className="btn-primary mt-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill Wanted
              </button>
            </div>

            {/* Existing Skills Wanted */}
            <div className="space-y-3">
              {user.skillsWanted?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{skill.name}</h5>
                    {skill.description && <p className="text-sm text-gray-600">{skill.description}</p>}
                    <span className={`text-xs px-2 py-1 rounded ${
                      skill.priority === 'High' ? 'bg-red-100 text-red-800' :
                      skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {skill.priority} Priority
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSkill(index, 'wanted')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!user.skillsWanted || user.skillsWanted.length === 0) && (
                <p className="text-gray-500 text-center py-4">No skills wanted yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Availability Settings</h2>
          <p className="text-gray-600 mb-6">
            Let others know when you're available for skill swaps
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekdays"
                checked={user.availability?.weekdays || false}
                onChange={(e) => updateAvailability({ weekdays: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="weekdays" className="ml-2 text-sm text-gray-700">
                Available on weekdays
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekends"
                checked={user.availability?.weekends || false}
                onChange={(e) => updateAvailability({ weekends: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="weekends" className="ml-2 text-sm text-gray-700">
                Available on weekends
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="evenings"
                checked={user.availability?.evenings || false}
                onChange={(e) => updateAvailability({ evenings: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="evenings" className="ml-2 text-sm text-gray-700">
                Available in evenings
              </label>
            </div>

            <div>
              <label htmlFor="customSchedule" className="block text-sm font-medium text-gray-700">
                Custom Schedule (optional)
              </label>
              <textarea
                id="customSchedule"
                placeholder="Describe your specific availability..."
                className="input-field mt-1"
                rows="3"
                defaultValue={user.availability?.customSchedule || ''}
                onChange={(e) => updateAvailability({ customSchedule: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <p className="text-gray-600 mb-6">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className="input-field pr-10"
                  {...register('currentPassword', { required: 'Current password is required' })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-600 text-sm">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="input-field pr-10"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-600 text-sm">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="input-field"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === watch('newPassword') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile; 