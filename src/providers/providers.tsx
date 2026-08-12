"use client";

import { authService } from "@/lib/authService";
import { userService } from "@/lib/userService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import RouteGuard from "./RouteGuard";

type User = {
  id: number;
  nickName: string;
  email: string;
  image: string | null;
  provider: string | null;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

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

function setCachedUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("cachedUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("cachedUser");
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useLayoutEffect(() => {
    const cached = getCachedUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage (external store) once before paint, without causing an SSR/client mismatch
    if (cached) setUser(cached);
  }, []);

  const applyUser = (data: User | null) => {
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

  const logout = () => {
    authService.logout();
    applyUser(null);
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
        logout,
        refreshUser: getUser,
      }}
    >
      <RouteGuard>{children}</RouteGuard>
    </AuthContext.Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
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
