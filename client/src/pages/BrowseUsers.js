import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, locationFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      if (searchTerm) params.append('skill', searchTerm);
      if (locationFilter) params.append('location', locationFilter);

      const response = await axios.get(`/api/users/browse?${params}`);
      setUsers(response.data.users);
      setHasNext(response.data.pagination.hasNext);
      setHasPrev(response.data.pagination.hasPrev);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Users</h1>
        <p className="text-gray-600">
          Find people with the skills you need and offer your expertise in return
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by skill (e.g., Photoshop, Excel)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {users.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {users.map((user) => (
              <div key={user._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.location && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {user.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">
                      {user.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>

                {/* Skills Offered */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag skill-offered text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsOffered?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{user.skillsOffered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                      <span key={index} className="skill-tag skill-wanted text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsWanted?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{user.skillsWanted.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability */}
                {user.availability && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.availability.weekdays && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Weekdays
                        </span>
                      )}
                      {user.availability.weekends && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Weekends
                        </span>
                      )}
                      {user.availability.evenings && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Evenings
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Link
                  to={`/user/${user._id}`}
                  className="btn-primary w-full text-center"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or location filter
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseUsers; 