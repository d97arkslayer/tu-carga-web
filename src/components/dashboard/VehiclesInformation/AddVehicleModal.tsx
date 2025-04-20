import React, { useState, useEffect, useContext } from "react";
import { Vehicle } from "@/types";
import { X, Save, AlertCircle } from "lucide-react";
import { vehicleAPI } from "../../../services/api";
import { useUserContext } from "../../../context/UserContext";

interface AddVehicleModalProps {
  onClose: () => void;
  onSave: (
    vehicleData: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onSuccess?: () => Promise<void> | void; // Puede ser async o no
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  onClose,
  onSave,
  onSuccess,
}) => {
  const { user } = useUserContext();

  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({
    plate: "",
    userId: user?.id || 0,
    make: "",
    year: new Date().getFullYear(),
    dniOwner: "",
    dniOwnerType: "CC",
    vehicleType: "car",
    line: "",
    engineDisplacement: 0,
    serviceType: "private",
    engineId: "",
    VIN: "",
    chassisId: "",
    color: "",
    passengerCapacity: 0,
    fuelType: "gasolina",
    registrationDate: new Date().toISOString().split("T")[0],
    from: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Aseguramos que el userId se actualice si el usuario cambia
  useEffect(() => {
    if (user?.id) {
      setVehicleData((prev) => ({
        ...prev,
        userId: user.id,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]:
        name === "engineDisplacement" ||
        name === "passengerCapacity" ||
        name === "year"
          ? parseInt(value, 10)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Asegúrate de que userId está incluido
      if (!vehicleData.userId) {
        throw new Error(
          "ID de usuario no disponible. Por favor, recarga la página.",
        );
      }

      // Convertir la fecha al formato ISO para la API
      const formattedData = {
        ...vehicleData,
        registrationDate: new Date(
          vehicleData.registrationDate || "",
        ).toISOString(),
      };

      // Llamar a la API para crear el vehículo
      const response = await vehicleAPI.createVehicle(
        formattedData as Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
      );

      console.log("Vehículo creado con éxito:", response);

      // Notificar al componente padre sobre el guardado exitoso
      onSave(formattedData as Omit<Vehicle, "id" | "createdAt" | "updatedAt">);

      // Si hay una función de éxito, llamarla para refrescar la lista
      if (onSuccess) {
        // Esperar a que se complete la actualización de los vehículos
        await onSuccess();
        console.log("Lista de vehículos actualizada");
      }

      // Cerrar el modal
      onClose();
    } catch (error: any) {
      // Extraer los detalles del error de la API
      console.error("Error completo al crear vehículo:", error);

      if (error.details && Array.isArray(error.details)) {
        setErrors(error.details);
      } else {
        setErrors([
          error.message || "Ha ocurrido un error al guardar el vehículo",
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] w-full max-w-3xl mx-4 p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-6 right-6 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Agregar nuevo vehículo</h2>

        {/* Mostrar errores si existen */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error de validación</span>
            </div>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
            {/* Información básica */}
            <div>
              <label className="block mb-2 text-sm text-gray-500">Placa*</label>
              <input
                type="text"
                name="plate"
                value={vehicleData.plate}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="ABC123"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">Marca*</label>
              <input
                type="text"
                name="make"
                value={vehicleData.make}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="Toyota"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">Línea*</label>
              <input
                type="text"
                name="line"
                value={vehicleData.line}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="Corolla"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">Año*</label>
              <input
                type="number"
                name="year"
                value={vehicleData.year}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Tipo de vehículo*
              </label>
              <select
                name="vehicleType"
                value={vehicleData.vehicleType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                required
              >
                <option value="car">Automóvil</option>
                <option value="truck">Camión</option>
                <option value="motorcycle">Motocicleta</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">Color*</label>
              <input
                type="text"
                name="color"
                value={vehicleData.color}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="Blanco"
                required
              />
            </div>

            {/* Información técnica */}
            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Cilindraje*
              </label>
              <input
                type="number"
                name="engineDisplacement"
                value={vehicleData.engineDisplacement || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="1600"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Tipo de servicio*
              </label>
              <select
                name="serviceType"
                value={vehicleData.serviceType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                required
              >
                <option value="private">Particular</option>
                <option value="public">Público</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Número de motor
              </label>
              <input
                type="text"
                name="engineId"
                value={vehicleData.engineId}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="M123456"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Número VIN
              </label>
              <input
                type="text"
                name="VIN"
                value={vehicleData.VIN}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="5YFBURHE3JP759654"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Número de chasis
              </label>
              <input
                type="text"
                name="chassisId"
                value={vehicleData.chassisId}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="CH123456"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Capacidad de pasajeros*
              </label>
              <input
                type="number"
                name="passengerCapacity"
                value={vehicleData.passengerCapacity || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="5"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Tipo de combustible*
              </label>
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                required
              >
                <option value="gasolina">Gasolina</option>
                <option value="gas">Gas</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>

            {/* Información de registro */}
            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Fecha de matrícula*
              </label>
              <input
                type="date"
                name="registrationDate"
                value={vehicleData.registrationDate}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Organismo de tránsito*
              </label>
              <input
                type="text"
                name="from"
                value={vehicleData.from}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="Bogotá"
                required
              />
            </div>

            {/* Información del propietario */}
            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Documento del propietario*
              </label>
              <input
                type="text"
                name="dniOwner"
                value={vehicleData.dniOwner}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                placeholder="10123456789"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-500">
                Tipo de documento*
              </label>
              <select
                name="dniOwnerType"
                value={vehicleData.dniOwnerType}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-lime-300 w-full"
                required
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Botón guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-lime-300 text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-lime-400 inline-flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
