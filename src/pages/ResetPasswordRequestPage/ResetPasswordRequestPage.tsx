import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/common/Header/Header";
import homeImage from "../../assets/images/home.png";
import { authAPI } from "../../services/api";

interface RecoverPasswordFormInputs {
  email: string;
}

const RecoverPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormInputs>();

  const onSubmit: SubmitHandler<RecoverPasswordFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Call the password reset API
      await authAPI.forgotPassword(data.email);

      toast.success("Instrucciones enviadas a tu correo");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error al procesar la solicitud. Por favor intente nuevamente.",
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
                Recuperar cuenta
              </h2>
              <p className="text-center text-gray-600">
                Ingresa tu correo para recuperar la cuenta
              </p>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl disabled:opacity-70"
                >
                  {isLoading ? "Procesando..." : "Continuar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
