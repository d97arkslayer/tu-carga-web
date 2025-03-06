import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import homeImage from "../../assets/images/home.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex">
      {/* Left Column - Image */}
      <div className="w-1/2 relative">
        <img
          src={homeImage}
          alt="Logistics Services"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Column - Header and Buttons */}
      <div className="w-1/2 flex flex-col">
        {/* Header at the top */}
        <Header />

        {/* Content area with buttons */}
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="space-y-6 w-full max-w-xs">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-black border border-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-3xl"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
