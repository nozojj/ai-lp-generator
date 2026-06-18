"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function AIOrb() {
  const mesh = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.rotation.y += 0.003;

    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;

    ring.current.rotation.z += 0.005;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
      <group>
        {/* AI Orb */}
        <mesh ref={mesh}>
          <sphereGeometry args={[2,64,64]} />

          <meshPhysicalMaterial
            color="#3b82f6"
            roughness={0}
            metalness={0.2}
            transmission={1}
            thickness={2}
            emissive="#38bdf8"
            emissiveIntensity={5}
          />
        </mesh>

        {/* Ring */}
        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.03, 32, 200]} />

          <meshBasicMaterial color="#22d3ee" />
        </mesh>

        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.8, 0.03, 32, 200]} />

          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[1.8, 0.03, 32, 200]} />

          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>
    </Float>
  );
}
