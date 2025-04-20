// src/components/dashboard/AddSOATModal/AddSOATModal.tsx
import React, { useState } from "react";
import { COLORS } from "../../../utils/constants";
import { FaTimes } from "react-icons/fa";
import SoatIcon from "../../../assets/icons/soat.png";
import { vehicleItemsAPI } from "../../../services/api";
import { useVehiclesContext } from "../../../context/VehiclesContext";
import { set } from "react-hook-form";

interface AddSOATModalProps {
  onClose: (wasSuccessful?: boolean) => void;
  vehicleId: number;
  licensePlate: string;
}

const AddSOATModal: React.FC<AddSOATModalProps> = ({
  onClose,
  vehicleId,
  licensePlate,
}) => {
  const { refreshVehicles } = useVehiclesContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for form data
  const [formData, setFormData] = useState({
    issueDate: "",
    expirationDate: "",
    policyNumber: "",
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Crear los datos del SOAT con los nombres de campo correctos según la API
      const soatData = {
        vehicleId,
        type: "soat",
        issueDate: formData.issueDate,
        expiryDate: formData.expirationDate, // Usar expiryDate en vez de expirationDate
        itemIdentifier: formData.policyNumber,
      };

      console.log("Guardando datos del SOAT:", soatData);

      // Llamar a la API para crear el item de vehículo
      const response = await vehicleItemsAPI.createVehicleItem(soatData);
      console.log("Respuesta de la API:", response);

      // Si llegamos aquí, el SOAT se guardó correctamente

      // Forzar un tiempo de espera para asegurarnos que la API haya procesado los cambios
      // y que cualquier caché interna se haya invalidado
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Intenta refrescar los vehículos antes de cerrar para asegurar datos actualizados
      await refreshVehicles();
      console.log("Vehículos actualizados después de guardar el SOAT");

      // Esperar un momento adicional para que la UI se actualice completamente
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Notificar que se guardó exitosamente (true) para que el componente padre actualice la UI
      onClose(true);
    } catch (err: any) {
      console.error("Error al guardar SOAT:", err);
      setError(err.message || "Error al guardar la información del SOAT");
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="font-bold text-xl">Agregar SOAT</h3>
          </div>
          <button
            onClick={() => onClose()}
            className="bg-gray-100 p-2 rounded-full text-black hover:bg-gray-200 transition-colors"
          >
            {/* @ts-ignore */}
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="px-10 py-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4 mx-8">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Fecha de expedición
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Número de póliza
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300"
                  placeholder="Ingrese el número de póliza"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="px-10 py-6">
            <div className="mx-8">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-full font-bold transition duration-300 hover:opacity-90 hover:scale-105 w-full"
                style={{ backgroundColor: "#C4F439", color: COLORS.black }}
              >
                {loading ? "Guardando..." : "Guardar información"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSOATModal;
