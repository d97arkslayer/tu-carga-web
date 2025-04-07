// src/components/dashboard/Header/Header.tsx
import React, { useState } from "react";
import { COLORS } from "../../../utils/constants";
import { FaUserCircle } from "react-icons/fa";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleMenuItemClick = (action: string) => {
    // Handle different actions
    switch (action) {
      case "logout":
        console.log("Logout clicked");
        navigate("/login");
        // Implement logout functionality
        break;
      case "vehicle":
        console.log("Vehicle information clicked");
        // Navigate to vehicle page or show info
        break;
      case "maintenance":
        console.log("Maintenance report clicked");
        // Navigate to maintenance page or show report
        break;
    }

    // Close modal after any action
    setShowModal(false);
  };

  return (
    <header
      className="w-full relative"
      style={{ backgroundColor: COLORS.black }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <img
          src={"https://www.tucarga.com.co/logo.png"}
          alt="TuCarga Logo"
          className="h-10"
        />
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={toggleModal}
        >
          <span className="text-white font-semibold">Esteban Herrera</span>
          {/* @ts-ignore */}
          <FaUserCircle color={COLORS.primary} size={32} />
        </div>
      </div>

      {showModal && (
        <ProfileModal
          username="Esteban Herrera"
          onClose={() => setShowModal(false)}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
    </header>
  );
};

export default Header;
