import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Assuming lucide-react is installed

interface ForgeFitRegisterProps {
  onLogin?: () => void; // Prop for parent to handle login navigation/action
  onBack?: () => void; // This prop is no longer used by a UI element in this component
  onRegister?: (email: string, password: string) => void;
  onGoogleAuth?: () => void;
  onFacebookAuth?: () => void;
  onAppleAuth?: () => void;
}

const ForgeFitRegister: React.FC<ForgeFitRegisterProps> = ({
  onLogin,
  onBack, // Still received as a prop, but the back button UI is removed
  onRegister,
  onGoogleAuth,
  onFacebookAuth,
  onAppleAuth
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (onRegister && email && password) {
      onRegister(email, password);
    }
  };

  // New handler for the "Login" link/button
  const handleLoginLinkClick = () => {
    if (onLogin) {
      // If onLogin prop is provided, call it.
      // The parent component is responsible for handling the navigation (e.g., using a router).
      onLogin();
    } else {
      // Fallback: If no onLogin prop is provided, navigate directly to /login.
      // This causes a full page reload and might not be ideal for SPAs if a router is used,
      // but it ensures the link works as per the request.
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center p-4 pt-12 sm:pt-16 md:pt-20" style={{backgroundColor: '#1C538B'}}>
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white shadow-lg rounded-3xl p-10 flex flex-col gap-7">
        {/* Header Section within Card - Updated with ForgeFit Logo */}
        <div className="flex flex-col items-center gap-5"> {/* Adjusted gap */}
          {/* Logo Section - Adapted from ForgeFitWelcome */}
          <div className="w-30 h-30 bg-sky-100 rounded-full flex flex-col justify-center items-center p-2"> {/* Added some padding for the container */}
            <img
              className="w-20 h-20 rounded-full object-cover"
              src="FLOGO-NEW.png" // Make sure this path is correct relative to your public folder or build process
              alt="ForgeFit Logo"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // prevent infinite loop if placeholder also fails
                target.src="https://placehold.co/80x80/E0F2FE/1B538A?text=Logo"; // Placeholder image
              }}
            />
          </div>
          {/* Title */}
          <h1 className="text-center text-gray-900 text-2xl font-bold leading-7">
            Create an Account
          </h1>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-medium leading-4">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 px-3.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 text-sm font-medium leading-4">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-3.5 pr-12 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full h-12 bg-sky-400 hover:bg-sky-500 transition-colors duration-200 rounded-lg flex justify-center items-center"
          >
            <span className="text-white text-base font-semibold">Register</span>
          </button>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-gray-500 text-sm">Already have an account? </span>
            <button
              type="button"
              onClick={handleLoginLinkClick} // Updated onClick handler
              className="text-sky-400 text-sm font-bold hover:text-sky-500 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>

        {/* Social Login Section */}
        <div className="flex flex-col gap-4">
          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onGoogleAuth}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 text-sm font-medium">Continue with Google</span>
            </button>

            <button
              onClick={onFacebookAuth}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9C18 4.03125 13.9688 0 9 0S0 4.03125 0 9c0 4.5 3.26562 8.25 7.59375 8.9063V11.5938H5.30625V9H7.59375V7.03125C7.59375 4.78125 8.93438 3.5625 10.9688 3.5625c.9375 0 1.9375.1562 1.9375.1562v2.125h-1.0938c-1.0625 0-1.4062.6562-1.4062 1.3438V9h2.4375l-.3906 2.5938h-2.0469V17.9063C14.7344 17.25 18 13.5 18 9z" fill="#1877F2"/>
              </svg>
              <span className="text-gray-700 text-sm font-medium">Continue with Facebook</span>
            </button>

            <button
              onClick={onAppleAuth}
              className="w-full h-11 bg-white border border-gray-200 rounded-lg flex justify-center items-center gap-2.5 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3438 9.5625c-.0312-2.9062 2.3438-4.3125 2.4375-4.375-.8125-1.1875-2.0938-1.3438-2.5625-1.375-1.0938-.1094-2.125.6563-2.6875.6563-.5625 0-1.4375-.6406-2.375-.625-1.2188.0156-2.3438.7031-2.9688 1.7812C4.40625 7.21875 5.5 10.1562 7.25 11.75c.875 1.25 1.9062 2.6562 3.2812 2.6094.9375-.0313 1.3125-.5938 2.4688-.5938 1.1562 0 1.5-.5938 2.4375-.5781 1.0156.0156 2.3125-1.2812 3.1562-2.5469-2.0156-.9375-2.375-2.7656-2.375-2.8437-.0469-1.2188.9844-2.4062 1.0469-2.4688z" fill="black"/>
                <path d="M11.875 2.5C12.625 1.625 13.1562.4375 13.0312-.6875c-1.0312.0469-2.2812.6875-3.0312 1.5625-.6875.7812-1.2812 2-1.125 3.1562 1.1875.0938 2.4062-.5937 3-.9687z" fill="black"/>
              </svg>
              <span className="text-gray-700 text-sm font-medium">Continue with Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgeFitRegister;
