"use client";

import { setupSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setAuth = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    (async () => {
      try {
        const sessionValid = await setupSession();
        if (sessionValid) {
          const user = await getMe();
          setAuth(user);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
        clearAuth();
      }
    })();
  }, [clearAuth, setAuth]);

  return children;
};

export default AuthProvider;
