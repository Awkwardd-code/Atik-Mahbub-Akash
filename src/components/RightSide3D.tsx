'use client';

// Import React Three Fiber compatibility fix for React 19
import '../lib/reactThreeCompat';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import TestCube from './TestCube';
import HeroBackground3D from './HeroBackground3D';
import CanvasLoader from './Loading';

const RightSide3D = () => {
  return (
    <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none">
      <Canvas 
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<CanvasLoader />}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />
          
          {/* Bright lighting for visibility */}
          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 10]} intensity={2} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#06b6d4" />
          
          {/* Test elements that should be clearly visible */}
          <TestCube />
          <HeroBackground3D />
          
          {/* Optional orbit controls for debugging */}
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RightSide3D;
