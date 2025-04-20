import React, { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../services/api";

interface VehicleItem {
  id: number;
  vehicleId: number;
  type: string;
  issueDate: string;
  expiryDate: string | null;
  itemIdentifier: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

interface OilChange {
  maintenanceId: number;
  currentMileage: number;
  nextMileage: number;
  createdAt: string;
  updatedAt: string;
}

interface TireChange {
  maintenanceId: number;
  lastChangeDate: string;
  nextChangeDate: string;
  currentMileage: number;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceItem {
  id: number;
  maintenanceId: number;
  description: string;
  price: number;
  currentMileage: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Maintenance {
  id: number;
  vehicleId: number;
  price: number;
  type: string;
  serviceCenter: string | null;
  createdAt: string;
  updatedAt: string;
  oilChange: OilChange | null;
  tireChange: TireChange | null;
  maintenanceItems: MaintenanceItem[];
}

interface Vehicle {
  id: number;
  userId: number;
  plate: string;
  make: string;
  year: number;
  dniOwner: string;
  dniOwnerType: string;
  vehicleType: string;
  line: string;
  engineDisplacement: number;
  serviceType: string;
  engineId: string;
  VIN: string;
  chassisId: string;
  color: string;
  passengerCapacity: number;
  fuelType: string;
  registrationDate: string;
  from: string;
  createdAt: string;
  updatedAt: string;
  vehicleItems: VehicleItem[];
  maintenances: Maintenance[];
}

interface VehiclesContextType {
  vehicles: Vehicle[] | null;
  isLoading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
  setSelectedVehicleByPlate: (plate: string) => void;
  refreshVehicles: () => Promise<void>; // Nueva función para refrescar los datos de vehículos
}

const VehiclesContext = createContext<VehiclesContextType | undefined>(
  undefined,
);

export const VehiclesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función extraída para poder reutilizarla
  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userAPI.getUserVehicles();
      if (response.success) {
        const mappedVehicles: Vehicle[] = response.data.map((vehicle: any) => ({
          id: vehicle.id,
          userId: vehicle.userId,
          plate: vehicle.plate,
          make: vehicle.make,
          year: vehicle.year,
          dniOwner: vehicle.dniOwner,
          dniOwnerType: vehicle.dniOwnerType,
          vehicleType: vehicle.vehicleType,
          line: vehicle.line,
          engineDisplacement: vehicle.engineDisplacement,
          serviceType: vehicle.serviceType,
          engineId: vehicle.engineId,
          VIN: vehicle.VIN,
          chassisId: vehicle.chassisId,
          color: vehicle.color,
          passengerCapacity: vehicle.passengerCapacity,
          fuelType: vehicle.fuelType,
          registrationDate: vehicle.registrationDate,
          from: vehicle.from,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          vehicleItems: vehicle.vehicleItems.map((item: any) => ({
            id: item.id,
            vehicleId: item.vehicleId,
            type: item.type,
            issueDate: item.issueDate,
            expiryDate: item.expiryDate,
            itemIdentifier: item.itemIdentifier,
            cost: item.cost,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
          maintenances: vehicle.maintenances.map((maintenance: any) => ({
            id: maintenance.id,
            vehicleId: maintenance.vehicleId,
            price: maintenance.price,
            type: maintenance.type,
            serviceCenter: maintenance.serviceCenter,
            createdAt: maintenance.createdAt,
            updatedAt: maintenance.updatedAt,
            oilChange: maintenance.oilChange
              ? {
                  maintenanceId: maintenance.oilChange.maintenanceId,
                  currentMileage: maintenance.oilChange.currentMileage,
                  nextMileage: maintenance.oilChange.nextMileage,
                  createdAt: maintenance.oilChange.createdAt,
                  updatedAt: maintenance.oilChange.updatedAt,
                }
              : null,
            tireChange: maintenance.tireChange
              ? {
                  maintenanceId: maintenance.tireChange.maintenanceId,
                  lastChangeDate: maintenance.tireChange.lastChangeDate,
                  nextChangeDate: maintenance.tireChange.nextChangeDate,
                  currentMileage: maintenance.tireChange.currentMileage,
                  createdAt: maintenance.tireChange.createdAt,
                  updatedAt: maintenance.tireChange.updatedAt,
                }
              : null,
            maintenanceItems: maintenance.maintenanceItems.map((item: any) => ({
              id: item.id,
              maintenanceId: item.maintenanceId,
              description: item.description,
              price: item.price,
              currentMileage: item.currentMileage,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            })),
          })),
        }));
        setVehicles(mappedVehicles);

        // Solo actualizamos el vehículo seleccionado si no hay uno o si no está en la nueva lista
        if (
          !selectedVehicle ||
          !mappedVehicles.find((v) => v.id === selectedVehicle.id)
        ) {
          setSelectedVehicle(mappedVehicles[0] || null);
        }
      } else {
        setError("Failed to load vehicles");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  // Función pública para refrescar los vehículos después de una actualización
  const refreshVehicles = async () => {
    const currentSelectedVehicleId = selectedVehicle?.id;
    console.log(
      "Refrescando vehículos. ID actual seleccionado:",
      currentSelectedVehicleId,
    );

    await fetchVehicles();

    // Si había un vehículo seleccionado, intentamos seleccionar el mismo después de actualizar
    if (currentSelectedVehicleId && vehicles) {
      const updatedSelectedVehicle = vehicles.find(
        (v) => v.id === currentSelectedVehicleId,
      );
      if (updatedSelectedVehicle) {
        setSelectedVehicle(updatedSelectedVehicle);
        console.log("Vehículo seleccionado actualizado con los nuevos datos");
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const setSelectedVehicleByPlate = (plate: string) => {
    if (vehicles) {
      const vehicle = vehicles.find((v) => v.plate === plate) || null;
      setSelectedVehicle(vehicle);
    }
  };

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        isLoading,
        error,
        selectedVehicle,
        setSelectedVehicleByPlate,
        refreshVehicles,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehiclesContext = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error(
      "useVehiclesContext must be used within a VehiclesProvider",
    );
  }
  return context;
};
