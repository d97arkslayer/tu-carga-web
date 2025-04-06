import React from "react";
import { COLORS } from "../../../utils/constants";
import { FaUserCircle } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="w-full" style={{ backgroundColor: COLORS.black }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <img
          src={"https://www.tucarga.com.co/logo.png"}
          alt="TuCarga Logo"
          className="h-10"
        />
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="text-white font-semibold">Esteban Herrera</span>
          {/* @ts-ignore */}
          <FaUserCircle color={COLORS.primary} size={32} />
        </div>
      </div>
    </header>
  );
};

export default Header;
