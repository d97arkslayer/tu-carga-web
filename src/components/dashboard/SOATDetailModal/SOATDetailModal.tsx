// src/components/dashboard/SOATDetailModal/SOATDetailModal.tsx
import React, { useState } from "react";
import { COLORS } from "../../../utils/constants";
import { FaTimes } from "react-icons/fa";
import SoatIcon from "../../../assets/icons/soat.png";
import { quoteSOATService } from "../../../services/whatsappService";
import AddSOATModal from "../AddSOATModal/AddSOATModal";
import { useVehiclesContext } from "../../../context/VehiclesContext";

interface SOATDetailModalProps {
  onClose: (shouldRefresh?: boolean) => void;
  status: string;
  expirationDate: string;
  issueDate: string;
  policyNumber: string;
  licensePlate: string;
  vehicleId: number;
}

const SOATDetailModal: React.FC<SOATDetailModalProps> = ({
  onClose,
  status,
  expirationDate,
  issueDate,
  policyNumber,
  licensePlate,
  vehicleId,
}) => {
  const { refreshVehicles } = useVehiclesContext();
  const [reminders, setReminders] = useState({
    oneDay: false,
    oneWeek: false,
    oneMonth: false,
  });

  const [showAddSOATModal, setShowAddSOATModal] = useState(false);
  const [soatUpdated, setSoatUpdated] = useState(false);

  // New: status colors mapping (consistent with Card)
  const statusColors: Record<string, string> = {
    Vigente: COLORS.green,
    "Prox. vencer": COLORS.orange,
    "Sin informacion": COLORS.red,
    Vencido: COLORS.red,
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Cerrar con refreshVehicles si se actualizó el SOAT
      onClose(soatUpdated);
    }
  };

  const handleQuoteClick = (licensePlate: string) => {
    quoteSOATService(licensePlate);
  };

  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddSOATClick = () => {
    setShowAddSOATModal(true);
  };

  const handleAddSOATClose = async (wasSuccessful = false) => {
    setShowAddSOATModal(false);

    if (wasSuccessful) {
      console.log("SOAT guardado exitosamente, actualizando estado");
      setSoatUpdated(true);

      // Cerrar ambos modales y refrescar
      // Importante: señalamos que se necesita refrescar
      onClose(true);
    }
  };

  const handleModalClose = () => {
    // Cerrar con refreshVehicles si se actualizó el SOAT
    onClose(soatUpdated);
  };

  // Helper function to format dates to "dd month yyyy" in Spanish
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "No disponible";
    try {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "Formato de fecha inválido";
    }
  };

  if (status === "Sin informacion") {
    return (
      <>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-[20px] shadow-lg w-full max-w-2xl min-w-[500px] overflow-hidden border border-blue-100 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="px-10 py-6 flex justify-between items-center border-gray-200">
              <div className="flex items-center mt-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: "#C4F439" }}
                >
                  <img src={SoatIcon} height={24} width={24} alt="SOAT Icon" />
                </div>
                <h3 className="font-bold text-xl">Información no disponible</h3>
              </div>
              <button
                onClick={handleModalClose}
                className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
              >
                {/* @ts-ignore */}
                <FaTimes size={24} />
              </button>
            </div>
            <div className="px-10 py-6">
              <p className="mb-4">
                No tenemos esa información, por favor agrega la información para
                ver los detalles.
              </p>
              <button
                onClick={handleAddSOATClick}
                className="py-3 px-6 rounded-full font-bold transition duration-300 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: "#C4F439", color: COLORS.black }}
              >
                Agregar información
              </button>
            </div>
          </div>
        </div>

        {showAddSOATModal && (
          <AddSOATModal
            onClose={handleAddSOATClose}
            vehicleId={vehicleId}
            licensePlate={licensePlate}
          />
        )}
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-[20px] shadow-lg w-full max-w-2xl min-w-[500px] overflow-hidden border border-blue-100 transform transition-all duration-300"
        style={{
          animation: "0.3s ease-out 0s 1 normal forwards running fadeIn",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-10 py-6 flex justify-between items-center border-gray-200">
          <div className="flex items-center mt-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: "#C4F439" }}
            >
              <img src={SoatIcon} height={24} width={24} alt="SOAT Icon" />
            </div>
            <h3 className="font-bold text-xl">Seguro SOAT</h3>
          </div>
          <button
            onClick={handleModalClose}
            className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
          >
            {/* @ts-ignore */}
            <FaTimes size={24} />
          </button>
        </div>

        <div className="px-10 py-6 border-gray-200">
          {/* Horizontal layout for the first three items */}
          <div className="flex justify-between mb-4 mx-8">
            <div className="flex flex-col items-center">
              <span className="text-gray-700 mb-2">Estado SOAT</span>
              <span
                className="font-bold px-3 py-1 rounded-full text-black text-sm"
                style={{ backgroundColor: statusColors[status] }}
              >
                {status}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-700 mb-2">Vencimiento</span>
              <span className="font-bold">{formatDate(expirationDate)}</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-700 mb-2">Expedición</span>
              <span className="font-bold">{formatDate(issueDate)}</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-200 mx-8" />

          {/* Policy number below */}
          <div className="flex flex-col items-start mx-8">
            <span className="text-gray-700 mb-2">Nº Póliza SOAT</span>
            <span className="font-bold px-3 py-1 rounded-full bg-gray-200 text-sm">
              {policyNumber}
            </span>
          </div>
        </div>

        <hr className="my-4 border-gray-200 mx-16" />

        {/* Reminder Activation Section */}
        <div className="px-10 py-6 border-gray-200">
          <h4 className="font-bold mb-4 mx-8">Activar recordatorio</h4>

          <div className="space-y-4 mx-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">1 día antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${reminders.oneDay ? "bg-[#C4F439]" : "bg-gray-300"} relative`}
                onClick={() => toggleReminder("oneDay")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${reminders.oneDay ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">1 semana antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${reminders.oneWeek ? "bg-[#C4F439]" : "bg-gray-300"} relative`}
                onClick={() => toggleReminder("oneWeek")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${reminders.oneWeek ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">1 mes antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${reminders.oneMonth ? "bg-[#C4F439]" : "bg-gray-300"} relative`}
                onClick={() => toggleReminder("oneMonth")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${reminders.oneMonth ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>
        </div>
        <hr className="my-4 border-gray-200 mx-16" />
        {/* Action Button */}
        <div className="px-10 py-6">
          <div className="mx-8">
            <button
              onClick={() => handleQuoteClick(licensePlate)}
              className="py-3 px-6 rounded-full font-bold transition duration-300 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: "#C4F439", color: COLORS.black }}
            >
              Cotizar SOAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOATDetailModal;
