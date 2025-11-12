'use client';



import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Points as PointsType } from 'three';
import type { ThreeElements } from '@react-three/fiber';

type ParticlesProps = ThreeElements['group'] & {
  count?: number;
  speed?: number;
  opacity?: number;
  size?: number;
  color?: string;
};

const Particles = ({ 
  count = 2000, 
  speed = 0.5, 
  opacity = 0.6, 
  size = 1.5, 
  color = '#ffffff',
  ...props 
}: ParticlesProps) => {
  const ref = useRef<PointsType>(null);
  
  // Generate random particle positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random positions in a larger sphere
      const radius = Math.random() * 35 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // More vibrant gradient colors
      const colorMix = Math.random();
      colors[i * 3] = 0.8 + colorMix * 0.2; // Red
      colors[i * 3 + 1] = 0.9 + colorMix * 0.1; // Green  
      colors[i * 3 + 2] = 1; // Blue
    }
    
    return [positions, colors];
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.1) * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.05;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.05) * 0.05;
    }
  });

  return (
    <group {...props}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

export default Particles;
