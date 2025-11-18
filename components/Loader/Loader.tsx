"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TailSpin } from "react-loader-spinner";
import styles from "./Loader.module.css";

export default function Loader() {
  const [mounted, setMounted] = useState(false);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setRoot(document.getElementById("loader-root"));
  }, []);

  if (!mounted || !root) return null;

  return createPortal(
    <div className={styles.overlay}>
      <TailSpin
        visible
        height={80}
        width={80}
        color="var(--royal-blue-lighter)"
        ariaLabel="tail-spin-loading"
      />
    </div>,
    root
  );
}
