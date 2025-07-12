import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Users, Home, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-[#D1D8BE]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#819A91] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-[#2D3748]">Skill Swap</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#2D3748] hover:text-[#819A91] transition-colors">
              Home
            </Link>
            <Link to="/browse" className="text-[#2D3748] hover:text-[#819A91] transition-colors">
              Browse Users
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-[#2D3748] hover:text-[#819A91] transition-colors">
                  Dashboard
                </Link>
                <Link to="/my-swaps" className="text-[#2D3748] hover:text-[#819A91] transition-colors">
                  My Swaps
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-[#2D3748] hover:text-[#819A91] transition-colors flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-[#2D3748] hover:text-[#819A91] transition-colors">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-[#D1D8BE]">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-[#2D3748] hover:bg-[#EEEFE0]"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-[#2D3748] hover:bg-[#EEEFE0]"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-[#2D3748] hover:text-[#819A91] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#2D3748] hover:text-[#819A91] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-[#D1D8BE]">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link
                to="/browse"
                className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4 mr-2" />
                Browse Users
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-swaps"
                    className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Swaps
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-3 py-2 text-[#2D3748] hover:text-[#819A91] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
