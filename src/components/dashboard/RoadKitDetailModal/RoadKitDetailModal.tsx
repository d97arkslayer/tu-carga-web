import React, { useState, useEffect } from "react";
import { FaTimes, FaRegCalendarAlt } from "react-icons/fa";
import RoadKitIcon from "../../../assets/icons/road_kit.png";

interface RoadKitDetailModalProps {
  onClose: () => void;
  expirationDate: string;
  status?: string;
}

const RoadKitDetailModal: React.FC<RoadKitDetailModalProps> = ({
  onClose,
  expirationDate,
  status,
}) => {
  // Remove state for date as the expiration is read-only
  // const [date, setDate] = useState(expirationDate || "28 Diciembre 2024");
  const [reminders, setReminders] = useState({
    oneDay: false,
    oneWeek: false,
    oneMonth: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // matches the transition duration
  };

  // Handle backdrop click for the "Sin información" modal variant.
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // If expirationDate is undefined, null, or empty, show "Sin información" modal.
  if (status === "Sin informacion") {
    return (
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
                <img
                  src={RoadKitIcon}
                  height={24}
                  width={24}
                  alt="RoadKit Icon"
                />
              </div>
              <h3 className="font-bold text-xl">Información no disponible</h3>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
            >
              {/*@ts-ignore*/}
              <FaTimes size={24} />
            </button>
          </div>
          <div className="px-10 py-6">
            <p className="mb-4">
              No tenemos esa información, por favor agrega la información para
              ver los detalles.
            </p>
            <button
              className="py-3 px-6 rounded-full font-bold transition duration-300 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: "#C4F439", color: "#000" }}
            >
              Agregar información
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-[20px] shadow-lg w-full max-w-2xl min-w-[500px] overflow-hidden border border-blue-100 p-6 transition-transform duration-300 transform ${isVisible ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-10 py-6 flex justify-between items-center border-gray-200">
          <div className="flex items-center mt-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: "#C4F439" }}
            >
              {/*@ts-ignore*/}
              <img src={RoadKitIcon} height={24} width={24} />
            </div>
            <h3 className="font-bold text-xl text-black">Kit de carretera</h3>
          </div>
          <button
            onClick={handleClose}
            className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
          >
            {/*@ts-ignore*/}
            <FaTimes size={24} />
          </button>
        </div>
        {/* Expiration Date Section */}
        <div className="mb-8 mt-6 mb-4 mx-8">
          <p className="text-black font-medium mb-2">
            Vencimiento kit carretera
          </p>
          <div className="relative w-3/5">
            <span className="w-full rounded-full border border-gray-300 py-2 pl-3 pr-10 block">
              {expirationDate}
            </span>
            {/*@ts-ignore*/}
            <FaRegCalendarAlt
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
          </div>
        </div>
        {/* Divider */}
        <div className="flex justify-center my-4">
          <hr className="w-[90%] border-gray-200" />
        </div>
        {/* Reminder Activation Section */}
        <div className="mb-6 mb-4 mx-8">
          <h4 className="font-bold text-black mb-4">Activar recordatorio</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-black">1 día antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${
                  reminders.oneDay ? "bg-[#C4F439]" : "bg-gray-300"
                } relative`}
                onClick={() => toggleReminder("oneDay")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                    reminders.oneDay ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">1 semana antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${
                  reminders.oneWeek ? "bg-[#C4F439]" : "bg-gray-300"
                } relative`}
                onClick={() => toggleReminder("oneWeek")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                    reminders.oneWeek ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black">1 mes antes de vencer</span>
              <button
                className={`w-12 h-6 rounded-full ${
                  reminders.oneMonth ? "bg-[#C4F439]" : "bg-gray-300"
                } relative`}
                onClick={() => toggleReminder("oneMonth")}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transform transition-all ${
                    reminders.oneMonth ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Divider */}
        <div className="flex justify-center mb-24">
          <hr className="w-[90%] border-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default RoadKitDetailModal;
