'use client';

// Import React Three Fiber compatibility fix for React 19
import '../lib/reactThreeCompat';

import { Suspense, useState } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Image from 'next/image';
import * as THREE from 'three';

// Extend Three.js objects for use in JSX
extend({ 
  Mesh: THREE.Mesh,
  BoxGeometry: THREE.BoxGeometry,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  // Add other THREE objects as needed
});

import Developer from '../components/Developer';
import CanvasLoader from '../components/Loading';
import AmbientCanvas3D from '../components/AmbientCanvas3D';
import { workExperiences } from '../constants';
import type { WorkExperience as WorkExperienceItem } from '../constants';

const WorkExperience = () => {
  const [animationName, setAnimationName] = useState<WorkExperienceItem['animation']>('idle');

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 py-20"
      id="work"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
      {/* Ambient 3D Background */}
      <AmbientCanvas3D 
        particleCount={350}
        particleSpeed={0.1}
        particleOpacity={0.18}
        shapesCount={4}
      />
      <div className="section-heading relative z-10">
        <p className="eyebrow">Experience</p>
        <h2>Embedded inside product, research, and brand teams.</h2>
        <p className="section-subtext">
          I thrive in cross-functional environments - pairing with design, leading engineering spikes, and keeping
          stakeholder conversations transparent.
        </p>
      </div>

      <div className="work-container relative z-10">
        <div className="work-canvas">
          <Canvas>
            <ambientLight intensity={7} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />

            <Suspense fallback={<CanvasLoader />}>
              <Developer position-y={-3} scale={3} animationName={animationName} />
            </Suspense>
          </Canvas>
        </div>

        <div className="work-timeline">
          {workExperiences.map((item) => {
            const isActive = animationName === item.animation;

            return (
              <button
                key={item.id}
                type="button"
                className={`work-timeline_item ${isActive ? 'is-active' : ''}`}
                onClick={() => setAnimationName(item.animation)}
                onPointerEnter={() => setAnimationName(item.animation)}
                onPointerLeave={() => setAnimationName('idle')}>
                <div className="work-timeline_marker">
                  <Image src={item.icon} alt={`${item.name} logo`} width={40} height={40} />
                  <span className="work-timeline_dot" />
                </div>

                <div className="work-timeline_content">
                  <div className="work-timeline_header">
                    <p className="work-timeline_company">{item.name}</p>
                    <span className="work-timeline_duration">{item.duration}</span>
                  </div>
                  <p className="work-timeline_role">{item.pos}</p>
                  <p className="work-timeline_copy">{item.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
};

export default WorkExperience;
