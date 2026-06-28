"use client";

import { authService } from "@/lib/authService";
import { userService } from "@/lib/userService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import RouteGuard from "./RouteGuard";

const AuthContext = createContext({
  user: null,
  isAuthLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  register: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const data = await userService.getMe();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    await authService.login(email, password);
    await getUser();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = (formData) => authService.register(formData);

  const updateUser = async (data) => {
    const updatedUser = await userService.updateMe(data);
    setUser(updatedUser);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authCheck = token
      ? userService.getMe().then(setUser).catch(() => setUser(null))
      : Promise.resolve();
    authCheck.finally(() => setIsAuthLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, logout, updateUser, register }}>
      <RouteGuard>{children}</RouteGuard>
    </AuthContext.Provider>
  );
}

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
