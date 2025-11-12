'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

interface Skill {
  name: string;
  level: number;
  color: string;
  position: [number, number, number];
}

type SkillsVisualization3DProps = ThreeElements['group'] & {
  skills?: Skill[];
};

const defaultSkills: Skill[] = [
  { name: 'React', level: 0.95, color: '#61dafb', position: [0, 2, 0] },
  { name: 'Three.js', level: 0.9, color: '#000000', position: [-3, 1, 2] },
  { name: 'TypeScript', level: 0.88, color: '#3178c6', position: [3, 1, -1] },
  { name: 'Next.js', level: 0.92, color: '#000000', position: [-2, -1, -2] },
  { name: 'WebGL', level: 0.85, color: '#990000', position: [2, -1, 2] },
  { name: 'GSAP', level: 0.8, color: '#88ce02', position: [0, -2, 1] },
  { name: 'Node.js', level: 0.87, color: '#339933', position: [-1, 0, -3] },
  { name: 'Design Systems', level: 0.9, color: '#ff6b6b', position: [4, 0, 0] },
];

const SkillsVisualization3D = ({ skills = defaultSkills, ...props }: SkillsVisualization3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {skills.map((skill, index) => (
        <Float
          key={skill.name}
          speed={1 + Math.random() * 0.5}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <group position={skill.position}>
            {/* Skill Orb */}
            <Sphere
              args={[0.3 + skill.level * 0.4, 32, 32]}
              onPointerEnter={() => setHoveredSkill(skill.name)}
              onPointerLeave={() => setHoveredSkill(null)}
            >
              <meshStandardMaterial
                color={skill.color}
                transparent
                opacity={hoveredSkill === skill.name ? 0.9 : 0.7}
                roughness={0.2}
                metalness={0.8}
                emissive={skill.color}
                emissiveIntensity={hoveredSkill === skill.name ? 0.3 : 0.1}
              />
            </Sphere>

            {/* Skill Level Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry 
                args={[0.8, 0.02, 8, 32, skill.level * Math.PI * 2]} 
              />
              <meshStandardMaterial
                color={skill.color}
                transparent
                opacity={0.6}
                emissive={skill.color}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Skill Name */}
            <Text
              position={[0, -1, 0]}
              fontSize={0.2}
              color={hoveredSkill === skill.name ? '#ffffff' : '#cccccc'}
              anchorX="center"
              anchorY="middle"
            >
              {skill.name}
            </Text>

            {/* Skill Level Text */}
            <Text
              position={[0, -1.3, 0]}
              fontSize={0.15}
              color="#888888"
              anchorX="center"
              anchorY="middle"
            >
              {Math.round(skill.level * 100)}%
            </Text>

            {/* Connecting Lines */}
            {index < skills.length - 1 && (
              <mesh>
                <cylinderGeometry args={[0.005, 0.005, 2, 8]} />
                <meshStandardMaterial
                  color="#333333"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            )}

            {/* Hover Effect - Expanding Ring */}
            {hoveredSkill === skill.name && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.01, 8, 32]} />
                <meshStandardMaterial
                  color={skill.color}
                  transparent
                  opacity={0.3}
                  emissive={skill.color}
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}
          </group>
        </Float>
      ))}

      {/* Central Hub */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            wireframe
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
};

export default SkillsVisualization3D;
