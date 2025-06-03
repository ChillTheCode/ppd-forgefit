import React, { useState } from 'react';

import {
  Calendar,
  Trophy,
  Heart,
  Zap,
  ShieldCheck,
  BarChart3,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Target,
  Dumbbell,
  Activity,
  TrendingUp
} from 'lucide-react';

// Type definitions
interface ForgeFitLogoProps {
  size?: number;
  className?: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
}

// Custom Logo Component
const ForgeFitLogo: React.FC<ForgeFitLogoProps> = ({ size = 20, className = "" }) => {
  return (
    <img 
      src="FLOGO-NEW.png" 
      alt="ForgeFit Logo" 
      width={size} 
      height={size}
      className={`object-contain ${className}`}
      onError={(e) => {
        // Fallback to Dumbbell icon if image fails to load
        const target = e.currentTarget;
        const nextElement = target.nextElementSibling as HTMLElement;
        target.style.display = 'none';
        if (nextElement) {
          nextElement.style.display = 'inline';
        }
      }}
    />
  );
};


 const handleLogout = (): void => {
    // In a real app, you would clear user session/tokens here
    console.log('Logging out...');
    // Navigate to root path
    window.location.href = '/';
  };


// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onClick, gradient }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-blue-400/50"
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${gradient}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
        {description}
      </p>
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, change }) => {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-400">
          {icon}
        </div>
        {change && (
          <span className="text-green-400 text-xs font-medium">
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
};

const ForgeFitMainDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName] = useState<string>("John Doe"); // Mock user name

  const handleFeatureNavigation = (featureName: string): void => {
    console.log(`Navigating to ${featureName}`);
    // Here you would implement actual navigation
    // For example: navigate(`/${featureName.toLowerCase().replace(/\s+/g, '-')}`);
    alert(`Navigating to ${featureName} feature`);
  };

  const features = [
    {
      id: 'fitmap',
      icon: <Calendar className="text-white" size={24} />,
      title: "FITMAP",
      shortTitle: "Workout Tracking",
      description: "Membuat dan memantau rencana latihan, rekomendasi AI, dan evaluasi bulanan",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      id: 'stronglytics',
      icon: <Zap className="text-white" size={24} />,
      title: "STRONGLYTICS",
      shortTitle: "Strength Analysis",
      description: "Menghitung kekuatan otomatis dan rekomendasi set, berat, repetisi",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      id: 'motiv8',
      icon: <Trophy className="text-white" size={24} />,
      title: "MOTIV8",
      shortTitle: "Motivation System",
      description: "Meningkatkan motivasi lewat gamifikasi, badge, dan achievement",
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    {
      id: 'formcheck',
      icon: <ShieldCheck className="text-white" size={24} />,
      title: "FORMCHECK AI",
      shortTitle: "Technique Guidance",
      description: "Panduan teknik yang benar dan validasi otomatis untuk mencegah cedera",
      gradient: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      id: 'lifesync',
      icon: <Heart className="text-white" size={24} />,
      title: "LIFESYNC",
      shortTitle: "Lifestyle Integration",
      description: "Kalkulator kalori, rekomendasi menu AI, dan jadwal tidur sehat",
      gradient: "bg-gradient-to-r from-red-500 to-pink-500"
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="text-white" size={24} />,
      title: "ANALYTICS",
      shortTitle: "Progress Tracking",
      description: "Analisis mendalam progres 1RM, volume latihan, dan metrik recovery",
      gradient: "bg-gradient-to-r from-cyan-500 to-blue-500"
    }
  ];

  const stats = [
    {
      icon: <Target size={20} />,
      label: "Workout Streak",
      value: "12",
      change: "+2 this week"
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Total Workouts",
      value: "45",
      change: "+5 this month"
    },
    {
      icon: <Activity size={20} />,
      label: "Current 1RM",
      value: "85kg",
      change: "+5kg"
    },
    {
      icon: <Trophy size={20} />,
      label: "Badges Earned",
      value: "8",
      change: "+1 new"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Empty header content */}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-blue-400">{userName.split(' ')[0]}</span>! 💪
          </h2>
          <p className="text-gray-400">
            Ready to forge your fitness journey? Choose a feature to get started.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="mr-2 text-blue-400" size={20} />
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFeatureNavigation('Start Workout')}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Start Workout
            </button>
            <button
              onClick={() => handleFeatureNavigation('Log Progress')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition-all duration-300"
            >
              Log Progress
            </button>
            <button
              onClick={() => handleFeatureNavigation('Check Form')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium transition-all duration-300"
            >
              Check Form
            </button>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Zap className="mr-2 text-blue-400" size={20} />
            AI-Powered Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => handleFeatureNavigation(feature.title)}
                gradient={feature.gradient}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-blue-400" size={20} />
            Recent Activity
          </h3>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Trophy size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Achievement Unlocked!</p>
                    <p className="text-sm text-gray-400">Consistency Champion - 7 day streak</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <ShieldCheck size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Form Check Completed</p>
                    <p className="text-sm text-gray-500">Deadlift technique validated</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">1d ago</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">New 1RM Record</p>
                    <p className="text-sm text-gray-500">Bench Press: 80kg → 85kg</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">3d ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ForgeFitLogo size={20} className="text-blue-400" />
              <Dumbbell className="text-blue-400 hidden" size={20} />
              <span className="text-sm text-gray-400">
                © 2025 ForgeFit. Forge your strength, forge your future.
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgeFitMainDashboard;