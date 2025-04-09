export interface User {
  id: number;
  name: string;
  email: string;
  lastName: string;
  phone: string;
  vehicles: Vehicle[];
}

export interface Vehicle {
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
  registrationDate: string; // ISO date string
  from: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
