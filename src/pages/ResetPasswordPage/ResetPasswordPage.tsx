import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/common/Header/Header";
import { authAPI } from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      // Call the reset password API
      // @ts-ignore
      await authAPI.resetPassword(token, data.password);

      toast.success("Contraseña actualizada exitosamente");
      navigate("/account-recovered");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error al actualizar la contraseña. Por favor intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <Toaster position="top-center" />

      <div className="w-full flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
            <div className="-mx-8 -mt-8 mb-8 overflow-hidden rounded-t-3xl">
              <Header />
            </div>

            <div className="mt-8 space-y-6">
              <h2 className="text-2xl font-bold text-center">
                Ingresa tu nueva contraseña
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                          ? "border-red-500 rounded-3xl"
                          : "border-gray-300 rounded-3xl"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        //@ts-ignore
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        //@ts-ignore
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold"
                  >
                    Repetir contraseña
                  </label>
                  {errors.confirmPassword && (
                    <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Repetir contraseña es requerido",
                      })}
                      className={`w-full px-3 py-2 pr-10 border ${
                        errors.confirmPassword
                          ? "border-red-500 rounded-3xl"
                          : "border-gray-300 rounded-3xl"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        //@ts-ignore
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        //@ts-ignore
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
                  {isLoading ? "Procesando..." : "Confirmar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
