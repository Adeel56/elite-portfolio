"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useArbitration } from "@/providers/GlobalArbitrationProvider";
import { m } from "framer-motion";

function Particles({ count = 5000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const { currentIntent } = useArbitration();
  
  // V5 Neural Fluid Geometry (Sphere Distribution)
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, [count]);

  // V5 Conflict Resolution
  const targetSpeed = currentIntent === "hover" ? 0.05 : currentIntent === "scroll" ? 1.5 : 0.2;
  const currentSpeed = useRef(targetSpeed);
  
  const materialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state, delta) => {
    if (!points.current) return;
    
    // Smooth speed interpolation (Hysteresis/Continuity)
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, 0.1);
    
    points.current.rotation.y += delta * currentSpeed.current;
    points.current.rotation.x += delta * (currentSpeed.current * 0.5);

    // Neural fluid wave effect via positions
    const positionsAttr = points.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Organic sine wave distortion
      positionsAttr.array[ix] += Math.sin(time * 0.5 + randoms[i] * 10) * 0.01 * currentSpeed.current;
      positionsAttr.array[iy] += Math.cos(time * 0.6 + randoms[i] * 10) * 0.01 * currentSpeed.current;
      positionsAttr.array[iz] += Math.sin(time * 0.7 + randoms[i] * 10) * 0.01 * currentSpeed.current;
    }
    positionsAttr.needsUpdate = true;
    
    // Dim when hovering
    if (materialRef.current) {
      const targetOpacity = currentIntent === "hover" ? 0.1 : 0.4;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef} 
        size={0.05} 
        color="#CCFF00" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}

export function NeuralFluidCanvas() {
  const { fps } = useArbitration();
  const [particleCount, setParticleCount] = useState(5000);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Accessibility check & Hysteresis Density Scaling
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    if (fps < 45 && particleCount > 2000) setParticleCount(2000);
    if (fps >= 55 && particleCount < 5000) setParticleCount(5000);
  }, [fps, particleCount]);

  if (reducedMotion) return null;

  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-0 pointer-events-none bg-background"
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} dpr={[1, 1.5]}>
        <Particles key={particleCount} count={particleCount} />
      </Canvas>
    </m.div>
  );
}
