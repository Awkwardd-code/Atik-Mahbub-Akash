'use client';



import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type Project3DCardProps = ThreeElements['group'] & {
  title: string;
  description: string;
  color?: string;
  isActive?: boolean;
}

const Project3DCard = ({ 
  title, 
  description, 
  color = '#06b6d4', 
  isActive = false,
  ...props 
}: Project3DCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      
      // Rotation based on active state
      if (isActive) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
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
      {/* Main card */}
      <Float speed={hovered ? 2 : 1} rotationIntensity={hovered ? 0.3 : 0.1} floatIntensity={hovered ? 0.6 : 0.2}>
        <RoundedBox
          args={[4, 2.5, 0.2]}
          radius={0.2}
          smoothness={4}
        >
          <meshStandardMaterial
            color={isActive ? color : '#1e293b'}
            transparent
            opacity={isActive ? 0.9 : 0.7}
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={isActive ? 0.3 : 0.1}
          />
        </RoundedBox>
      </Float>

      {/* Project title */}
      <Text
        position={[0, 0.5, 0.15]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
      >
        {title}
      </Text>

      {/* Project description */}
      <Text
        position={[0, -0.2, 0.15]}
        fontSize={0.15}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
      >
        {description}
      </Text>

      {/* Glow effect when active */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
          <torusGeometry args={[2.5, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.8}
            emissive={color}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}

      {/* Hover particles */}
      {hovered && Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Float key={i} speed={2 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[x, 0, z]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

export default Project3DCard;
