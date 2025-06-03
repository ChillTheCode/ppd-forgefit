import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // For password visibility icon

interface LoginPageProps {
  // You can define any props this component might need, e.g., onLogin, onRegister
  onLogin?: (email: string, password: string) => void;
  onRegisterClick?: () => void; // Prop for parent to handle register navigation/action
  onForgotPasswordClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onRegisterClick,
  onForgotPasswordClick
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (onLogin) {
      onLogin(email, password);
    } else {
      console.log('Login attempt with:', { email, password });
      // Navigate to dashboard after login
      window.location.href = '/dashboard';
    }
  };

  // New handler for the "Register" link/button
  const handleRegisterLinkClick = () => {
    if (onRegisterClick) {
      // If onRegisterClick prop is provided, call it.
      // The parent component is responsible for handling the navigation (e.g., using a router).
      onRegisterClick();
    } else {
      // Fallback: If no onRegisterClick prop is provided, navigate directly to /register.
      // This causes a full page reload and might not be ideal for SPAs if a router is used,
      // but it ensures the link works as per the request.
      window.location.href = '/register';
    }
  };

  return (
    <div className="min-h-screen bg-[#1C538B] flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="bg-white shadow-lg rounded-3xl p-10 flex flex-col gap-7 w-full max-w-md">
        {/* Header Section - Updated with ForgeFit Logo */}
        <div className="w-full flex flex-col items-center gap-5"> {/* Adjusted gap from gap-4 to gap-5 based on new logo snippet */}
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
          <div className="self-stretch flex flex-col items-center gap-1">
            <h1 className="self-stretch text-center text-gray-900 text-2xl font-bold leading-7">
              Login Now
            </h1>
            <p className="self-stretch text-center text-gray-500 text-sm font-normal leading-tight">
              Enter your login details below to continue
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full flex flex-col gap-4">
          {/* Email Field */}
          <div className="self-stretch flex flex-col gap-1.5">
            <label className="self-stretch text-gray-700 text-sm font-medium leading-tight">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="self-stretch h-12 px-3.5 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41BAF1] focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="self-stretch flex flex-col gap-1.5">
            <label className="self-stretch text-gray-700 text-sm font-medium leading-tight">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-grow h-12 px-3.5 py-2.5 pr-10 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41BAF1] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="self-stretch text-right">
            <button
              type="button"
              onClick={onForgotPasswordClick} // Assuming this prop will be handled by the parent
              className="text-[#41BAF1] text-sm font-medium leading-tight hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="self-stretch h-12 bg-[#41BAF1] hover:bg-[#31AADD] transition-colors duration-200 rounded-lg flex justify-center items-center"
          >
            <span className="text-white text-base font-semibold leading-tight">Login</span>
          </button>

          {/* Registration Link */}
          <div className="self-stretch text-center">
            <span className="text-gray-500 text-sm font-normal leading-tight">
              Don't have an account?{' '}
            </span>
            <button
              type="button"
              onClick={handleRegisterLinkClick} // Updated onClick handler
              className="text-[#41BAF1] text-sm font-bold leading-tight hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;