"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./providers";

const protectedPaths = ["/post"];

const publicPaths = ["/login", "/auth/signup"];

export default function RouteGuard({ children }) {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    const path = pathname.split("?")[0];

    const isProtectedRoute = protectedPaths.some(
      (route) => path === route || (path.startsWith(route + "/") && route !== "/"),
    );

    const isPublicRoute = publicPaths.some(
      (route) => path === route || (path.startsWith(route + "/") && route !== "/"),
    );

    if (isProtectedRoute && !user) {
      router.replace("/login");
    } else if (isPublicRoute && user) {
      router.replace("/items");
    } else {
      setIsLoading(false);
    }
  }, [user, pathname, router, isAuthLoading]);

  if (isLoading) return null;

  return children;
}
