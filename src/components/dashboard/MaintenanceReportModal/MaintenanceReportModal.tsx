import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import MaintainIcon from "../../../assets/icons/maintain.png";
import { useVehiclesContext } from "../../../context/VehiclesContext";

interface MaintenanceReportModalProps {
  onClose: () => void;
}

// Interfaz para los registros de mantenimiento formateados
interface MaintenanceRecord {
  description: string;
  valor: string;
  kilometraje: string;
  fecha: string;
  rawDate: Date; // Para ordenar por fecha
}

const MaintenanceReportModal: React.FC<MaintenanceReportModalProps> = ({
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    vehicles,
    selectedVehicle,
    setSelectedVehicleByPlate,
    refreshVehicles,
  } = useVehiclesContext();

  // Call refreshVehicles when component mounts
  useEffect(() => {
    refreshVehicles();
    // No dependencies array para que se ejecute solo al montar
  }, []);

  // Formatting function for dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Animation effect when mounting
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // matches the transition duration
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle vehicle selection change
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicleByPlate(e.target.value);
  };

  // Format number with thousands separator
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  // Get all maintenance records from the selected vehicle
  const getMaintenanceRecords = () => {
    if (!selectedVehicle || !selectedVehicle.maintenances) {
      return [];
    }

    const records: MaintenanceRecord[] = selectedVehicle.maintenances.flatMap(
      (maintenance) => {
        // For oil changes
        if (maintenance.type === "oil_change" && maintenance.oilChange) {
          return [
            {
              description: "Aceite",
              valor: `$${formatNumber(maintenance.price)}`,
              kilometraje: `${formatNumber(maintenance.oilChange.currentMileage)} km`,
              fecha: formatDate(maintenance.createdAt),
              rawDate: new Date(maintenance.createdAt),
            },
          ];
        }

        // For tire changes
        if (maintenance.type === "tire_change" && maintenance.tireChange) {
          const mileage = maintenance.tireChange.currentMileage
            ? `${formatNumber(maintenance.tireChange.currentMileage)} km`
            : "10.000 km"; // Fallback to default if no mileage available

          return [
            {
              description: "Llantas",
              valor: `N/A`,
              kilometraje: mileage,
              fecha: formatDate(maintenance.createdAt),
              rawDate: new Date(maintenance.createdAt),
            },
          ];
        }

        // For other maintenance items
        if (maintenance.type === "other" && maintenance.maintenanceItems) {
          return maintenance.maintenanceItems.map((item) => ({
            description: item.description,
            valor: `$${formatNumber(item.price)}`,
            kilometraje: item.currentMileage
              ? `${formatNumber(item.currentMileage)} km`
              : "N/A",
            fecha: formatDate(maintenance.createdAt),
            rawDate: new Date(maintenance.createdAt),
          }));
        }

        return [];
      },
    );

    // Sort records by date in descending order (most recent first)
    return records.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  };

  const maintenanceRecords = getMaintenanceRecords();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-[20px] shadow-lg w-full max-w-4xl min-w-[700px] overflow-hidden border border-blue-100 transform transition-transform duration-300"
        style={{
          transform: isVisible ? "scale(100%)" : "scale(95%)",
          height: "80vh",
          maxHeight: "800px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center px-10 py-8">
          <div className="flex items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mr-5"
              style={{ backgroundColor: "#C4F439" }}
            >
              <img
                src={MaintainIcon}
                height={32}
                width={32}
                alt="Maintenance Icon"
              />
            </div>
            <h3 className="font-bold text-2xl">Reporte mantenimiento</h3>
          </div>
          <div className="flex items-center">
            <div className="mr-4 relative">
              <select
                className="border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring focus:border-lime-300 bg-white text-lg pr-10 appearance-none"
                value={selectedVehicle?.plate || ""}
                onChange={handleVehicleChange}
              >
                {vehicles?.map((vehicle) => (
                  <option key={vehicle.plate} value={vehicle.plate}>
                    {vehicle.make} {vehicle.year} - {vehicle.plate}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-gray-600"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="bg-gray-100 p-3 rounded-full text-black hover:bg-gray-200 transition-colors"
            >
              {/* @ts-ignore */}
              <FaTimes size={28} />
            </button>
          </div>
        </div>

        {/* Maintenance Report Table */}
        <div
          className="px-10 py-6 overflow-auto"
          style={{ maxHeight: "calc(80vh - 160px)" }}
        >
          <div className="overflow-hidden rounded-[15px] shadow-md">
            {/* Headers */}
            <div className="bg-lime-300 grid grid-cols-4 p-5 rounded-t-[15px] text-lg">
              <div className="font-medium">Descripción</div>
              <div className="font-medium">Valor</div>
              <div className="font-medium">Kilometraje</div>
              <div className="font-medium">Fecha</div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-gray-200">
              {maintenanceRecords.length > 0 ? (
                maintenanceRecords.map((record, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 p-5 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} text-lg`}
                  >
                    <div>{record.description}</div>
                    <div>{record.valor}</div>
                    <div>{record.kilometraje}</div>
                    <div>{record.fecha}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-lg">
                  No hay registros de mantenimiento para este vehículo
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReportModal;
