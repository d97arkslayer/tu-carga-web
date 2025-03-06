import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";

const EmailVerifiedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="-mx-8 -mt-8 mb-8 overflow-hidden rounded-t-3xl">
          <Header />
        </div>
        <div className="mt-8 space-y-6 flex flex-col items-center">
          {/* Check Icon */}
          <div className="text-green-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Text */}
          <h2 className="text-2xl font-bold text-center">
            ¡Cuenta recuperada!
          </h2>

          <div className="text-center">
            <p className="mt-2 text-gray-600">
              Usa tu nueva contraseña para ingresar
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl mt-6"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
