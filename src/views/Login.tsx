import React from 'react';

interface ForgeFitWelcomeProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const ForgeFitWelcome: React.FC<ForgeFitWelcomeProps> = ({ 
  onGetStarted, 
  onSignIn 
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-8 p-4 pt-24">
              <div className="w-full max-w-sm bg-white shadow-lg rounded-3xl pt-4 px-8 pb-8 flex flex-col justify-start items-center gap-6">
        {/* Header Section */}
        <div className="w-full flex flex-col justify-start items-center gap-5">
          {/* Avatar/Logo Section */}
          <div className="w-full flex flex-col justify-start items-center gap-4">
            <div className="w-30 h-30 bg-sky-100 rounded-full flex flex-col justify-center items-center">
              <img 
                className="w-20 h-20 rounded-full object-cover" 
                src="FLOGO-NEW.png" 
                alt="ForgeFit Logo"
              />
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="w-full flex flex-col justify-start items-center gap-3">
            <h1 className="w-full text-center text-gray-900 text-3xl font-bold leading-10">
              ForgeFit
            </h1>
            <h2 className="w-full text-center text-gray-900 text-2xl font-semibold leading-7">
              Hey! Welcome
            </h2>
            <p className="w-full text-center text-gray-500 text-base font-normal leading-6">
              We provide various features<br />
              to help people get healthy<br />
              with the best service<br />
              you could ask for
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full h-13 bg-sky-500 hover:bg-sky-600 transition-colors duration-200 rounded-xl flex justify-center items-center py-4"
          >
            <span className="text-white text-base font-semibold">
              Get Started
            </span>
          </button>
          
          <button 
            onClick={onSignIn}
            className="w-full flex justify-center items-center py-2 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-gray-500 text-sm font-normal">
              I Already Have an Account
            </span>
          </button>
        </div>

        {/* Decorative Dots */}
        <div className="w-full flex flex-col justify-start items-center gap-2">
          {/* First row of dots */}
          <div className="flex justify-start items-center gap-2">
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
          
          {/* Second row of dots */}
          <div className="flex justify-start items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-100 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgeFitWelcome;