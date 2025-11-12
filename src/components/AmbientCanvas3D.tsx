'use client';

import '@/lib/reactThreeCompat';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Particles from './Particles';
import FloatingShapes from './FloatingShapes';
import CanvasLoader from './Loading';

interface AmbientCanvas3DProps {
  particleCount?: number;
  particleSpeed?: number;
  particleOpacity?: number;
  shapesCount?: number;
  className?: string;
  children?: React.ReactNode;
}

const AmbientCanvas3D = ({
  particleCount = 500,
  particleSpeed = 0.2,
  particleOpacity = 0.2,
  shapesCount = 4,
  className = "absolute inset-0 -z-10",
  children
}: AmbientCanvas3DProps) => {
  return (
    <div className={className}>
      <Canvas className="w-full h-full">
        <Suspense fallback={<CanvasLoader />}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} />
          
          {/* Subtle ambient lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.3} color="#06b6d4" />
          <pointLight position={[-10, -10, 10]} intensity={0.2} color="#8b5cf6" />
          
          {/* Background particles */}
          <Particles 
            count={particleCount} 
            speed={particleSpeed} 
            opacity={particleOpacity} 
            size={0.8} 
          />
          
          {/* Floating geometric shapes */}
          <FloatingShapes count={shapesCount} spread={15} />
          
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AmbientCanvas3D;
