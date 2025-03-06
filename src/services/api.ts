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
