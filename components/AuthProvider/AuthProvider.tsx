"use client";

import { setupSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useSavedStore } from "@/lib/store/savedStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setAuth = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearIsAuthenticated);

  const setSavedList = useSavedStore((s) => s.setSavedList);
  const setSavedLoaded = useSavedStore((s) => s.setSavedLoaded);
  const setUserId = useSavedStore((s) => s.setUserId);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionValid = await setupSession();

        if (sessionValid) {
          const user = await getMe();

          // 1️⃣ встановлюємо користувача в authStore
          setAuth(user);

          // 2️⃣ синхронізуємо savedStore
          const saved = user.savedStories ?? user.data?.savedStories ?? [];
          const uid = user._id ?? user.data?._id ?? null;

          useSavedStore.setState({
            savedList: saved,
            userId: uid,
            savedLoaded: true,
          });
        } else {
          clearAuth();
          setSavedList([]);
          setUserId(null);
          setSavedLoaded(true);
        }
      } catch (error: any) {
        clearAuth();
        setSavedLoaded(true);
      }
    };

    fetchSession();
  }, []);

  return children;
};

export default AuthProvider;
