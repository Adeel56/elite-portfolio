"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

export type IntentLevel = "navigation" | "hover" | "scroll" | "passive";

interface ArbitrationContextType {
  currentIntent: IntentLevel;
  setIntent: (intent: IntentLevel, id: string) => void;
  clearIntent: (id: string) => void;
  fps: number;
}

const ArbitrationContext = createContext<ArbitrationContextType | null>(null);

export function GlobalArbitrationProvider({ children }: { children: React.ReactNode }) {
  const [currentIntent, setCurrentIntent] = useState<IntentLevel>("passive");
  const activeIntents = useRef<Map<string, IntentLevel>>(new Map());
  const [fps, setFps] = useState(60);

  // V5 Hysteresis Loop FPS Monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Intent Arbitration Logic (Absolute Hierarchy)
  const setIntent = useCallback((intent: IntentLevel, id: string) => {
    activeIntents.current.set(id, intent);
    evaluateIntent();
  }, []);

  const clearIntent = useCallback((id: string) => {
    activeIntents.current.delete(id);
    evaluateIntent();
  }, []);

  const evaluateIntent = () => {
    const intents = Array.from(activeIntents.current.values());
    if (intents.includes("navigation")) setCurrentIntent("navigation");
    else if (intents.includes("hover")) setCurrentIntent("hover");
    else if (intents.includes("scroll")) setCurrentIntent("scroll");
    else setCurrentIntent("passive");
  };

  // V4 Scroll Intent Global Listener
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIntent("scroll", "global-scroll");
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        clearIntent("global-scroll");
      }, 150); // Decay back to passive after scroll stops
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [setIntent, clearIntent]);

  return (
    <ArbitrationContext.Provider value={{ currentIntent, setIntent, clearIntent, fps }}>
      {children}
    </ArbitrationContext.Provider>
  );
}

export function useArbitration() {
  const context = useContext(ArbitrationContext);
  if (!context) throw new Error("useArbitration must be used within GlobalArbitrationProvider");
  return context;
}
