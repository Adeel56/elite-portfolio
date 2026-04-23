"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Profile } from "@/lib/content";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export function Hero({ profile }: { profile?: Profile | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-20deg", "20deg"]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen flex items-center justify-between z-10 px-6 md:px-24 overflow-hidden perspective-[1200px]"
    >
      <m.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-start max-w-3xl z-30 pointer-events-none"
      >
        <m.span variants={item} className="font-mono text-muted mb-6 tracking-widest text-sm uppercase">
          {">"} {profile?.role || "AI & Full-Stack Engineer"}
        </m.span>
        <m.h1 variants={item} className="text-6xl md:text-[7rem] font-bold tracking-tighter text-foreground leading-[1.05] mb-12">
          {profile?.name ? (
            <>
              Hi, I'm <br />
              <span className="text-accent">{profile.name}.</span>
            </>
          ) : (
            <>
              Architecting<br />
              <span className="text-muted">Digital Reality.</span>
            </>
          )}
        </m.h1>
        
        <m.div variants={item} className="pointer-events-auto">
          <MagneticButton>
            <span className="px-6 py-3 block">Explore the Architecture</span>
          </MagneticButton>
        </m.div>
      </m.div>

      {/* Otherworldly 3D Portrait Projection */}
      {profile?.photoUrl && (
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[35vw] h-[55vh] max-w-xl z-20 hidden lg:block pointer-events-none">
          <m.div 
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* The 3D Wireframe Cage */}
            <m.div 
              animate={{ rotateY: 360, rotateZ: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ transformStyle: "preserve-3d" }}
              className="absolute inset-0 flex items-center justify-center opacity-20"
            >
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ transform: `rotateY(${i * 60}deg) translateZ(250px)` }}
                  className="absolute w-[2px] h-[400px] bg-accent"
                />
              ))}
              <div className="absolute w-[500px] h-[500px] border-2 border-accent rounded-full opacity-40" />
            </m.div>

            {/* Floating Energy Particles (Client-Side Only to prevent hydration mismatch) */}
            {mounted && [...Array(12)].map((_, i) => (
              <m.div
                key={i}
                animate={{ 
                  y: [0, -40, 0],
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  transform: `translateZ(${Math.random() * 200 - 100}px)` 
                }}
                className="absolute w-1 h-1 bg-accent rounded-full z-10"
              />
            ))}

            {/* Core Image Hologram */}
            <div 
              style={{ transform: "translateZ(100px)" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="absolute w-48 h-48 bg-accent/20 blur-[100px] rounded-full" />
              
              {/* RGB Ghosting Layers for 'Otherworldly' glitch feel */}
              <m.img 
                src={profile.photoUrl} 
                alt="" 
                animate={{ 
                  x: [-5, 5, -5], 
                  y: [-3, 3, -3],
                  opacity: [0.15, 0.3, 0.15] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-[85%] h-[85%] object-contain mix-blend-screen filter hue-rotate-90 brightness-150 grayscale"
              />
              
              <img 
                src={profile.photoUrl} 
                alt={profile.name || "Profile Portrait"} 
                className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_40px_rgba(204,255,0,0.4)] relative z-20 filter contrast-[1.2] brightness-[1.1]"
              />
              
              {/* Scanning Plane */}
              <m.div 
                animate={{ rotateX: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-[1px] bg-accent/60 shadow-[0_0_15px_#CCFF00] z-30 opacity-40"
              />
            </div>

            {/* Floating Label */}
            <m.div 
              style={{ transform: "translateZ(150px)" }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-accent flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 border border-accent/30 whitespace-nowrap"
            >
              <span className="w-2 h-2 bg-accent animate-pulse" />
              {profile.name?.toUpperCase() || "USER_UNKNOWN"} // {profile.role?.toUpperCase() || "CORE_OPERATOR"}
            </m.div>
          </m.div>
        </div>
      )}
    </section>
  );
}
