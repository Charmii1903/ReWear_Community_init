import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, ArrowRight, Star, CheckCircle, TrendingUp, Shield, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Find Skill Partners',
      description: 'Connect with people who have the skills you want to learn and vice versa.',
      color: 'from-[#A7C1A8] to-[#819A91]'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Verified Users',
      description: 'All users are verified and rated by the community for safe skill swapping.',
      color: 'from-[#D1D8BE] to-[#A7C1A8]'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Rate & Review',
      description: 'Rate your skill swap experiences and help build a trusted community.',
      color: 'from-[#819A91] to-[#6B8A7D]'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Users' },
    { number: '500+', label: 'Skills Swapped' },
    { number: '4.8', label: 'Average Rating' },
    { number: '50+', label: 'Cities Covered' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and list the skills you can teach and the skills you want to learn.',
      icon: <Users className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Find Skill Partners',
      description: 'Browse users and find people with complementary skills for swapping.',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Start Learning',
      description: 'Request skill swaps, schedule sessions, and learn from each other.',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEFE0] via-white to-[#D1D8BE]">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#819A91] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#A7C1A8] rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#D1D8BE] rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl font-bold text-[#2D3748] mb-6 leading-tight"
            >
              Learn New Skills by
              <span className="block text-[#819A91] bg-gradient-to-r from-[#819A91] to-[#A7C1A8] bg-clip-text text-transparent">
                Teaching Others
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-[#4A5568] mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Join our community of learners and teachers. Share your expertise, learn from others, 
              and grow together through skill swapping.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              {user ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/browse" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                      Browse Users
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/profile" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                      My Profile
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="btn-secondary text-lg px-8 py-4 flex items-center justify-center">
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-[#819A91] mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-[#4A5568] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-[#EEEFE0] to-[#D1D8BE]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-6">
              Why Choose Skill Swap?
            </h2>
            <p className="text-xl text-[#4A5568] max-w-3xl mx-auto">
              Experience the power of collaborative learning with our innovative platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="card h-full transform transition-all duration-300 group-hover:shadow-2xl">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-[#2D3748] mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5568] text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-[#4A5568] max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#819A91] to-[#A7C1A8] z-0"></div>
                )}

                <div className="relative z-10 text-center">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-[#819A91] to-[#A7C1A8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-white font-bold text-2xl">{step.number}</span>
                  </motion.div>
                  
                  <div className="w-12 h-12 bg-[#D1D8BE] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-[#2D3748]">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-[#2D3748] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-[#4A5568] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-[#819A91] to-[#A7C1A8]"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Start Learning?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of learners who are already swapping skills and growing together.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/browse" className="bg-white text-[#819A91] hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200 inline-flex items-center">
                  Browse Users Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-white text-[#819A91] hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200 inline-flex items-center">
                  Join Skill Swap
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;