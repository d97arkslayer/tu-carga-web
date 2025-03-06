// src/components/common/Header/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-center p-12 bg-black text-white">
      <div>
        <img
          src={"https://www.tucarga.com.co/logo.png"}
          alt="TuCarga Logo"
          className="h-10"
        />
      </div>
    </header>
  );
};

export default Header;
