import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Header from "../../components/common/Header/Header";
import { authAPI } from "../../services/api";

interface VerificationFormInputs {
  code: string;
}

const VerificationCodeEmail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = location.state?.email || "";

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormInputs>();

  const resendCode = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("No hay un correo electrónico disponible");
      return;
    }

    setIsSendingCode(true);
    try {
      await authAPI.sendVerificationCode(email);
      toast.success("Código reenviado exitosamente");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error al enviar el código. Por favor intente nuevamente.",
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Add this handler function to your component
  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/[^\d]/g, "").split("").slice(0, 6);

    if (digits.length > 0) {
      const newCode = [...code];

      // Fill from the current position
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });

      setCode(newCode);

      // Focus on appropriate field
      const nextIndex = Math.min(index + digits.length, 5);
      if (nextIndex < 6) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const onSubmit: SubmitHandler<VerificationFormInputs> = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Por favor ingresa el código completo");
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.verifyCode(email, verificationCode);
      toast.success("Código verificado exitosamente");
      navigate("/email-verified");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Error al verificar el código. Por favor intente nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="-mx-8 -mt-8 mb-8 overflow-hidden rounded-t-3xl">
          <Header />
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Verificación cuenta</h2>
            <p className="mt-2 text-gray-600">
              Hemos enviado un código de confirmación de 6 dígitos a tu correo
              electrónico
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e, index)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-3 px-6 rounded-3xl disabled:opacity-70"
            >
              {isLoading ? "Procesando..." : "Verificar"}
            </button>

            <div className="text-center text-sm">
              <span className="text-black">No recibiste el código? </span>
              <button
                onClick={resendCode}
                className="text-blue-600 hover:underline"
              >
                Reenviar código
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeEmail;
