import React, { useState, useEffect } from "react";
import { Bell, User, Menu, X, Trophy, LogIn, UserPlus, Home, DollarSign, Grid, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Mock authentication status (replace with actual auth logic)
// In a real app, this would come from a context, Redux, Zustand, etc.
let mockIsLoggedIn = false;
const setMockIsLoggedIn = (status: boolean) => { mockIsLoggedIn = status; };

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use a state for isLoggedIn to trigger re-renders when it changes
  const [loggedIn, setLoggedIn] = useState(mockIsLoggedIn); 

  const navigate = useNavigate();
  const location = useLocation();

  // Simulate login/logout for demo
  const toggleLoginStatus = () => {
    setMockIsLoggedIn(!mockIsLoggedIn);
    setLoggedIn(!loggedIn); // Update component state to re-render
    if (!mockIsLoggedIn) navigate("/"); // Navigate to home on logout for demo
    else navigate("/profile"); // Navigate to profile on login for demo
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update loggedIn state if the global mock changes (e.g. by another component)
  useEffect(() => {
    setLoggedIn(mockIsLoggedIn);
  }, []); // Removed mockIsLoggedIn from dependency array as it's not a state/prop

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavigation = (path: string, targetId?: string) => {
    setIsMobileMenuOpen(false);
    if (targetId && location.pathname === "/") {
      // If on homepage and targetId is provided, scroll to section
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      // Optionally update URL hash
      navigate(path, { replace: true });
    } else if (targetId) {
      // If not on homepage but path includes a hash for a section
      navigate(path); // Navigate to homepage and then scroll (browser default behavior for hash)
    }
    else {
      navigate(path);
    }
  };

  const handleProfileClick = () => {
    if (loggedIn) {
      handleNavigation("/profile");
    } else {
      handleNavigation("/login");
    }
  };

  const handleNotificationClick = () => {
    setIsModalOpen(true);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, targetId: "hero-section" },
    { path: "/#features-section", label: "Features", icon: Zap, targetId: "features-section" },
    { path: "/#membership-plans-section", label: "Membership", icon: DollarSign, targetId: "membership-plans-section" },
    { path: "/classes", label: "Classes", icon: Grid },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'h-16 bg-black/95 backdrop-blur-md shadow-2xl border-b border-gray-800/50' 
          : 'h-20 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => handleNavigation("/")}
            >
              <div className="flex items-center">
                <img 
                  src="/FORGEFIT_CLEAN.png"
                  alt="FORGEFIT Logo" 
                  className={`object-contain group-hover:scale-110 transition-transform duration-300 ${
                    isScrolled ? 'h-24 w-auto' : 'h-28 w-auto'
                  }`}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path, item.targetId)}
                  className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-300 group flex items-center space-x-2 ${
                    (location.pathname === item.path || (location.pathname === "/" && location.hash === item.path.substring(1)))
                      ? "text-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/60"
                  }`}
                  style={{ '--active-color': '#41baf1', '--hover-color': '#60c5f7' } as React.CSSProperties}
                >
                  {item.icon && <item.icon size={16} className={`${
                     (location.pathname === item.path || (location.pathname === "/" && location.hash === item.path.substring(1))) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  } transition-colors`}/>}
                  <span>{item.label}</span>
                  {(location.pathname === item.path || (location.pathname === "/" && location.hash === item.path.substring(1))) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                  )}
                  <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {!loggedIn && (
                <button
                  className="hidden lg:block px-5 py-2.5 text-sm text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/40 relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(to right, #41baf1, #60c5f7)`,
                  }}
                  onClick={() => handleNavigation("/register")}
                >
                  <span className="relative z-10 flex items-center">
                    <UserPlus size={16} className="mr-1.5"/> Join Now
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              )}

              {loggedIn && (
                 <button 
                  className="relative p-2 sm:p-2.5 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800/50 rounded-lg group" 
                  onClick={handleNotificationClick}
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
                    3
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}

              <button
                onClick={handleProfileClick}
                className="p-2 sm:p-2.5 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800/50 rounded-lg relative group"
              >
                <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {/* DEMO: Toggle Login Status Button - REMOVE FOR PRODUCTION */}
              <button 
                onClick={toggleLoginStatus} 
                className="hidden p-1 text-xs bg-purple-500 text-white rounded"
                style={{ display: 'none' }}
              >
                Toggle Login
              </button>

              <button
                className="lg:hidden p-2 sm:p-2.5 text-gray-300 hover:text-blue-400 transition-all duration-300 hover:bg-gray-800/50 rounded-lg"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={toggleMobileMenu}></div>
        <div className={`fixed top-0 right-0 bottom-0 bg-gradient-to-b from-gray-900 to-black w-full max-w-xs sm:max-w-sm shadow-2xl transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col pt-20 px-6 pb-8 h-full">
            <div className="flex items-center justify-between mb-8 px-2">
                <div 
                  className="flex items-center cursor-pointer group" 
                  onClick={() => handleNavigation("/")}
                >
                  <img 
                    src="/FORGEFIT_CLEAN.png" 
                    alt="FORGEFIT Logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-grow space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path, item.targetId)}
                  className={`flex items-center space-x-3 w-full text-left px-3 py-3.5 rounded-lg font-medium transition-all duration-200 transform hover:translate-x-1 ${
                    (location.pathname === item.path || (location.pathname === "/" && location.hash === item.path.substring(1)))
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                  }`}
                >
                  {item.icon && <item.icon size={20} className={`${
                     (location.pathname === item.path || (location.pathname === "/" && location.hash === item.path.substring(1))) ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  } transition-colors`}/>}
                  <span className="text-lg">{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-auto pt-6">
              {!loggedIn && (
                <button
                  className="w-full px-6 py-3.5 mb-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base flex items-center justify-center"
                  style={{ background: `linear-gradient(to right, #41baf1, #60c5f7)`}}
                  onClick={() => handleNavigation("/register")}
                >
                  <UserPlus size={18} className="mr-2"/> Join Now
                </button>
              )}
              <button
                className={`w-full px-6 py-3.5 font-semibold rounded-lg transition-all duration-300 text-base flex items-center justify-center border-2 ${
                  loggedIn 
                    ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
                    : 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
                }`}
                onClick={handleProfileClick}
              >
                {loggedIn ? <User size={18} className="mr-2"/> : <LogIn size={18} className="mr-2"/>}
                {loggedIn ? "My Profile" : "Member Login"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={toggleModal}></div>
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 w-[90vw] max-w-md mx-4 relative transform scale-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md sm:rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                        <Bell size={16} className="text-white" />
                    </div>
                    Notifications
                </h2>
                <button onClick={toggleModal} className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-700/50 rounded-md sm:rounded-lg">
                    <X size={18} />
                </button>
            </div>
            <div className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto custom-scrollbar pr-1">
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300 group">
                <div className="flex items-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md sm:rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Trophy size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm sm:text-base text-white">New Achievement!</p>
                        <p className="text-xs sm:text-sm text-gray-300 mt-0.5">10 workouts this month.</p>
                        <p className="text-[10px] sm:text-xs text-blue-400 mt-1.5">2m ago</p>
                    </div>
                </div>
              </div>
            </div>
             <div className="flex space-x-2 sm:space-x-3 mt-6">
                <button className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-700/50 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-gray-600/50 transition-all duration-300 font-medium border border-gray-600/50 hover:border-gray-500/50" onClick={toggleModal}>
                    Mark All Read
                </button>
                <button className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25" onClick={toggleModal}>
                    View All
                </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations and scrollbar */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(75, 85, 99, 0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #1d4ed8); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #60a5fa, #3b82f6); }
      `}</style>
    </>
  );
};

export default Navbar;