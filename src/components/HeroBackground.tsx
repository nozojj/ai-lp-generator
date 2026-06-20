"use client";

import { Float, Stars, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

function Scene() {
  const light = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    light.current.position.x +=
      (state.pointer.x * 3 - light.current.position.x) * 0.05;

    light.current.position.y +=
      (state.pointer.y * 2 - light.current.position.y) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.5} />

      <pointLight
        ref={light}
        position={[0, 0, 4]}
        intensity={20}
        color="#22d3ee"
      />

      <Stars radius={80} depth={40} count={4000} factor={4} fade speed={1} />

      <Sparkles
        count={200}
        scale={[15, 8, 8]}
        size={2}
        speed={0.25}
        opacity={0.8}
        color="#67e8f9"
      />

      <group position={[2.8, 1.4, 0]}>
        <FloatingOrb />
      </group>

      <EffectComposer>
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>
    </>
  );
}

function OrbitParticles() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.6;

    group.current.rotation.x = state.clock.elapsedTime * 0.15;

    group.current.children.forEach((child, index) => {
      child.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3,
      );
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.05,
              Math.sin(angle * 2) * 0.2,
              Math.sin(angle) * 1.05,
            ]}
          >
            <sphereGeometry args={[0.03, 16, 16]} />

            <meshStandardMaterial
              color="#ffffff"
              emissive="#22d3ee"
              emissiveIntensity={10}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingOrb() {
  const mesh = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const orbit = useRef<THREE.Mesh>(null!);
  const core = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    mesh.current.scale.setScalar(
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.1,
    );

    mesh.current.rotation.y = state.clock.elapsedTime * 0.08;

    ring.current.rotation.z = state.clock.elapsedTime * 0.4;

    const t = state.clock.elapsedTime;

    orbit.current.position.x = Math.cos(t) * 1.2;
    orbit.current.position.z = Math.sin(t) * 1.2;

    const material = core.current.material as THREE.MeshStandardMaterial;

    material.emissiveIntensity = 8 + Math.sin(state.clock.elapsedTime * 3) * 2;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group ref={mesh}>
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive="#0891b2"
            emissiveIntensity={2}
            metalness={0.3}
            roughness={0}
            transparent
            opacity={0.65}
          />
        </mesh>

        <mesh ref={core} scale={0.65}>
          <sphereGeometry args={[0.55, 64, 64]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={8}
          />
        </mesh>

        <mesh ref={ring} rotation={[Math.PI / 2.8, 0.5, 0]}>
          <torusGeometry args={[0.7, 0.01, 16, 200]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#67e8f9"
            emissiveIntensity={8}
          />
        </mesh>

        <mesh ref={orbit} position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#67e8f9"
            emissiveIntensity={10}
          />
        </mesh>
        <OrbitParticles />
      </group>
    </Float>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
