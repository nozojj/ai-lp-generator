"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import AIOrb from "./AIOrb";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        color="#7c3aed"
        roughness={0.25}
        metalness={0.6}
        emissive="#4c1d95"
        emissiveIntensity={0.7}
      />
    </mesh>
  );
}

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        {/* <Environment preset="city" /> */}
        <pointLight position={[2, 2, 2]} color="#a855f7" intensity={8} />

        <AIOrb />

        <Stars radius={80} depth={50} count={1500} factor={4} fade />
        <Sparkles count={120} scale={7} size={4} speed={0.5} />
        <EffectComposer>
          <Bloom
            intensity={1.3}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
    </div>
  );
}
