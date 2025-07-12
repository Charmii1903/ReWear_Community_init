import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, ArrowRight, Star, Shield, Clock } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Swap Skills,{' '}
          <span className="text-blue-600">Grow Together</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with people who have the skills you need and offer your expertise in return. 
          Build meaningful relationships while learning and teaching.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/browse" className="btn-primary text-lg px-8 py-3">
                Browse Users
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Skill Swap?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Experts</h3>
            <p className="text-gray-600">
              Find people with the exact skills you need and connect with them directly.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mutual Learning</h3>
            <p className="text-gray-600">
              Exchange knowledge and skills in a fair, reciprocal learning environment.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Verified profiles and rating system ensure safe skill exchanges.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50 rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600 text-sm">
                List your skills and what you want to learn
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Find Matches</h3>
              <p className="text-gray-600 text-sm">
                Browse users and find skill exchange opportunities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Make Request</h3>
              <p className="text-gray-600 text-sm">
                Send swap requests to users you want to connect with
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Learn Together</h3>
              <p className="text-gray-600 text-sm">
                Complete the skill exchange and leave feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Swapping Skills?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of learners and teachers on our platform
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home; 