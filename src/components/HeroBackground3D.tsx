'use client';



import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

const HeroBackground3D = ({ ...props }: ThreeElements['group']) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Large central sphere */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[3, 64, 64]} position={[5, 0, -5]}>
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.15}
            roughness={0.1}
            metalness={0.9}
            emissive="#06b6d4"
            emissiveIntensity={0.2}
            wireframe
          />
        </Sphere>
      </Float>

      {/* Floating torus rings */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Torus args={[4, 0.2, 16, 32]} position={[8, 3, -8]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.4}
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </Torus>
      </Float>

      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.6}>
        <Torus args={[2.5, 0.15, 12, 24]} position={[6, -2, -3]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <meshStandardMaterial
            color="#6366f1"
            transparent
            opacity={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
        </Torus>
      </Float>

      {/* Floating cubes */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
        <Box args={[1, 1, 1]} position={[10, 1, -2]}>
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.6}
            emissive="#06b6d4"
            emissiveIntensity={0.4}
          />
        </Box>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <Box args={[0.8, 0.8, 0.8]} position={[3, 4, -6]}>
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.5}
            emissive="#8b5cf6"
            emissiveIntensity={0.3}
          />
        </Box>
      </Float>

      {/* Energy lines */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius + 5;
        const z = Math.sin(angle) * radius - 5;

        return (
          <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh position={[x, Math.sin(i) * 2, z]} rotation={[0, angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 8, 8]} />
              <meshStandardMaterial
                color="#06b6d4"
                transparent
                opacity={0.6}
                emissive="#06b6d4"
                emissiveIntensity={0.8}
              />
            </mesh>
          </Float>
        );
      })}

      {/* Glowing orbs */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = (Math.random() - 0.5) * 20 + 5;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 20 - 5;
        const hue = 180 + Math.random() * 80;

        return (
          <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={1}>
            <Sphere args={[0.1, 16, 16]} position={[x, y, z]}>
              <meshStandardMaterial
                color={`hsl(${hue}, 70%, 60%)`}
                transparent
                opacity={0.8}
                emissive={`hsl(${hue}, 70%, 50%)`}
                emissiveIntensity={1}
              />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
};

export default HeroBackground3D;
