'use client';

import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';

import { myProjects } from '../constants';
import type { Project } from '../constants';
import CanvasLoader from '../components/Loading';
import DemoComputer from '../components/DemoComputer';
import AmbientCanvas3D from '../components/AmbientCanvas3D';
import Button from '../components/Button';

const projectCount = myProjects.length;

type NavigationDirection = 'previous' | 'next';

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

const ProjectCanvasPlaceholder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 text-center text-slate-200 backdrop-blur-md">
    <div className="rounded-2xl border border-white/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200">
      Preview
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-sm text-slate-300">{description}</p>
  </div>
);

const Projects = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmallScreenQuery = useMediaQuery({ maxWidth: 768 });
  const isTabletScreenQuery = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isSmallScreen = isClient && isSmallScreenQuery;
  const isTabletScreen = isClient && isTabletScreenQuery;
  const animationsEnabled = !prefersReducedMotion;
  const shouldRenderCanvas = animationsEnabled && !isSmallScreen;
  const sectionPaddingClass = isSmallScreen ? 'py-16' : 'py-20 lg:py-24';
  const gridGapClass = isSmallScreen ? 'gap-10' : 'gap-12 lg:gap-16';
  const canvasHeightClass = isSmallScreen ? 'h-[420px]' : 'h-[600px]';
  const canvasWrapperClass = `${isSmallScreen ? '' : 'sticky top-24'} ${canvasHeightClass}`;
  const headerSpacingClass = isSmallScreen ? 'mb-12' : 'mb-16';
  const copySpacingClass = isSmallScreen ? 'space-y-6' : 'space-y-8';

  const ambientSettings = useMemo(() => {
    if (prefersReducedMotion) {
      return null;
    }

    if (isSmallScreen) {
      return {
        particleCount: 240,
        particleSpeed: 0.04,
        particleOpacity: 0.08,
        shapesCount: 4,
      };
    }

    if (isTabletScreen) {
      return {
        particleCount: 420,
        particleSpeed: 0.06,
        particleOpacity: 0.12,
        shapesCount: 6,
      };
    }

    return {
      particleCount: 600,
      particleSpeed: 0.08,
      particleOpacity: 0.15,
      shapesCount: 8,
    };
  }, [isSmallScreen, isTabletScreen, prefersReducedMotion]);

  const handleNavigation = (direction: NavigationDirection) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedProjectIndex((prevIndex) => {
      if (direction === 'previous') {
        return prevIndex === 0 ? projectCount - 1 : prevIndex - 1;
      }
      return prevIndex === projectCount - 1 ? 0 : prevIndex + 1;
    });

    setTimeout(() => setIsAnimating(false), 800);
  };

  useGSAP(() => {
    if (!animationsEnabled) {
      return;
    }

    const tl = gsap.timeline();
    
    tl.fromTo('.project-poster_image', 
      { scale: 1.04, opacity: 0.85 },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }
    )
    .fromTo('.animatedText', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
      '-=0.35'
    )
    .fromTo('.project-canvas', 
      { rotationY: -0.08, opacity: 0.85 },
      { rotationY: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.4'
    );
  }, [selectedProjectIndex, animationsEnabled]);

  const currentProject: Project = myProjects[selectedProjectIndex];

  return (
    <section
      className={`relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 ${sectionPaddingClass}`}
      id="projects"
    >
      {/* Enhanced Ambient Background */}
      {ambientSettings && (
        <AmbientCanvas3D 
          particleCount={ambientSettings.particleCount}
          particleSpeed={ambientSettings.particleSpeed}
          particleOpacity={ambientSettings.particleOpacity}
          shapesCount={ambientSettings.shapesCount}
        />
      )}
      
      {/* Floating gradient orbs */}
      {animationsEnabled && (
        <>
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-linear-to-r from-cyan-400/20 to-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-linear-to-r from-blue-500/20 to-purple-500/15 rounded-full blur-3xl animate-float-delayed" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-10">
        {/* Modern Header */}
        <div className={`text-center ${headerSpacingClass} space-y-6`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-200">Selected Work</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Digital Excellence
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Crafting immersive digital experiences that blend innovative design with cutting-edge technology 
            to deliver exceptional user journeys.
          </p>
        </div>

        {/* Enhanced Projects Grid */}
        <div className={`grid lg:grid-cols-2 ${gridGapClass} items-start`}>
          {/* Project Content */}
          <div className={copySpacingClass}>
            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-300">
                  {String(selectedProjectIndex + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}
                </span>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${((selectedProjectIndex + 1) / projectCount) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleNavigation('previous')}
                  className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/15 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 active:scale-95 text-slate-100 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Previous project"
                  disabled={isAnimating}
                >
                  <Image src="/assets/left-arrow.png" alt="left arrow" width={16} height={16} className="opacity-80" />
                </button>
                <button 
                  onClick={() => handleNavigation('next')}
                  className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/15 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 active:scale-95 text-slate-100 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Next project"
                  disabled={isAnimating}
                >
                  <Image src="/assets/right-arrow.png" alt="right arrow" width={16} height={16} className="opacity-80" />
                </button>
              </div>
            </div>

            {/* Enhanced Poster */}
            <div className="relative group">
              <div className="project-poster_image relative h-80 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(2,6,23,0.65)]">
                <Image
                  src={currentProject.spotlight}
                  alt={`${currentProject.title} spotlight`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                
                {/* Logo */}
                <div className="absolute top-6 left-6 p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl">
                  <Image src={currentProject.logo} alt="logo" width={32} height={32} className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Project Copy */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent animatedText">
                {currentProject.title}
              </h3>
              
              <div className="space-y-4">
                <p className="text-slate-200 leading-relaxed animatedText">
                  {currentProject.desc}
                </p>
                <p className="text-slate-400 leading-relaxed animatedText">
                  {currentProject.subdesc}
                </p>
              </div>
            </div>

            {/* Tags & Actions */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-wrap gap-3">
                {currentProject.tags.map((tag) => (
                  <span 
                    key={tag.id}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 text-slate-200 text-sm font-medium transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:scale-105"
                  >
                    <Image src={tag.path} alt={tag.name} width={18} height={18} className="rounded-sm" />
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  href={currentProject.href}
                  name="View Case Study"
                  containerClass="project-link"
                  target="_blank"
                  rel="noreferrer"
                />
                
                <div className="text-xs text-slate-400 font-medium">
                  Scroll to explore 3D view
                </div>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className={`${canvasWrapperClass} rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_35px_80px_rgba(15,23,42,0.65)] ${shouldRenderCanvas ? 'project-canvas' : ''}`}>
            {shouldRenderCanvas ? (
              <Canvas dpr={[1, 1.5]}>
                <ambientLight intensity={Math.PI * 0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
                
                <Center>
                  <Suspense fallback={<CanvasLoader />}>
                    <group scale={2.2} position={[0, -3, 0]} rotation={[0, -0.1, 0]}>
                      <DemoComputer texture={currentProject.texture} />
                    </group>
                  </Suspense>
                </Center>
                
                <OrbitControls 
                  maxPolarAngle={Math.PI / 2} 
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            ) : (
              <ProjectCanvasPlaceholder
                title="3D preview optimized"
                description={
                  prefersReducedMotion
                    ? 'Motion-heavy previews are disabled per your device settings.'
                    : 'The interactive computer model is best experienced on larger displays.'
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
