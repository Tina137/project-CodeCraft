"use client";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setAuth = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await checkSession();
      if (res) {
        const user = await getMe();
        setAuth(user);
      } else {
        clearAuth();
      }
    };
    fetchSession();
  }, [clearAuth, setAuth]);

  return children;
};

export default AuthProvider;