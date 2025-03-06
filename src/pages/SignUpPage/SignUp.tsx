import React from "react";

const SignUp: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/2">
        <img
          src="/path/to/your/image.jpg"
          alt="Description"
          className="h-full object-cover"
        />
      </div>
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        <header className="w-full bg-black text-white flex justify-center py-4">
          <img src="/assets/images/logo.svg" alt="Logo" className="h-10" />
        </header>
        <div className="flex flex-col space-y-4 mt-10">
          <button className="bg-[#C4F439] text-white rounded-full px-6 py-2">
            Iniciar sesión
          </button>
          <button className="bg-black text-white rounded-full px-6 py-2">
            Otro botón
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
