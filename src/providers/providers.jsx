"use client";

import { authService } from "@/lib/authService";
import { userService } from "@/lib/userService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import RouteGuard from "./RouteGuard";

const AuthContext = createContext({
  user: null,
  isAuthLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  register: () => {},
  refreshUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

function getCachedUser() {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem("cachedUser");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("cachedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("cachedUser");
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useLayoutEffect(() => {
    const cached = getCachedUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage (external store) once before paint, without causing an SSR/client mismatch
    if (cached) setUser(cached);
  }, []);

  const applyUser = (data) => {
    setUser(data);
    setCachedUser(data);
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const data = await userService.getMe();
      applyUser(data);
    } catch {
      applyUser(null);
    }
  };

  const login = async (email, password) => {
    await authService.login(email, password);
    await getUser();
  };

  const logout = () => {
    authService.logout();
    applyUser(null);
  };

  const register = (formData) => authService.register(formData);

  const updateUser = async (data) => {
    const updatedUser = await userService.updateMe(data);
    applyUser(updatedUser);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authCheck = token
      ? userService
          .getMe()
          .then(applyUser)
          .catch(() => applyUser(null))
      : Promise.resolve();
    authCheck.finally(() => setIsAuthLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        login,
        logout,
        updateUser,
        register,
        refreshUser: getUser,
      }}
    >
      <RouteGuard>{children}</RouteGuard>
    </AuthContext.Provider>
  );
}

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
