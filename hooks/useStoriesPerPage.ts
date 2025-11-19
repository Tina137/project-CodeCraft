"use client";

import { useEffect, useState, useMemo } from "react";

type PerPageConfig = {
  desktop?: number; // >=1440
  tablet?: number; // 768–1439
  mobile?: number; // <768
};

const DEFAULT_CONFIG: Required<PerPageConfig> = {
  desktop: 6,
  tablet: 4,
  mobile: 4,
};

export function useStoriesPerPage(config?: PerPageConfig) {
  const settings = useMemo<Required<PerPageConfig>>(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
    }),
    [config?.desktop, config?.tablet, config?.mobile]
  );

  const [perPage, setPerPage] = useState(settings.desktop);

  useEffect(() => {
    const calculatePerPage = () => {
      const width = window.innerWidth;

      if (width >= 1440) {
        setPerPage(settings.desktop);
      } else if (width >= 768) {
        setPerPage(settings.tablet);
      } else {
        setPerPage(settings.mobile);
      }
    };

    calculatePerPage();

    window.addEventListener("resize", calculatePerPage);

    return () => {
      window.removeEventListener("resize", calculatePerPage);
    };
  }, [settings]);

  return perPage;
}
