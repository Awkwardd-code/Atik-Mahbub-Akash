'use client';

// Import React Three Fiber compatibility fix for React 19
import '../lib/reactThreeCompat';

import { Leva } from 'leva';
import type { ErrorInfo, FC, ReactNode } from 'react';
import { Suspense, useState, useEffect, useCallback, useMemo, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import { PerspectiveCamera, Html } from '@react-three/drei';

import Cube from '../components/Cube';
import Rings from '../components/Rings';
import ReactLogo from '../components/ReactLogo';
import Button from '../components/Button';
import Target from '../components/Target';
import CanvasLoader from '../components/Loading';
import HeroCamera from '../components/HeroCamera';
import Particles from '../components/Particles';
import FloatingShapes from '../components/FloatingShapes';
import HeroBackground3D from '../components/HeroBackground3D';
import RightSide3D from '../components/RightSide3D';
import HeroTechLogos from '../components/HeroTechLogos';
import Simple3DFallback from '../components/Simple3DFallback';
import { calculateSizes } from '../constants';
import { HackerRoom } from '../components/HackerRoom';

type HeroSizeConfig = ReturnType<typeof calculateSizes>;

const FALLBACK_SIZES: HeroSizeConfig = {
  deskScale: 0.06,
  deskPosition: [0.25, -5.5, 0] as HeroSizeConfig['deskPosition'],
  cubePosition: [9, -5.5, 0] as HeroSizeConfig['cubePosition'],
  reactLogoPosition: [12, 3, 0] as HeroSizeConfig['reactLogoPosition'],
  ringPosition: [-24, 10, 0] as HeroSizeConfig['ringPosition'],
  targetPosition: [-13, -13, -10] as HeroSizeConfig['targetPosition'],
};

const HERO_STATS = [
  { value: '12+', label: 'Years of expertise' },
  { value: '68', label: 'Global brands' },
  { value: '50+', label: 'Innovations' },
] as const;

const COLLAB_TAGS = ['Fintech', 'SaaS', 'Creative Tech'] as const;

const heroLogosFallback = (
  <div className="text-center text-slate-400 p-2">
    <p className="text-xs">Tech logos unavailable</p>
  </div>
);

const safeRender = (renderFn: () => ReactNode, fallback: ReactNode = null) => {
  try {
    return renderFn();
  } catch (error) {
    console.error('Hero safe render error:', error);
    return fallback;
  }
};

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

const useHeroSizes = (isSmall: boolean, isMobile: boolean, isTablet: boolean) =>
  useMemo<HeroSizeConfig>(() => {
    try {
      return calculateSizes(isSmall, isMobile, isTablet);
    } catch (error) {
      console.error('Size calculation error:', error);
      return FALLBACK_SIZES;
    }
  }, [isSmall, isMobile, isTablet]);

const useSectionScroll = () =>
  useCallback((selector: string) => {
    try {
      const target = document.querySelector(selector);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }

    if (typeof window !== 'undefined') {
      window.location.hash = selector;
    }
  }, []);

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

// Error Boundary for 3D Canvas
class Canvas3DErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full bg-linear-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-800/50">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">3D Experience Unavailable</h3>
            <p className="text-slate-400 text-sm">The 3D experience could not be loaded. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe Canvas Loader Component
const SafeCanvasLoader = ({ error }: { error?: boolean }) => {
  if (error) {
    return (
      <Html center>
        <div className="flex items-center justify-center">
          <div className="text-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
            <div className="animate-pulse text-red-400 mb-2">⚠️</div>
            <p className="text-sm text-slate-200">Loading failed</p>
          </div>
        </div>
      </Html>
    );
  }

  return <CanvasLoader />;
};

const ResponsiveCanvasPlaceholder = ({ showTechLogos = true }: { showTechLogos?: boolean }) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-linear-to-br from-slate-900/60 via-slate-900/40 to-slate-800/40 px-6 py-8 text-center lg:text-left">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Immersive Preview</p>
      <p className="mt-3 text-lg font-semibold text-white">Optimized for mobile viewing</p>
      <p className="mt-2 text-sm text-slate-300">
        The interactive 3D scene unlocks on larger screens or when motion preferences allow it.
      </p>
    </div>
    {showTechLogos && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        {safeRender(() => <HeroTechLogos />, heroLogosFallback)}
      </div>
    )}
  </div>
);

interface HeroProps {
  className?: string;
}

