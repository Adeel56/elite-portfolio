"use client";

import { GlobalArbitrationProvider } from "./GlobalArbitrationProvider";
import { LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <GlobalArbitrationProvider>
        {children}
      </GlobalArbitrationProvider>
    </LazyMotion>
  );
}
