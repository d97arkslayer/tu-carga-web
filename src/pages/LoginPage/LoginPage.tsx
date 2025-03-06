import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/common/Header/Header";
import homeImage from "../../assets/images/home.png";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password);
      login(response.token);
      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard or home page
    } catch (error: any) {
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Toast container */}
      <Toaster position="top-center" />

      {/* Left Column - Image */}
      <div className="w-1/2 relative">
        <img
          src={homeImage}
          alt="Logistics Services"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Column - Header and Form */}
      <div className="w-1/2 flex flex-col">
        {/* Header at the top */}
        <Header />

        {/* Content area with form */}
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="space-y-6 w-full max-w-xs">
            <h2 className="text-3xl font-bold mb-10">Iniciar sesión</h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 relative">
                <label htmlFor="email" className="block text-sm font-bold">
                  Correo
                </label>
                {errors.email && (
                  <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                    {errors.email.message}
                  </div>
                )}
                <input
                  id="email"
                  {...register("email", {
                    required: "Email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  className={`w-full px-3 py-2 border ${
                    errors.email
                      ? "border-red-500 rounded-3xl"
                      : "border-gray-300 rounded-3xl"
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="password" className="block text-sm font-bold">
                  Contraseña
                </label>
                {errors.password && (
                  <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                    {errors.password.message}
                  </div>
                )}
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Contraseña es requerida",
                    })}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.password
                        ? "border-red-500 rounded-3xl "
                        : "border-gray-300 rounded-3xl"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl disabled:opacity-70"
              >
                {isLoading ? "Procesando..." : "Iniciar sesión"}
              </button>

              <div className="text-center text-sm">
                <span className="text-black">Olvidaste tu contraseña? </span>
                <Link
                  to="/recover-password"
                  className="text-blue-600 hover:underline"
                >
                  Recuperar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
