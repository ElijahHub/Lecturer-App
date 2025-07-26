import { API_URL } from "@/config";
import {
  AuthContextType,
  AuthProviderProps,
  DecodedToken,
  User,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        if (storedToken) {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          const userData: User = {
            id: decodedToken._id,
            name: decodedToken.name,
            email: decodedToken.email,
          };
          setUser(userData);
          setToken(storedToken);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<{ accessToken: string }> => {
      const res = await axios.post(`${API_URL}/lecturers/login`, {
        email,
        password,
      });
      return res.data.data;
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const { forceChange, userId } = error.response.data;
        if (forceChange) {
          throw {
            type: "FORCE_PASSWORD_CHANGE",
            userId,
            message: error.response.data.message,
          };
        }
        setEmail(error.config?.data?.email);
      }
      throw new Error(
        error.response?.data?.message || "Login failed, please try again"
      );
    },
  });

  const login: AuthContextType["login"] = async ({ email, password }) => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      const decodedToken = jwtDecode<DecodedToken>(data.accessToken);
      const userData: User = {
        id: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
      };

      await SecureStore.setItemAsync("token", data.accessToken);
      setUser(userData);
      setToken(data.accessToken);
      setEmail(email);

      return { status: "success" };
    } catch (error: any) {
      if (error.type === "FORCE_PASSWORD_CHANGE") {
        return {
          status: "change-password",
          userId: error.userId,
        };
      }
      throw new Error(error.message || "Login failed, please try again");
    }
  };

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }): Promise<void> => {
      const res = await axios.post(`${API_URL}/change-password`, {
        newPassword: password,
        confirmPassword,
        email: email,
      });
      return res.data;
    },
    onSuccess: async (_, variables) => {
      const { password } = variables;

      await loginMutation.mutateAsync({
        email: email!,
        password,
      });
    },
    onError: (error: any) => {
      throw new Error(
        error.response?.data?.message ||
          "Password change failed, please try again"
      );
    },
  });

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      setToken(null);
    } catch (error) {
      throw new Error("Logout failed");
    }
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        email,
        token,
        login,
        logout,
        changePassword: changePasswordMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
