"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./providers";

const protectedPaths = ["/community/post", "/items/post"];

const publicPaths = ["/login", "/auth/signup"];

export default function RouteGuard({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const path = pathname.split("?")[0];

  const isProtectedRoute = protectedPaths.some(
    (route) =>
      path === route || (path.startsWith(route + "/") && route !== "/"),
  );
  
  const isPublicRoute = publicPaths.some(
    (route) =>
      path === route || (path.startsWith(route + "/") && route !== "/"),
  );

  const shouldRedirect =
    !isAuthLoading &&
    ((isProtectedRoute && !user) || (isPublicRoute && !!user));

  useEffect(() => {
    if (isProtectedRoute && !user) {
      router.replace("/login");
    } else if (isPublicRoute && user) {
      router.replace("/items");
    }
  }, [user, isProtectedRoute, isPublicRoute, router]);

  if (isAuthLoading || shouldRedirect) return null;

  return children;
}
