"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Keep deliberate section links, but start ordinary page visits at the top.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = requestAnimationFrame(() => {
      if (!window.location.hash)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
