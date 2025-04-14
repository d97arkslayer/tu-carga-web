import React, { useState } from "react";
import { Vehicle } from "@/types";
import { X, Trash2, ChevronDown, Plus } from "lucide-react"; // Usa lucide-react o cualquier librería de íconos

interface VehicleInformationModalProps {
  selectedVehicle: Vehicle | null;
  vehicles: Vehicle[] | null;
  setSelectedVehicleByPlate: (plate: string) => void;
  onClose: () => void;
}

const VehiclesInformationModal: React.FC<VehicleInformationModalProps> = ({
  vehicles,
  selectedVehicle,
  setSelectedVehicleByPlate,
  onClose,
}) => {
  // Handle change event for vehicle selection
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicleByPlate(e.target.value);
  };

  // Helper function to format dates to "dd month yyyy" in Spanish
  const formatDate = (dateStr: string) => {
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
  };

  // @ts-ignore
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[30px] w-full max-w-3xl mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          className="absolute top-6 right-6 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Selector de vehículo */}
        <div className="mb-8">
          <label className="block mb-2 text-sm text-gray-500">
            Selecciona un vehículo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <select
                className="appearance-none border border-gray-300 px-4 py-2 rounded-md w-full pr-10"
                value={selectedVehicle?.plate || ""}
                onChange={handleVehicleChange}
              >
                {vehicles?.map((vehicle) => (
                  <option key={vehicle.plate} value={vehicle.plate}>
                    {vehicle.line}-{vehicle.plate}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
            <button className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Datos del vehículo */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
          {[
            ["Línea", `${selectedVehicle?.line}`],
            ["Cilindraje", `${selectedVehicle?.engineDisplacement}`],
            ["Servicio", `${selectedVehicle?.serviceType}`],
            ["Motor", `${selectedVehicle?.engineId}`],
            ["VIN", `${selectedVehicle?.engineId}`],
            ["Chasis", `${selectedVehicle?.chassisId}`],
            ["Color", `${selectedVehicle?.color}`],
            ["Ocupantes", `${selectedVehicle?.passengerCapacity}`],
            ["Combustible", `${selectedVehicle?.fuelType}`],
            [
              "Fecha matrícula",
              selectedVehicle?.registrationDate
                ? formatDate(selectedVehicle.registrationDate)
                : "",
            ],
          ].map(([label, value], index) => (
            <div key={index}>
              <p className="text-gray-500">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}

          <div className="col-span-2">
            <p className="text-gray-500">Organismo de tránsito</p>
            <p className="font-semibold">
              Secretaría de Movilidad de Manizales
            </p>
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        {/* Botón agregar */}
        <div className="justify-left">
          <button className="bg-lime-300 text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-lime-400 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Agregar vehículo
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehiclesInformationModal;
