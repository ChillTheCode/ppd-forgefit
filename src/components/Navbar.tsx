"use client";

import React from "react";
import logoLia from "../assets/logo_lia.png";
import Profile from "../assets/profile_example.svg";
import Notification from "../assets/notification.svg";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleProfile = () => {
    if (localStorage.getItem("accessToken")) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleNotificationClick = () => {
    navigate("/api/notifikasi");
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white shadow-sm z-20">
      <div className="flex items-center" onClick={() => navigate("/")}>
        <img
          src={logoLia || "/placeholder.svg"}
          alt="Logo Lia"
          className="h-10 mr-3 cursor-pointer"
        />
        <h1 className="text-xl font-bold text-[#04548B] cursor-pointer">
          SI INVEN
        </h1>
      </div>

      <div className="flex items-center me-4">
        <button
          className="me-4 px-4 py-2 bg-[#04548B] text-white rounded hover:bg-[#03406b] transition-colors"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button className="relative me-4" onClick={handleNotificationClick}>
          <img
            src={Notification}
            alt="Notifications"
            className="h-10 w-10"
            style={{
              filter:
                "invert(27%) sepia(100%) saturate(500%) hue-rotate(160deg) brightness(90%) contrast(90%)",
            }}
          />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            2
          </span>
        </button>
        <img
          src={Profile}
          alt="Profile"
          className="h-10 w-10 rounded-full cursor-pointer me-4"
          style={{
            filter:
              "invert(27%) sepia(100%) saturate(500%) hue-rotate(160deg) brightness(90%) contrast(90%)",
          }}
          onClick={handleProfile}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleModal}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-96">
            <h2 className="text-xl font-bold mb-4 text-[#04548B]">
              Notifications
            </h2>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-md">
                <p className="font-medium">New inventory item added</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-md">
                <p className="font-medium">Stock level alert</p>
                <p className="text-sm text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-[#04548B] text-white rounded hover:bg-[#03406b] transition-colors"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
