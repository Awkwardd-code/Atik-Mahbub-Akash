'use client';



import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TestCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={3}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#ff0000" 
        emissive="#ff0000" 
        emissiveIntensity={1}
      />
    </mesh>
  );
};

export default TestCube;
