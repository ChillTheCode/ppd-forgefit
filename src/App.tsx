import { Routes, Route, Outlet, useNavigate } from "react-router-dom"; // Added useNavigate for potential future use
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GymLanding from "./views/HomeTest";
import ForgeFitWelcomePage from "./views/Login"; // Renamed to avoid conflict if Login.tsx is the component name
import ForgeFitRegisterPage from "./views/Register"; // Renamed
import LoginPageComponent from "./views/RealLogin"; // Renamed
import ForgeFitMainDashboard from "./views/MainAfterLogin";

// Placeholder components for Navbar and Sidebar if you don't have them yet
// You can replace these with your actual components.
// const Navbar = () => <nav className="bg-gray-800 text-white p-4 w-full">Navbar</nav>;
// const Sidebar = () => <aside className="bg-gray-200 w-64 p-4">Sidebar</aside>;

// Placeholder view components - replace with your actual imports
// const GymLanding = () => <div className="p-4">Gym Landing Page Content</div>;
// const ForgeFitWelcomePage = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="p-4">
//       ForgeFit Welcome Page
//       <button onClick={() => navigate('/register')} className="ml-4 p-2 bg-blue-500 text-white rounded">Go to Register</button>
//       <button onClick={() => navigate('/login')} className="ml-4 p-2 bg-green-500 text-white rounded">Go to Login</button>
//     </div>
//   );
// };
// const ForgeFitRegisterPage = () => <div className="p-4">ForgeFit Register Page</div>;
// const LoginPageComponent = () => <div className="p-4">Login Page</div>;


function App() {
  return (
    <Routes>
      {/* This route structure defines a layout with Navbar and Sidebar.
        The <Outlet /> component renders the matched child route's element.
      */}
      <Route
        element={
          // Outermost container: full height and now explicitly full width.
          <div className="flex flex-col h-screen w-full bg-gray-100"> {/* Added w-full and a light bg for visual clarity */}
            <Navbar />
            {/* Container for Sidebar and main content area */}
            {/* flex-grow makes this div take remaining vertical space */}
            {/* overflow-hidden can be useful to prevent unexpected scrollbars from children */}
            <div className="flex flex-grow overflow-hidden">
              <Sidebar />
              {/* Main content area */}
              {/* flex-grow makes this div take remaining horizontal space */}
              {/* overflow-y-auto allows scrolling only for this content area if needed */}
              {/* p-4 provides padding inside the content area */}
              <div className="flex-grow overflow-y-auto bg-white p-4">
                <Outlet /> {/* Nested routes will render their components here */}
              </div>
            </div>
          </div>
        }
      >
        {/* Child routes that will render within the Outlet of the layout above */}
        <Route path="/" element={<GymLanding />} />
        <Route path="/getstarted" element={<ForgeFitWelcomePage />} />
        <Route path="/register" element={<ForgeFitRegisterPage />} />
        <Route path="/login" element={<LoginPageComponent />} />

        <Route path="/dashboard" element={<ForgeFitMainDashboard />} />
        
        
        {/* Example of a route that does NOT use the main layout */}
        {/* You could add more top-level <Route> elements here if some pages
            should not have the Navbar and Sidebar. For example:
            <Route path="/standalone" element={<StandalonePage />} /> 
        */}
      </Route>
    </Routes>
  );
}

export default App;