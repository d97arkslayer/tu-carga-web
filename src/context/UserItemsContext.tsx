import React, { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../services/api";
import { useUserContext } from "./UserContext";

export interface UserItem {
  id: number;
  userId: number;
  category: string;
  issueDate: string;
  expiryDate: string;
  itemIdentifier: string;
  licenseCategory: string;
  vehicleType: string;
  createdAt: string;
  updatedAt: string;
}

interface UserItemsContextType {
  userItems: UserItem[] | null;
  isLoading: boolean;
  error: string | null;
}

const UserItemsContext = createContext<UserItemsContextType | undefined>(
  undefined,
);

export const UserItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: userLoading } = useUserContext();
  const [userItems, setUserItems] = useState<UserItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user || userLoading) return;
      try {
        const response = await userAPI.getUserItems(user.id);
        if (response.success) {
          setUserItems(response.data);
        } else {
          setError("Failed to load user items");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load user items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserItems();
  }, [user, userLoading]);

  return (
    <UserItemsContext.Provider value={{ userItems, isLoading, error }}>
      {children}
    </UserItemsContext.Provider>
  );
};

export const useUserItemsContext = () => {
  const context = useContext(UserItemsContext);
  if (!context) {
    throw new Error(
      "useUserItemsContext must be used within a UserItemsProvider",
    );
  }
  return context;
};
