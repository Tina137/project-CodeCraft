"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return (
    <>
    <Toaster 
        position="top-center" 
        toastOptions={{ duration: 5000 }}
      />
    {loading ? <div>Loading...</div> : children}
    </>
  );
}
