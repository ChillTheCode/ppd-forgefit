import React, { useState } from "react";
import { Dumbbell, Bell, User, Menu, X, Star, Trophy, Calendar } from "lucide-react";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    setCurrentPage(path);
    setIsMobileMenuOpen(false);
  };

  const handleProfile = () => {
    // Simulate checking authentication
    const isLoggedIn = Math.random() > 0.5; // Random for demo
    if (isLoggedIn) {
      handleNavigation("/profile");
    } else {
      handleNavigation("/login");
    }
  };

  const handleNotificationClick = () => {
    toggleModal();
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/membership", label: "Membership" },
    { path: "/classes", label: "Classes" },
    { path: "/trainers", label: "Trainers" },
    { path: "/schedule", label: "Schedule" },
  ];

  return (
    <>
      <nav className="w-full h-20 flex items-center justify-between px-6 bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b border-gray-700 relative z-50">
        {/* Logo Section */}
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => handleNavigation("/")}
        >
          <div className="flex items-center mr-3">
            <img 
              src="/FLOGO-NEW.png" 
              alt="FORGEFIT Logo" 
              className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-all duration-300">
            FORGEFIT
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === item.path
                  ? "text-blue-400 bg-gray-800/50"
                  : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/30"
              }`}
              style={currentPage === item.path ? { color: '#41baf1' } : {}}
            >
              {item.label}
              {currentPage === item.path && (
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: '#41baf1' }}
                ></div>
              )}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Join Now Button - Desktop */}
          <button
            className="hidden md:block px-6 py-2 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            style={{ 
              background: `linear-gradient(135deg, #41baf1, #2196F3)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #2196F3, #1976D2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #41baf1, #2196F3)`;
            }}
            onClick={() => handleNavigation("/register")}
          >
            Join Now
          </button>

          {/* Notifications */}
          <button 
            className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:bg-gray-800/30 rounded-full" 
            onClick={handleNotificationClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#41baf1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            <Bell size={24} />
            <span 
              className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full animate-pulse"
              style={{ background: `linear-gradient(135deg, #41baf1, #2196F3)` }}
            >
              3
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={handleProfile}
            className="p-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:bg-gray-800/30 rounded-full"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#41baf1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            <User size={24} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
            onClick={toggleMobileMenu}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#41baf1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`text-2xl font-medium transition-all duration-300 ${
                  currentPage === item.path
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-blue-400"
                }`}
                style={currentPage === item.path ? { color: '#41baf1' } : {}}
                onMouseEnter={(e) => {
                  if (currentPage !== item.path) {
                    e.currentTarget.style.color = '#41baf1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.path) {
                    e.currentTarget.style.color = '';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="px-8 py-3 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              style={{ 
                background: `linear-gradient(135deg, #41baf1, #2196F3)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, #2196F3, #1976D2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, #41baf1, #2196F3)`;
              }}
              onClick={() => handleNavigation("/register")}
            >
              Join Now
            </button>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleModal}
          ></div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 w-96 max-w-md mx-4 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Bell className="mr-3" size={24} style={{ color: '#41baf1' }} />
                Notifications
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  background: `linear-gradient(135deg, rgba(65,186,241,0.2), rgba(33,150,243,0.2))`,
                  borderColor: 'rgba(65,186,241,0.3)'
                }}
              >
                <div className="flex items-start">
                  <Trophy className="mr-3 mt-1" size={20} style={{ color: '#41baf1' }} />
                  <div>
                    <p className="font-semibold text-white">New Achievement Unlocked!</p>
                    <p className="text-sm text-gray-300 mt-1">You've completed 10 workouts this month</p>
                    <p className="text-xs mt-1" style={{ color: '#41baf1' }}>2 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  background: `linear-gradient(135deg, rgba(65,186,241,0.15), rgba(33,150,243,0.15))`,
                  borderColor: 'rgba(65,186,241,0.25)'
                }}
              >
                <div className="flex items-start">
                  <Calendar className="mr-3 mt-1" size={20} style={{ color: '#41baf1' }} />
                  <div>
                    <p className="font-semibold text-white">Class Reminder</p>
                    <p className="text-sm text-gray-300 mt-1">HIIT class starts in 30 minutes</p>
                    <p className="text-xs mt-1" style={{ color: '#41baf1' }}>25 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  background: `linear-gradient(135deg, rgba(65,186,241,0.1), rgba(33,150,243,0.1))`,
                  borderColor: 'rgba(65,186,241,0.2)'
                }}
              >
                <div className="flex items-start">
                  <Star className="mr-3 mt-1" size={20} style={{ color: '#41baf1' }} />
                  <div>
                    <p className="font-semibold text-white">Weekly Goal Achieved</p>
                    <p className="text-sm text-gray-300 mt-1">You've hit your workout target for this week!</p>
                    <p className="text-xs mt-1" style={{ color: '#41baf1' }}>1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                onClick={toggleModal}
              >
                Mark All Read
              </button>
              <button
                className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300 font-medium"
                style={{ 
                  background: `linear-gradient(135deg, #41baf1, #2196F3)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, #2196F3, #1976D2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, #41baf1, #2196F3)`;
                }}
                onClick={toggleModal}
              >
                View All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;