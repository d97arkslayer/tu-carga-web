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
