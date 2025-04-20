import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Updated to your local API
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication related functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error connecting to server" };
    }
  },
  signup: async (userData: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error connecting to server" };
    }
  },
  sendVerificationCode: async (email: string) => {
    try {
      const response = await apiClient.post("/verification/send-code", {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Error sending verification code" }
      );
    }
  },
  verifyCode: async (email: string, code: string) => {
    try {
      const response = await apiClient.post("/verification/verify", {
        email,
        code,
      });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || {
          message: "Error when trying to verify the email",
        }
      );
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post("/password/forgot-password", {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Error requesting password reset" }
      );
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.post("/password/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error resetting password" };
    }
  },
};

export const userAPI = {
  getLoggedInUser: async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error fetching user data" };
    }
  },
  getUserVehicles: async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.get("/vehicles/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error fetching vehicles data" };
    }
  },
  getUserItems: async (idUser: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const response = await apiClient.get(`/user-items/user/${idUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Error fetching user items data" }
      );
    }
  },
};

// Vehicle related functions
export const vehicleAPI = {
  createVehicle: async (vehicleData: {
    plate: string;
    userId?: number;
    year: number;
    make: string;
    dniOwner: string;
    dniOwnerType: string;
    vehicleType: string;
    line: string;
    engineDisplacement: number;
    serviceType: string;
    color: string;
    passengerCapacity: number;
    fuelType: string;
    registrationDate: string;
    from: string;
    engineId?: string;
    VIN?: string;
    chassisId?: string;
  }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.post("/vehicles", vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Error creating vehicle" };
    }
  },
};

// Maintenance related functions
export const maintenanceAPI = {
  createMaintenance: async (maintenanceData: {
    vehicleId: number;
    price: number;
    type: string;
    serviceCenter: string;
    oilChange?: {
      currentMileage: number;
      nextMileage: number;
    };
    tireChange?: {
      lastChangeDate: string;
      nextChangeDate: string;
      currentMileage: number;
    };
    maintenanceItems?: Array<{
      description: string;
      price: number;
      currentMileage: number;
    }>;
  }) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.post("/maintenances", maintenanceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { message: "Error creating maintenance record" }
      );
    }
  },

  getVehicleMaintenances: async (vehicleId: number) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.get(
        `/maintenances/vehicle/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || {
          message: "Error fetching maintenance records",
        }
      );
    }
  },

  getAllMaintenances: async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.get("/maintenances", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || {
          message: "Error fetching all maintenance records",
        }
      );
    }
  },
};

// Example function to fetch data
export const fetchData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Example function to post data
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
