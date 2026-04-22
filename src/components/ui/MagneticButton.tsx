"use client";

import { m } from "framer-motion";
import { useRef, useState } from "react";
import { useArbitration } from "@/providers/GlobalArbitrationProvider";
import { cn } from "@/lib/utils";

export function MagneticButton({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setIntent, clearIntent } = useArbitration();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    clearIntent("magnetic-btn");
  };

  const handleMouseEnter = () => {
    setIntent("hover", "magnetic-btn"); // Registers direct intent
  };

  return (
    <m.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={handleMouseEnter}
      onClick={() => {
        setIntent("navigation", "magnetic-btn");
        onClick?.();
        setTimeout(() => clearIntent("magnetic-btn"), 500); // V5 Decay
      }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }} // UI Fast Spring
      className={cn(
        "relative px-8 py-4 bg-accent text-black font-mono font-bold uppercase tracking-widest text-sm",
        "transition-colors hover:bg-white",
        "z-50",
        className
      )}
    >
      {children}
    </m.button>
  );
}
