'use client';

// Import React Three Fiber compatibility fix for React 19
import '../lib/reactThreeCompat';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Image from 'next/image';
import * as THREE from 'three';
import { useMediaQuery } from 'react-responsive';

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

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener?.(handleChange);
    return () => mediaQuery.removeListener?.(handleChange);
  }, []);

  return prefersReducedMotion;
};

const CanvasPlaceholder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-200 backdrop-blur-md">
    <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
      Preview
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-sm text-slate-300">{description}</p>
  </div>
);

const WorkExperience = () => {
  const [animationName, setAnimationName] = useState<WorkExperienceItem['animation']>('idle');
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmallScreenQuery = useMediaQuery({ maxWidth: 768 });
  const isTabletScreenQuery = useMediaQuery({ minWidth: 769, maxWidth: 1280 });
  const isSmallScreen = isClient && isSmallScreenQuery;
  const isTabletScreen = isClient && isTabletScreenQuery;
  const animationsEnabled = !prefersReducedMotion;
  const shouldRenderCanvas = animationsEnabled && !isSmallScreen;
  const sectionPaddingClass = isSmallScreen ? 'py-16' : 'py-20 lg:py-24';
  const workContainerGap = isSmallScreen ? 'gap-8' : 'lg:flex-row gap-12';
  const workCanvasHeight = isSmallScreen ? 'h-[360px]' : 'h-[520px]';
  const ambientSettings = useMemo(() => {
    if (!animationsEnabled) {
      return null;
    }

    if (isSmallScreen) {
      return {
        particleCount: 180,
        particleSpeed: 0.04,
        particleOpacity: 0.08,
        shapesCount: 2,
      };
    }

    if (isTabletScreen) {
      return {
        particleCount: 260,
        particleSpeed: 0.06,
        particleOpacity: 0.12,
        shapesCount: 3,
      };
    }

    return {
      particleCount: 350,
      particleSpeed: 0.1,
      particleOpacity: 0.18,
      shapesCount: 4,
    };
  }, [isSmallScreen, isTabletScreen, animationsEnabled]);

  return (
    <section
      className={`relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 ${sectionPaddingClass}`}
      id="work"
    >
      {animationsEnabled && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Ambient 3D Background */}
        {ambientSettings && (
          <AmbientCanvas3D 
            particleCount={ambientSettings.particleCount}
            particleSpeed={ambientSettings.particleSpeed}
            particleOpacity={ambientSettings.particleOpacity}
            shapesCount={ambientSettings.shapesCount}
          />
        )}

        <div className="section-heading relative z-10 space-y-6 text-center lg:text-left">
          <p className="eyebrow">Experience</p>
          <h2>Embedded inside product, research, and brand teams.</h2>
          <p className="section-subtext">
            I thrive in cross-functional environments - pairing with design, leading engineering spikes, and keeping
            stakeholder conversations transparent.
          </p>
        </div>

        <div className={`work-container relative z-10 flex flex-col ${workContainerGap}`}>
          <div className={`work-canvas flex-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_25px_80px_rgba(15,23,42,0.55)] ${workCanvasHeight}`}>
            {shouldRenderCanvas ? (
              <Canvas dpr={[1, 1.5]} className="h-full w-full">
                <ambientLight intensity={1.2} />
                <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={1.2} />
                <directionalLight position={[10, 10, 6]} intensity={1} />
                <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} enablePan={false} />

                <Suspense fallback={<CanvasLoader />}>
                  <Developer position-y={-3} scale={3} animationName={animationName} />
                </Suspense>
              </Canvas>
            ) : (
              <CanvasPlaceholder
                title="3D showcase paused"
                description={
                  prefersReducedMotion
                    ? 'Animated scenes are disabled to respect your system preference.'
                    : 'Rotate your device or visit on desktop to watch the developer rig animate.'
                }
              />
            )}
          </div>

          <div className="work-timeline flex-1 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
            {workExperiences.map((item) => {
              const isActive = animationName === item.animation;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`work-timeline_item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setAnimationName(item.animation)}
                  onPointerEnter={() => setAnimationName(item.animation)}
                  onPointerLeave={() => setAnimationName('idle')}
                >
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