const Hero: FC<HeroProps> = ({ className = '' }) => {
  // State for error handling
  const [canvasError, setCanvasError] = useState(false);
  const isClient = useIsClient();
  const scrollToSection = useSectionScroll();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Safe media queries - must be called at top level
  const isSmallQuery = useMediaQuery({ maxWidth: 440 });
  const isMobileQuery = useMediaQuery({ maxWidth: 768 });
  const isTabletQuery = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

  // Apply client check to media queries
  const isSmall = isSmallQuery && isClient;
  const isMobile = isMobileQuery && isClient;
  const isTablet = isTabletQuery && isClient;

  // Safe size calculation with fallbacks
  const sizes = useHeroSizes(!!isSmall, !!isMobile, !!isTablet);
  const sectionPaddingClass = isSmall ? 'pb-20' : isMobile ? 'pb-28' : 'pb-32 xl:pb-40';
  const textSpacingClass = isSmall ? 'space-y-6' : 'space-y-8';
  const gridGapClass = isSmall ? 'gap-10' : 'gap-12';
  const canvasHeightClass = isSmall ? 'h-[340px]' : isMobile ? 'h-[460px] md:h-[520px]' : 'h-96 lg:h-[600px]';
  const statsWrapperClass = isSmall
    ? 'grid grid-cols-2 gap-6 pt-4 border-t border-slate-800'
    : 'flex flex-wrap gap-8 pt-4 border-t border-slate-800';
  const shouldRenderInteractiveCanvas = !prefersReducedMotion && !isSmall;
  const sceneVisuals = useMemo(
    () => {
      if (isSmall) {
        return {
          particleCount: 480,
          particleSpeed: 0.12,
          particleOpacity: 0.25,
          particleSize: 1,
          floatingCount: 3,
          shapeSpread: 14,
        };
      }

      if (isMobile) {
        return {
          particleCount: 800,
          particleSpeed: 0.14,
          particleOpacity: 0.28,
          particleSize: 1.1,
          floatingCount: 4,
          shapeSpread: 18,
        };
      }

      return {
        particleCount: 1200,
        particleSpeed: 0.15,
        particleOpacity: 0.3,
        particleSize: 1.2,
        floatingCount: 6,
        shapeSpread: 20,
      };
    },
    [isSmall, isMobile],
  );

  // Canvas error handler
  const handleCanvasError = useCallback(() => {
    console.error('Canvas rendering error occurred');
    setCanvasError(true);
  }, []);

  // Canvas fallback component
  const CanvasFallback = useCallback(() => (
    <div className="flex items-center justify-center h-full bg-linear-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-800/50">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">3D Experience Unavailable</h3>
        <p className="text-slate-400 text-sm mb-4">The 3D experience could not be loaded. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  ), []);

  // Loading state for client-side hydration
  if (!isClient) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-visible bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 ${sectionPaddingClass} ${className}`}
      id="home"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Grid overlay for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className={`grid lg:grid-cols-2 ${gridGapClass} items-center`}>
          {/* Text Content */}
          <div className={`flex flex-col ${textSpacingClass}`}>
            {/* Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                  Available for select projects
                </span>
              </div>
              <div className="text-sm text-slate-400 font-medium">
                Next availability: December 2024
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-1 h-8 bg-linear-to-b from-cyan-400 to-purple-400 rounded-full" />
                <p className="text-lg font-medium">Hello, I&apos;m Atik Mahbub Akash</p>
                <span className="text-2xl animate-wave">👋</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Crafting </span>
                <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  digital excellence
                </span>
                <span className="text-white block mt-2">through thoughtful</span>
                <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  design & engineering
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="max-w-2xl">
              <p className="text-lg text-slate-300 leading-relaxed font-light">
                I partner with ambitious teams to build products that resonate—blending 
                sophisticated interfaces with immersive 3D experiences. From creative 
                direction to full-stack implementation, I deliver polished solutions 
                that drive meaningful impact.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Safe Button with error handling */}
              <Button 
                href="#contact" 
                name="Start a project" 
                isBeam 
                containerClass="group relative overflow-hidden bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25" 
                onClick={() => scrollToSection('#contact')}
              />
              <a 
                href="#projects" 
                className="group inline-flex items-center gap-3 px-8 py-4 text-slate-300 border border-slate-700 rounded-xl font-semibold transition-all duration-300 hover:border-slate-500 hover:bg-white/5 hover:text-white hover:scale-105"
                aria-label="Explore selected work"
                onClick={event => {
                  event.preventDefault();
                  scrollToSection('#projects');
                }}
              >
                <span>View portfolio</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path 
                    d="M6 12L10 8L6 4" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div className={statsWrapperClass}>
              {HERO_STATS.map(stat => (
                <div key={stat.label} className="text-center group cursor-default">
                  <p className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Tech Logos */}
            <div className="lg:hidden mt-6">
              <div className="p-4 bg-slate-800/20 border border-slate-700/30 rounded-xl backdrop-blur-sm">
                {safeRender(() => <HeroTechLogos />, heroLogosFallback)}
              </div>
            </div>
          </div>

          {/* 3D Canvas Section */}
          <div className={`relative ${canvasHeightClass} rounded-2xl overflow-hidden border border-slate-800/50 bg-linear-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm`}>
            <Canvas3DErrorBoundary fallback={<CanvasFallback />}>
              {canvasError ? (
                <CanvasFallback />
              ) : shouldRenderInteractiveCanvas ? (
                <Canvas 
                  className="w-full h-full"
                  gl={{ 
                    antialias: true, 
                    alpha: true,
                    powerPreference: "high-performance"
                  }}
                  dpr={[1, 2]}
                  onError={handleCanvasError}
                >
                  <Suspense fallback={<SafeCanvasLoader error={canvasError} />}>
                    <Leva hidden />
                    <PerspectiveCamera makeDefault position={[-5, 2, 25]} fov={60} />

                    {/* Enhanced Lighting */}
                    <ambientLight intensity={1.2} />
                    <directionalLight 
                      position={[10, 12, 8]} 
                      intensity={1.5} 
                      castShadow 
                      shadow-mapSize={[2048, 2048]}
                    />
                    <pointLight position={[15, 5, 5]} intensity={0.8} color="#22d3ee" />
                    <pointLight position={[-10, -5, -8]} intensity={0.6} color="#a855f7" />
                    <spotLight 
                      position={[0, 15, 0]} 
                      intensity={1} 
                      angle={0.3} 
                      penumbra={1} 
                      color="#ffffff"
                    />

                    {/* Scene Elements - Wrapped in try-catch logic */}
                    {!canvasError && (
                      <>
                        <Particles
                          count={sceneVisuals.particleCount}
                          speed={sceneVisuals.particleSpeed}
                          opacity={sceneVisuals.particleOpacity}
                          size={sceneVisuals.particleSize}
                        />
                        <FloatingShapes count={sceneVisuals.floatingCount} spread={sceneVisuals.shapeSpread} />
                        <HeroBackground3D />
                        
                        <HeroCamera isMobile={!!isMobile}>
                          <HackerRoom 
                            scale={sizes.deskScale} 
                            position={sizes.deskPosition} 
                            rotation={[0.1, -Math.PI, 0]} 
                          />
                        </HeroCamera>

                        <group>
                          <Target position={sizes.targetPosition} />
                          <ReactLogo position={sizes.reactLogoPosition} />
                          <Rings position={sizes.ringPosition} />
                          <Cube position={sizes.cubePosition} />
                        </group>
                      </>
                    )}
                  </Suspense>
                </Canvas>
              ) : (
                <ResponsiveCanvasPlaceholder showTechLogos />
              )}
            </Canvas3DErrorBoundary>
            
            {/* Tech logos overlay for the visual panel */}
            {shouldRenderInteractiveCanvas && (
              <div className="absolute inset-0 hidden lg:flex items-start justify-center px-8 pt-8 pb-10 z-10 pointer-events-none">
                <div className="max-w-md w-full pointer-events-auto space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 pt-6">
                    <span className="text-slate-200/80">Core Stack</span>
                    <span className="text-slate-500/80">2024</span>
                  </div>
                  {safeRender(() => <HeroTechLogos />)}
                </div>
              </div>
            )}
            
            {/* Canvas Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-slate-900/20 via-transparent to-slate-900/10" />
          </div>
        </div>
      </div>

      {/* Collaboration Card */}
      <div className="absolute bottom-8 right-4 xl:right-8 z-20 hidden lg:block w-full max-w-sm xl:max-w-md">
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/80 via-slate-900/40 to-cyan-900/20 p-6 backdrop-blur-2xl shadow-2xl shadow-cyan-500/15 transition-all duration-500 hover:border-cyan-400/40 min-h-[280px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.35),transparent_55%)] opacity-80 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-5 h-full justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500 via-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/40">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10 7H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Collaboration</p>
                  <p className="text-base font-semibold text-white">Q1 2024 window</p>
                </div>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200/80">
                2 slots left
              </span>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed">
              Currently partnering with venture-backed product teams to shape immersive experiences across
              Europe & North America.
            </div>

            <div className="flex flex-wrap gap-2">
              {COLLAB_TAGS.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Accepting select founders only
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:translate-x-0.5"
              >
                Book intro
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L10 6L4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Additional 3D Sections with Error Handling */}
      {safeRender(
        () => (
          <>
            <RightSide3D />
            <Simple3DFallback />
          </>
        ),
      )}

    
    </section>
  );
};

export default Hero;
