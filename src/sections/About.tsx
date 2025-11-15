'use client';

// Import React Three Fiber compatibility fix for React 19
import '../lib/reactThreeCompat';

import React, { FC, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

import AmbientCanvas3D from '../components/AmbientCanvas3D';
import Button from '../components/Button';
import CanvasLoader from '../components/Loading';

// Constants
const CONTACT_EMAIL = 'somethinn999awkwardd@gmail.com';
const COPY_RESET_DELAY = 2000;

const DISCIPLINES = [
  'Product strategy',
  'Immersive 3D web',
  'Design systems',
  'SaaS platforms',
  'Brand storytelling',
  'WebGL',
] as const;

// Design Tokens
const COLORS = {
  primary: '#06b6d4',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: {
    dark: '#0f172a',
    medium: '#1e293b',
    light: '#334155',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#64748b',
  }
} as const;

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

// Animation Configs
const STAGGER_CHILDREN = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FADE_UP_VARIANTS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const CARD_HOVER_VARIANTS = {
  initial: { y: 0 },
  hover: { 
    y: -8,
    transition: { 
      type: 'spring' as const, 
      stiffness: 400, 
      damping: 25 
    } 
  },
};

// Dynamic Imports with Better Loading States
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl w-full h-full bg-linear-to-br from-slate-900/40 to-slate-800/30 animate-pulse backdrop-blur-sm" />
  ),
});

const SkillsVisualization3D = dynamic(() => import('../components/SkillsVisualization3D'), {
  ssr: false,
  loading: () => null,
});

// Reusable Components
const GradientBackground: FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 -left-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
    <div className="absolute bottom-1/3 -right-16 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(120,119,198,0.15),transparent)]" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
  </div>
);

