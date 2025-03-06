import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/common/Header/Header";
import homeImage from "../../assets/images/home.png";
import { authAPI } from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SignUpFormInputs {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const acceptTerms = watch("acceptTerms", false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const downloadTermsAndConditions = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Descargando términos y condiciones...");
  };

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Format data to match expected payload
      const userData = {
        name: data.name,
        lastName: data.lastName,
        phone: `+57${data.phone}`,
        email: data.email,
        password: data.password,
      };

      // Call signup API
      await authAPI.signup(userData);
      await authAPI.sendVerificationCode(data.email);

      toast.success("¡Cuenta creada exitosamente!");
      navigate("/verification-email", { state: { email: data.email } });
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error al crear la cuenta. Por favor intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <Toaster position="top-center" />

      <div className="w-1/2 relative">
        <img
          src={homeImage}
          alt="Logistics Services"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-1/2 flex flex-col">
        <Header />

        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="space-y-6 w-full max-w-xs">
            <h2 className="text-3xl font-bold mb-10">Crear cuenta</h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 relative">
                <label htmlFor="name" className="block text-sm font-bold">
                  Nombre
                </label>
                {errors.name && (
                  <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                    {errors.name.message}
                  </div>
                )}
                <input
                  id="name"
                  {...register("name", {
                    required: "Nombre es requerido",
                  })}
                  className={`w-full px-3 py-2 border ${
                    errors.name
                      ? "border-red-500 rounded-3xl"
                      : "border-gray-300 rounded-3xl"
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="lastName" className="block text-sm font-bold">
                  Apellidos
                </label>
                {errors.lastName && (
                  <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                    {errors.lastName.message}
                  </div>
                )}
                <input
                  id="lastName"
                  {...register("lastName", {
                    required: "Apellidos es requerido",
                  })}
                  className={`w-full px-3 py-2 border ${
                    errors.lastName
                      ? "border-red-500 rounded-3xl"
                      : "border-gray-300 rounded-3xl"
                  }`}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="phone" className="block text-sm font-bold">
                  Teléfono
                </label>
                {errors.phone && (
                  <div className="absolute top-4 left-2 right-2 text-xs bg-white px-2 text-red-500 transform origin-bottom animate-[fadeIn_0.2s_ease-in-out] z-10 border-red-500 rounded-t-md">
                    {errors.phone.message}
                  </div>
                )}
                <div className="flex items-center space-x-1 px-3 py-1 bg-white rounded-3xl border border-gray-300">
                  <span role="img" aria-label="Colombia Flag">
                    🇨🇴
                  </span>
                  <span className="text-black">+57</span>
                  <span className="text-gray-300"> |</span>
                  <input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    {...register("phone", {
                      required: "Teléfono es requerido",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Teléfono inválido",
                      },
                    })}
                    className="px-3 py-1 flex-1 outline-none"
                  />
                </div>
              </div>

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
                      minLength: {
                        value: 6,
                        message: "Contraseña debe tener al menos 6 caracteres",
                      },
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
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={downloadTermsAndConditions}
                      className="text-blue-600 hover:underline"
                    >
                      Aceptar términos y condiciones
                    </button>
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      {...register("acceptTerms", { required: true })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-xs mt-1">
                      Debes aceptar los términos para continuar
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl disabled:opacity-70 mt-4"
              >
                {isLoading ? "Procesando..." : "Crear cuenta"}
              </button>

              <div className="text-center text-sm mt-4">
                <span className="text-black">Ya tienes una cuenta? </span>
                <Link to="/login" className="text-blue-600 hover:underline">
                  Iniciar sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
