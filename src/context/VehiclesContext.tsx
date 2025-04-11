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
}

interface VehiclesContextType {
  vehicles: Vehicle[] | null;
  isLoading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
  setSelectedVehicleByPlate: (plate: string) => void;
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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await userAPI.getUserVehicles();
        if (response.success) {
          const mappedVehicles: Vehicle[] = response.data.map(
            (vehicle: any) => ({
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
            }),
          );
          setVehicles(mappedVehicles);
          setSelectedVehicle(mappedVehicles[0] || null); // Set the first vehicle as default
        } else {
          setError("Failed to load vehicles");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load vehicles");
      } finally {
        setIsLoading(false);
      }
    };

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
