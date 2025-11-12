'use client';



import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type HoverEffect3DProps = ThreeElements['group'] & {
  children?: React.ReactNode;
  intensity?: number;
  color?: string;
  emissiveIntensity?: number;
}

const HoverEffect3D = ({ 
  children, 
  intensity = 1, 
  color = '#06b6d4', 
  emissiveIntensity = 0.2,
  ...props 
}: HoverEffect3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 * intensity;
      
      // Subtle rotation on hover
      if (hovered) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          Math.sin(state.clock.elapsedTime * 3) * 0.02,
          0.1
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          Math.cos(state.clock.elapsedTime * 2) * 0.01,
          0.1
        );
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      {...props}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Background glow effect */}
      <RoundedBox
        args={[4, 0.1, 4]}
        radius={0.1}
        smoothness={4}
        position={[0, -0.5, 0]}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
          emissive={color}
          emissiveIntensity={hovered ? emissiveIntensity * 2 : emissiveIntensity}
          roughness={0.1}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Hover ring effect */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <torusGeometry args={[3, 0.02, 8, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.6}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Floating particles on hover */}
      {hovered && Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0.5, z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {children}
    </group>
  );
};

export default HoverEffect3D;
