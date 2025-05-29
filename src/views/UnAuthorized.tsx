import React from "react";
import { useNavigate } from "react-router-dom";

const UnAuthorized: React.FC = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <button
        onClick={goToHome}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default UnAuthorized;
