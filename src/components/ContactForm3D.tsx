'use client';



import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type ContactForm3DProps = ThreeElements['group'] & {
  isVisible?: boolean;
  focusedField?: string | null;
};

const ContactForm3D = ({ isVisible = true, focusedField = null, ...props }: ContactForm3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isActive = hovered || Boolean(focusedField);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });

  return (
    <group ref={groupRef} {...props} visible={isVisible}>
      {/* Main form background */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <RoundedBox
          args={[8, 10, 0.5]}
          radius={0.2}
          smoothness={4}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={isActive ? "#1e293b" : "#0f172a"}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.1}
            emissive="#0f172a"
            emissiveIntensity={isActive ? 0.25 : 0.1}
          />
        </RoundedBox>
      </Float>

      {/* Decorative elements */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[-3, 4, 0.3]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.6}
            emissive="#06b6d4"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[3, -3, 0.3]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.6}
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Floating rings around the form */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.3}
            emissive="#06b6d4"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Title text */}
      <Text
        position={[0, 4, 0.6]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Let&apos;s Connect
      </Text>

      {/* Glowing particles around the form */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 6 + Math.sin(i) * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 2;

        return (
          <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={`hsl(${180 + Math.random() * 60}, 70%, 60%)`}
                transparent
                opacity={0.6}
                emissive={`hsl(${180 + Math.random() * 60}, 70%, 30%)`}
                emissiveIntensity={0.3}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

export default ContactForm3D;
