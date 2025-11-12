'use client';



import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type FloatingShapesProps = ThreeElements['group'] & {
  count?: number;
  spread?: number;
}

const FloatingShapes = ({ count = 12, spread = 20, ...props }: FloatingShapesProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const shapes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = spread;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 15;
    const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;
    
    const shapeType = Math.floor(Math.random() * 4);
    const scale = 0.3 + Math.random() * 0.4;
    const rotationSpeed = 0.5 + Math.random() * 1;
    
    return {
      position: [x, y, z] as [number, number, number],
      shapeType,
      scale,
      rotationSpeed,
      key: i,
    };
  });

  return (
    <group ref={groupRef} {...props}>
      {shapes.map(({ position, shapeType, scale, rotationSpeed, key }) => (
        <Float
          key={key}
          speed={rotationSpeed}
          rotationIntensity={0.4}
          floatIntensity={0.8}
          floatingRange={[-0.5, 0.5]}
        >
          <mesh position={position} scale={scale}>
            {/* Different geometric shapes */}
            {shapeType === 0 && <icosahedronGeometry args={[1, 0]} />}
            {shapeType === 1 && <octahedronGeometry args={[1, 0]} />}
            {shapeType === 2 && <tetrahedronGeometry args={[1, 0]} />}
            {shapeType === 3 && <dodecahedronGeometry args={[1, 0]} />}
            
            <meshStandardMaterial
              color={`hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`}
              transparent
              opacity={0.3 + Math.random() * 0.4}
              roughness={0.2}
              metalness={0.8}
              emissive={`hsl(${200 + Math.random() * 60}, 50%, 20%)`}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export default FloatingShapes;
