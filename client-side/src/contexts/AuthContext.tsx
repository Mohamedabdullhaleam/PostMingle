import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  register: (username: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      // Optionally fetch user profile or decode token to set user
      // For now, we just keep token as is
    }
  }, [token]);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users/register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const {
        access_token,
        id,
        username,
        email: userEmail,
      } = response.data.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify({ id, username }));
      console.log("fetched data---------", access_token, id, username, email);
      setToken(access_token);

      setUser({
        id,
        username,
        email: userEmail,
      });

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("logout-called");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ register, login, logout, isLoading, user, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
