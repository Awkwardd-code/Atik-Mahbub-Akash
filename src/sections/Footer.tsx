/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

type FooterLink = {
  name: string;
  href: string;
};

type SocialLink = {
  name: string;
  url: string;
  icon: string;
  color: string;
};

type HighlightTile = {
  title: string;
  detail: string;
  gradient: string;
  glow: string;
  meta: string;
  tilt: { x: number; y: number };
};

type OrbitStat = {
  label: string;
  value: string;
  tag: string;
};

const footerLinks: FooterLink[] = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Client Stories', href: '#clients' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: '/assets/github.svg',
    color: 'hover:text-slate-900 dark:hover:text-slate-100',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: '/assets/twitter.svg',
    color: 'hover:text-sky-400',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: '/assets/instagram.svg',
    color: 'hover:text-pink-500',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: '/assets/linkedin.svg',
    color: 'hover:text-blue-500',
  },
];

const highlightTiles: HighlightTile[] = [
  {
    title: 'Precision Builds',
    detail: 'Design systems engineered for scale.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(76,29,149,0.05))',
    glow: 'linear-gradient(135deg, rgba(139,92,246,0.45), transparent)',
    meta: 'Tokens, docs & QA automation',
    tilt: { x: 6, y: -8 },
  },
  {
    title: 'Immersive WebGL',
    detail: '3D experiences with buttery performance.',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.35), rgba(59,130,246,0.08))',
    glow: 'linear-gradient(135deg, rgba(14,165,233,0.35), transparent)',
    meta: 'Three.js + GLSL pipelines',
    tilt: { x: 5, y: 6 },
  },
  {
    title: 'Strategic Partner',
    detail: 'Collaborative roadmaps with founders.',
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.35), rgba(249,115,22,0.08))',
    glow: 'linear-gradient(135deg, rgba(244,114,182,0.4), transparent)',
    meta: 'Workshops, roadmaps, retros',
    tilt: { x: 4, y: -5 },
  },
  {
    title: 'Rapid Iteration',
    detail: 'Tangible prototypes in days, not weeks.',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.35), rgba(190,242,100,0.08))',
    glow: 'linear-gradient(135deg, rgba(52,211,153,0.4), transparent)',
    meta: 'Design + dev in tight loops',
    tilt: { x: 6, y: 5 },
  },
];

