'use client'; // <-- Next.js 13+ App Router needs this for client-side hooks



import { useRef, useState } from 'react';
import { Float, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ThreeElements } from '@react-three/fiber';
import type { Mesh, Texture } from 'three';

const Cube = (props: ThreeElements['group']) => {
  const { nodes } = useGLTF('/models/cube.glb'); // public folder
  const cubeNode = nodes.Cube as Mesh;
  const texture = useTexture('/textures/cube.png') as Texture;

  const cubeRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // ----------------------------------------------------------------
  // GSAP animation (runs on mount & when hovered changes)
  // ----------------------------------------------------------------
  useGSAP(
    () => {
      if (!cubeRef.current) return;

      const tl = gsap
        .timeline({
          repeat: -1,
          repeatDelay: 0.5,
        })
        .to(cubeRef.current.rotation, {
          y: hovered ? '+=2' : `+=${Math.PI * 2}`,
          x: hovered ? '+=2' : `-=${Math.PI * 2}`,
          duration: 2.5,
          ease: 'power1.inOut',
        });

      return () => tl.kill();
    },
    { dependencies: [hovered] }
  );

  return (
    <Float floatIntensity={2}>
      <group
        position={[9, -4, 0]}
        rotation={[2.6, 0.8, -1.8]}
        scale={0.74}
        dispose={null}
        {...props}
      >
        <mesh
          ref={cubeRef}
          castShadow
          receiveShadow
          geometry={cubeNode.geometry}
          material={cubeNode.material}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshMatcapMaterial matcap={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
};

// ------------------------------------------------------------------
// Preload assets (optional but recommended)
// ------------------------------------------------------------------
useGLTF.preload('/models/cube.glb');

export default Cube;
