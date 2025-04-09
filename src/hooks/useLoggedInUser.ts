// src/hooks/useLoggedInUser.ts
import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  // Add other user properties as needed
}

export const useLoggedInUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userAPI.getLoggedInUser();
        setUser(userData ? userData : null);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading: user === undefined };
};