const orbitStats: OrbitStat[] = [
  { label: 'Avg timeline', value: '6-8 wks', tag: 'Product launch' },
  { label: 'Collab zone', value: 'GMT+6', tag: 'Async + live' },
  { label: 'Success rate', value: '97%', tag: 'Repeat founders' },
  { label: 'Shot volume', value: '24 scenes', tag: 'Per experience' },
];

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

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmallScreenQuery = useMediaQuery({ maxWidth: 768 });
  const isTabletScreenQuery = useMediaQuery({ minWidth: 769, maxWidth: 1280 });
  const isSmallScreen = isClient && isSmallScreenQuery;
  const isTabletScreen = isClient && isTabletScreenQuery;
  const animationsEnabled = !prefersReducedMotion;
  const sectionPaddingClass = isSmallScreen ? 'px-4 py-12' : 'px-6 py-16 lg:py-20';
  const gridGapClass = isSmallScreen ? 'gap-8' : 'gap-10 lg:gap-12';
  const highlightGridClass = isSmallScreen ? 'grid-cols-1' : 'sm:grid-cols-2';
  const orbitGridClass = isSmallScreen ? 'grid-cols-1' : 'sm:grid-cols-2';
  const footerNavSpacing = isSmallScreen ? 'space-y-12' : 'space-y-16';
  const highlightTilesWithTransforms = useMemo(() => {
    if (isSmallScreen) {
      return highlightTiles.map(tile => ({
        ...tile,
        tilt: { x: 0, y: 0 },
      }));
    }
    return highlightTiles;
  }, [isSmallScreen]);

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/60 bg-linear-to-b from-slate-50 to-slate-100 dark:border-slate-700/60 dark:from-slate-900 dark:to-slate-800">
      {animationsEnabled && (
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[64px_64px]" />
          <div className="absolute -top-24 left-1/4 h-48 w-96 -skew-y-6 rounded-[40px] border border-white/5 bg-white/10 shadow-[0_45px_120px_rgba(15,23,42,0.25)] backdrop-blur-2xl" />
          <div className="absolute -bottom-32 right-1/3 h-56 w-56 rotate-35 rounded-[30px] border border-white/10 bg-linear-to-br from-white/10 via-transparent to-transparent shadow-[0_50px_120px_rgba(15,23,42,0.35)]" />
        </div>
      )}

      <div className={`relative z-10 mx-auto max-w-7xl ${sectionPaddingClass}`}>
        <div className={footerNavSpacing}>
          <div className={`grid ${gridGapClass} lg:grid-cols-12`}>
            <div className="space-y-8 lg:col-span-6">
              <div
                className="inline-block rounded-3xl border border-white/10 bg-white/80 px-6 py-4 shadow-[0_25px_80px_rgba(15,23,42,0.15)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 dark:border-slate-700/70 dark:bg-slate-900/80 transform-gpu"
                style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
              >
                <p className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-200">
                  Atik
                </p>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-400">
                Crafting cinematic, interactive experiences for visionary founders building tomorrow&apos;s most impactful brands.
              </p>

              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Available for new collaborations
              </div>

              <div className="relative" style={{ perspective: '1400px' }}>
                <div className={`grid gap-4 ${highlightGridClass}`}>
                  {highlightTilesWithTransforms.map((tile) => (
                    <div
                      key={tile.title}
                      className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.25)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-1 dark:border-slate-700/60 dark:bg-slate-900/70 transform-gpu"
                      style={{
                        transform: `rotateX(${tile.tilt.x}deg) rotateY(${tile.tilt.y}deg) translateZ(18px)`,
                        transformStyle: 'preserve-3d',
                        backgroundImage: tile.gradient,
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-60 blur-2xl"
                        style={{ backgroundImage: tile.glow }}
                        aria-hidden
                      />
                      <div className="relative space-y-2">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                          {tile.title}
                        </p>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {tile.detail}
                        </p>
                        <div className="h-px w-full bg-white/40 dark:bg-slate-600/40" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">{tile.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                className="relative h-full min-h-[360px] rounded-[40px] border border-white/20 bg-slate-950/80 p-8 shadow-[0_45px_140px_rgba(2,6,23,0.55)] backdrop-blur-2xl transform-gpu"
                style={{ perspective: '1800px', transformStyle: 'preserve-3d' }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-8 rounded-4xl bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
                <div className="pointer-events-none absolute -right-10 top-10 h-52 w-52 rounded-full bg-linear-to-br from-violet-500/40 to-cyan-400/20 blur-3xl" />
                <div className="relative flex h-full flex-col justify-between space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                      Live pipeline
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">
                      Immersive launch decks & experiential microsites
                    </h3>
                    <p className="mt-4 text-base text-slate-300">
                      Synthesizing narrative, motion, and 3D layers into cohesive worlds that feel tactile and alive.
                    </p>
                  </div>
                  <div className={`grid gap-4 ${orbitGridClass}`}>
                    {orbitStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-inner shadow-black/40"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                        <p className="mt-1 text-sm text-slate-300">{stat.tag}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Currently onboarding
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                      <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Stack</span>
                      <span className="text-white">Next • Three • Motion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid ${gridGapClass} lg:grid-cols-12`}>
            <div className="lg:col-span-5">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Navigation
              </p>
              <nav className="grid gap-4 text-slate-600 dark:text-slate-400">
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-2 text-base transition-all duration-300 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-300 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-slate-500" />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Let&apos;s Connect
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Ready to start your next project? Let&apos;s create something extraordinary together.
              </p>

              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    aria-label={`${social.name} profile`}
                    className={`group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transform-gpu ${social.color}`}
                    style={{ boxShadow: '0 25px 60px rgba(15,23,42,0.15)' }}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>

              <a
                href="mailto:somethinn999awkwardd@gmail.com"
                className="inline-flex items-center gap-3 text-slate-600 transition-colors duration-300 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  @
                </span>
                <span className="text-base">somethinn999awkwardd@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200/60 pt-8 dark:border-slate-700/60">
          <div className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-center lg:text-left">
              &copy; {currentYear} Atik Mahbub Akash. Crafted with intent in Dhaka, Bangladesh.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-blue-500 to-purple-500" />
                <span>Built with Next.js & Three.js</span>
              </div>
              <div className="flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-emerald-400 to-cyan-400" />
                <span>Deployed on Vercel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <button
            type="button"
            onClick={handleScrollTop}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:text-slate-900 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 transform-gpu"
            aria-label="Back to top"
          >
            <Image
              src="/assets/arrow-up.png"
              alt="Back to top"
              width={16}
              height={16}
              className="animate-bounce opacity-70 transition-opacity duration-300 group-hover:opacity-100"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
