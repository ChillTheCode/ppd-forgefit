import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import GymLanding from "./views/HomeTest";
import ForgeFitWelcome from "./views/Login";



function App() {
  return (
    <Routes>
      {/* This route structure ensures Navbar and Sidebar are always present */}
      {/* while the main content (Outlet) changes based on the nested routes. */}
      <Route
        element={
          <div className="flex flex-col h-screen"> {/* Use h-screen to make the flex container take full viewport height */}
            <Navbar />
            <div className="flex flex-grow overflow-hidden"> {/* flex-grow to make this div take remaining height */}
              <Sidebar />
              <div className="flex-grow overflow-y-auto bg-white p-4"> {/* flex-grow to make this div take remaining width, overflow-y-auto for scrolling */}
                <Outlet /> {/* This is where nested routes will render their components */}
              </div>
            </div>
          </div>
        }
      >
        {/* Only the GymLanding route is kept, rendering at the root path "/" */}
        <Route path="/" element={<GymLanding />} />

        <Route path="/login" element={<ForgeFitWelcome />} />
      </Route>
    </Routes>
  );
}

export default App;