const Card: FC<{
  className?: string;
  hoverColor?: string;
  children: React.ReactNode;
}> = ({ className = '', hoverColor = COLORS.primary, children }) => (
  <motion.div
    variants={CARD_HOVER_VARIANTS}
    initial="initial"
    whileInView="animate"
    whileHover="hover"
    viewport={{ once: true, margin: '-50px' }}
    className={`
      group relative rounded-3xl p-8 backdrop-blur-xl border transition-all duration-500 overflow-hidden
      bg-linear-to-br from-slate-900/80 via-slate-900/40 to-slate-800/25
      border-slate-800/60 hover:border-${hoverColor}/30
      ${className}
    `}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(135deg, ${hoverColor}05, ${COLORS.secondary}05)`
      }}
    />
    {children}
  </motion.div>
);

const InfoPill: FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full text-sm text-slate-200 border border-slate-700 hover:border-cyan-400/50 transition-colors duration-300"
  >
    {children}
  </motion.span>
);

const ScenePlaceholder: FC<{
  title: string;
  description: string;
  align?: 'center' | 'start';
  children?: React.ReactNode;
}> = ({ title, description, align = 'center', children }) => {
  const alignmentClasses = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div
      className={`flex h-full w-full flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-md ${alignmentClasses}`}
    >
      <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 6V12L16 14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      <div>
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      {children}
    </div>
  );
};

const About: FC = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isSkillsSceneReady, setIsSkillsSceneReady] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmallScreenQuery = useMediaQuery({ maxWidth: 640 });
  const isTabletScreenQuery = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
  const isSmallScreen = isClient && isSmallScreenQuery;
  const isTabletScreen = isClient && isTabletScreenQuery;

  const sectionSpacingClass = isSmallScreen ? 'py-16' : 'py-20 lg:py-24';
  const headerSpacingClass = isSmallScreen ? 'mb-12' : 'mb-16 lg:mb-24';
  const gridGapClass = isSmallScreen ? 'gap-5' : 'gap-6';
  const autoRowClass = isSmallScreen ? 'auto-rows-[minmax(260px,auto)]' : 'auto-rows-[minmax(300px,auto)]';
  const skillsCanvasHeightClass = isSmallScreen ? 'min-h-[240px]' : 'min-h-[300px]';
  const globeDimensions = isSmallScreen ? 240 : isTabletScreen ? 280 : 320;
  const shouldRenderSkillsScene = isSkillsSceneReady && !prefersReducedMotion && !isSmallScreen;
  const shouldRenderGlobe = !prefersReducedMotion;

  const ambientSettings = useMemo(() => {
    if (prefersReducedMotion) {
      return null;
    }

    if (isSmallScreen) {
      return {
        particleCount: 160,
        particleSpeed: 0.02,
        particleOpacity: 0.08,
        shapesCount: 2,
      };
    }

    if (isTabletScreen) {
      return {
        particleCount: 220,
        particleSpeed: 0.025,
        particleOpacity: 0.09,
        shapesCount: 3,
      };
    }

    return {
      particleCount: 300,
      particleSpeed: 0.03,
      particleOpacity: 0.1,
      shapesCount: 4,
    };
  }, [isSmallScreen, isTabletScreen, prefersReducedMotion]);

  const handleCopy = useCallback(async () => {
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setHasCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => setHasCopied(false), COPY_RESET_DELAY);
    } catch {
      // Handle copy error silently
      setHasCopied(false);
    }
  }, []);

  useEffect(() => {
    setIsSkillsSceneReady(true);
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 ${sectionSpacingClass}`}
      id="about"
    >
      {ambientSettings && (
        <AmbientCanvas3D
          particleCount={ambientSettings.particleCount}
          particleSpeed={ambientSettings.particleSpeed}
          particleOpacity={ambientSettings.particleOpacity}
          shapesCount={ambientSettings.shapesCount}
          className="absolute inset-0 -z-10 pointer-events-none"
        />
      )}

      <GradientBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={STAGGER_CHILDREN}
          className={`text-center ${headerSpacingClass}`}
        >
          <motion.p 
            variants={FADE_UP_VARIANTS}
            className="text-cyan-400 font-mono text-sm mb-4 tracking-widest"
          >
            ABOUT
          </motion.p>
          
          <motion.h2 
            variants={FADE_UP_VARIANTS}
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Crafting digital
            <br />
            <span className="text-cyan-400">experiences that matter</span>
          </motion.h2>
          
          <motion.p 
            variants={FADE_UP_VARIANTS}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            I transform complex challenges into elegant digital solutions. Through strategic design 
            and technical excellence, I help brands create meaningful connections with their audience.
          </motion.p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={STAGGER_CHILDREN}
          className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${gridGapClass} ${autoRowClass}`}
        >
          {/* Profile Card */}
          <Card className="xl:col-span-1">
            <div className="relative z-10 h-full flex flex-col">
              <div className="relative rounded-2xl overflow-hidden mb-6 flex-1">
                <Image
                  src="/assets/grid1.png"
                  alt="Atik Mahbub Akash"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-white mb-3">Atik Mahbub Akash</h3>
                <p className="text-slate-300 leading-relaxed">
                  Building the future of digital experiences with 12+ years of expertise in 
                  creative direction and technical innovation.
                </p>
              </div>
            </div>
          </Card>

          {/* Skills Visualization */}
          <Card className="lg:col-span-2" hoverColor={COLORS.secondary}>
            <div className="relative z-10 h-full flex flex-col lg:flex-row gap-8">
              <div className={`flex-1 relative ${skillsCanvasHeightClass} rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-900/40`}>
                {shouldRenderSkillsScene ? (
                  <Canvas className="rounded-2xl" performance={{ min: 0.8 }}>
                    <Suspense fallback={<CanvasLoader />}>
                      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 2}
                        autoRotate
                        autoRotateSpeed={2}
                      />

                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={0.8} color={COLORS.primary} />
                      <pointLight position={[-10, -10, 10]} intensity={0.6} color={COLORS.secondary} />
                      <spotLight position={[0, 15, 5]} intensity={0.7} angle={0.3} penumbra={1} />

                      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <SkillsVisualization3D />
                      </Float>
                    </Suspense>
                  </Canvas>
                ) : (
                  <ScenePlaceholder
                    title="Interactive scene paused"
                    description={
                      prefersReducedMotion
                        ? '3D motion is disabled to honor your system preference.'
                        : 'The full 3D experience shines on larger screens.'
                    }
                  />
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Expertise</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Blending technical precision with creative vision across multiple disciplines.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {DISCIPLINES.map((item, index) => (
                    <InfoPill key={item} index={index}>
                      {item}
                    </InfoPill>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Globe Card */}
          <Card className="lg:col-span-2">
            <div className="relative z-10 h-full flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 relative h-80 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl" />
                {shouldRenderGlobe ? (
                  <Globe
                    height={globeDimensions}
                    width={globeDimensions}
                    backgroundColor="rgba(0, 0, 0, 0)"
                    showAtmosphere
                    showGraticules
                    atmosphereColor="rgba(100, 200, 255, 0.2)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    labelsData={[{ 
                      lat: 45.33, 
                      lng: 14.45, 
                      text: 'Rijeka, Croatia', 
                      color: COLORS.primary, 
                      size: 18,
                      textColor: COLORS.primary
                    }]}
                  />
                ) : (
                  <ScenePlaceholder
                    title="Globe animation disabled"
                    description="Global collaboration stays the same—motion is just toned down per your system settings."
                  />
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Global Collaboration</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Based in Rijeka, working worldwide. I specialize in async workflows that 
                  maintain momentum and clarity across timezones.
                </p>
                <Button
                  name="Start Conversation"
                  isBeam
                  containerClass="w-full lg:w-auto group relative overflow-hidden bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                />
              </div>
            </div>
          </Card>

          {/* Story Card */}
          <Card hoverColor={COLORS.secondary}>
            <div className="relative z-10 h-full flex flex-col">
              <div className="relative rounded-2xl overflow-hidden mb-6 flex-1">
                <Image
                  src="/assets/grid3.png"
                  alt="Product Craft & Mentorship"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-white mb-3">Mentorship & Growth</h3>
                <p className="text-slate-300 leading-relaxed">
                  Empowering teams through knowledge sharing, process optimization, and 
                  sustainable development practices.
                </p>
              </div>
            </div>
          </Card>
          {/* Operating snapshot */}
          <Card className="lg:col-span-2">
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">Snapshot</p>
                <h3 className="text-3xl font-semibold text-white">How I partner with teams</h3>
                <p className="text-slate-300 leading-relaxed">
                  Async-first collaboration, clear decision rituals, and concise updates keep projects
                  moving no matter the time zone. Here&apos;s the quick overview before we hop on a call.
                </p>
                <Button
                  name="View availability"
                  containerClass="w-full sm:w-auto bg-linear-to-r from-slate-800 via-slate-900 to-slate-950 border border-white/5 px-6 py-3 rounded-2xl text-slate-100 font-semibold hover:border-cyan-400/40 transition-all duration-300"
                  href="#contact"
                />
              </div>

              <div className="flex-1 grid gap-3 text-left text-sm text-slate-300">
                {[
                  { label: 'Location', value: 'Rijeka, Croatia (CET)' },
                  { label: 'Availability', value: '2 partnerships / Q1 2024' },
                  { label: 'Response time', value: '< 24h async-first' },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/30 px-4 py-3"
                  >
                    <span 
                      className="h-2 w-2 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                      style={{ backgroundColor: COLORS.primary }}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">{info.label}</p>
                      <p className="text-base text-white">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          {/* Contact Card */}
          <Card className="xl:col-span-1 lg:col-span-2 xl:col-start-3">
            <div className="relative z-10 h-full flex flex-col gap-8 lg:flex-row lg:items-stretch">
              <div className="flex-1 flex flex-col items-center justify-center gap-6 lg:items-start">
                <div className="relative rounded-2xl overflow-hidden w-28 h-28 lg:w-32 lg:h-32">
                  <Image 
                    src="/assets/grid4.png" 
                    alt="Contact" 
                    fill 
                    className="object-cover rounded-full"
                    sizes="112px"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-semibold text-white mb-2">Let&apos;s Connect</h3>
                  <p className="text-slate-300">Choose your preferred way to reach out.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="w-full max-w-sm p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 group/button"
                  onClick={handleCopy}
                >
                  <div className="flex items-center justify-center gap-3 lg:justify-start">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={hasCopied ? 'copied' : 'copy'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Image
                          src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'}
                          alt={hasCopied ? 'Copied' : 'Copy email'}
                          width={20}
                          height={20}
                          className={hasCopied ? 'text-cyan-400' : 'text-slate-400'}
                        />
                      </motion.div>
                    </AnimatePresence>
                    <span className="text-lg text-slate-200 group-hover/button:text-cyan-400 transition-colors duration-300">
                      {CONTACT_EMAIL}
                    </span>
                  </div>
                </motion.button>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={hasCopied ? 'copied' : 'default'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-center lg:text-left ${
                      hasCopied ? 'text-cyan-400 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {hasCopied ? 'Copied to clipboard!' : 'Copy email or book a call'}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
