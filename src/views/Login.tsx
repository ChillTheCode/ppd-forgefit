import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

interface ForgeFitWelcomeProps {
  onGetStarted?: () => void; // You can keep this if the parent needs to do something else too
  onSignIn?: () => void;
}

const ForgeFitWelcome: React.FC<ForgeFitWelcomeProps> = ({
  onGetStarted,
  onSignIn
}) => {
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleGetStartedClick = () => {
    navigate('/register'); // 3. Navigate to /register
    if (onGetStarted) {
      onGetStarted(); // Call the original prop function if it exists
    }
  };

  const handleSignInClick = () => {
    navigate('/login'); // Navigate to /login
    if (onSignIn) {
      onSignIn(); // Call the original prop function if it exists
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8 p-4 pt-24" style={{backgroundColor: '#1B538A'}}>
      <div className="w-full max-w-sm bg-white shadow-lg rounded-3xl pt-4 px-8 pb-8 flex flex-col justify-start items-center gap-6">
        {/* Header Section */}
        <div className="w-full flex flex-col justify-start items-center gap-5">
          {/* Avatar/Logo Section */}
          <div className="w-full flex flex-col justify-start items-center gap-4">
            <div className="w-30 h-30 bg-sky-100 rounded-full flex flex-col justify-center items-center">
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
            onClick={handleGetStartedClick}
            className="w-full h-13 bg-sky-500 hover:bg-sky-600 transition-colors duration-200 rounded-xl flex justify-center items-center py-4"
          >
            <span className="text-white text-base font-semibold">
              Get Started
            </span>
          </button>

          <button
            onClick={handleSignInClick} // Use the updated handler for sign in
            className="w-full flex justify-center items-center py-2"
          >
            <span className="text-gray-500 hover:text-gray-800 transition-colors duration-200 text-sm font-normal">
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

// It's good practice to have a main App component if this is the entry point,
// or ensure this component is correctly imported and used within a Router context.
// For this example, I'm assuming ForgeFitWelcome is part of a larger app with routing.

// If this were the main app file, you might have something like this:
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<ForgeFitWelcome />} />
//         <Route path="/register" element={<div>Register Page Placeholder</div>} />
//         <Route path="/login" element={<div>Login Page Placeholder</div>} />
//         {/* Add other routes here */}
//       </Routes>
//     </Router>
//   );
// };
//
// export default App;

// Exporting ForgeFitWelcome as default as per the original structure.
export default ForgeFitWelcome;