'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

type TechLogo = {
  name: string;
  accent: string;
  glow: string;
  src?: string;
  icon?: ReactNode;
};

const RoundedIcon = ({
  label,
  bg,
  color,
  secondary,
}: {
  label: string;
  bg: string;
  color: string;
  secondary?: string;
}) => (
  <svg
    width="46"
    height="46"
    viewBox="0 0 64 64"
    className="w-[46px] h-[46px]"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="16" fill={bg} />
    {secondary && (
      <path
        d="M12 52L52 12"
        stroke={secondary}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.2"
      />
    )}
    <text
      x="32"
      y="36"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Inter, 'Segoe UI', sans-serif"
      fontWeight="700"
      fontSize="22"
      fill={color}
    >
      {label}
    </text>
  </svg>
);

const techLogos: TechLogo[] = [
  { name: 'TypeScript', src: '/assets/typescript.png', accent: '#3178c6', glow: 'rgba(49, 120, 198, 0.35)' },
  {
    name: 'JavaScript',
    accent: '#f7df1e',
    glow: 'rgba(247, 223, 30, 0.35)',
    icon: <RoundedIcon label="JS" bg="#1c1c1c" color="#f7df1e" />,
  },
 
  {
    name: 'Next.js',
    accent: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.3)',
    icon: (
      <svg width="46" height="46" viewBox="0 0 64 64" className="w-[46px] h-[46px]" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#0f172a" />
        <path
          d="M20 44L44 20"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M26 20H38C41.3137 20 44 22.6863 44 26V38"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
 
  {
    name: 'Node.js',
    accent: '#3c873a',
    glow: 'rgba(60, 135, 58, 0.35)',
    icon: (
      <svg width="46" height="46" viewBox="0 0 64 64" className="w-[46px] h-[46px]" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#052e16" />
        <path
          d="M32 16L48 24V40L32 48L16 40V24L32 16Z"
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
        />
        <text
          x="32"
          y="35"
          textAnchor="middle"
          fontFamily="Inter, 'Segoe UI', sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="#22c55e"
        >
          Node
        </text>
      </svg>
    ),
  },
 
  {
    name: 'Python',
    accent: '#3776ab',
    glow: 'rgba(55, 118, 171, 0.3)',
    icon: (
      <svg width="46" height="46" viewBox="0 0 64 64" className="w-[46px] h-[46px]" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#020617" />
        <path
          d="M20 28C20 23.5817 23.5817 20 28 20H36C40.4183 20 44 23.5817 44 28V44C44 48.4183 40.4183 52 36 52H28C23.5817 52 20 48.4183 20 44V28Z"
          fill="#facc15"
        />
        <path
          d="M20 36C20 31.5817 23.5817 28 28 28H36C40.4183 28 44 31.5817 44 36V44C44 48.4183 40.4183 52 36 52H28C23.5817 52 20 48.4183 20 44V36Z"
          fill="#2563eb"
          opacity="0.85"
        />
        <circle cx="28.5" cy="30.5" r="2.5" fill="#020617" />
        <circle cx="35.5" cy="45.5" r="2.5" fill="#020617" />
      </svg>
    ),
  },
  { name: 'Figma', src: '/assets/figma.svg', accent: '#f472b6', glow: 'rgba(244, 114, 182, 0.25)' },
  
];

const HeroTechLogos = () => {
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageError = (logoName: string) => {
    console.error(`Failed to load image for ${logoName}`);
    setErrorImages(prev => new Set(prev).add(logoName));
  };

  const handleImageLoad = (logoName: string) => {
    console.log(`Successfully loaded image for ${logoName}`);
  };

  return (
    <div className="hero-tech-cloud grid grid-cols-2 gap-5 w-full max-w-md" aria-hidden="true">
      {techLogos.map((logo, index) => (
        <div
          key={logo.name}
          className="hero-tech-logo relative flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-md"
          style={{
            animationDelay: `${index * 0.2}s`,
            borderColor: `${logo.accent}30`,
            boxShadow: `0 25px 45px ${logo.glow}`,
          }}
        >
          <span
            className="hero-tech-orb absolute inset-0 rounded-3xl opacity-35 blur-lg pointer-events-none"
            style={{ background: `radial-gradient(circle at 30% 30%, ${logo.accent}, transparent 65%)` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 min-h-[90px]">
            {logo.src && !errorImages.has(logo.name) ? (
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={46}
                height={46}
                priority={index < 2}
                draggable={false}
                onError={() => handleImageError(logo.name)}
                onLoad={() => handleImageLoad(logo.name)}
                style={{ objectFit: 'contain' }}
                className="w-[46px] h-[46px]"
              />
            ) : logo.icon ? (
              logo.icon
            ) : (
              // Fallback for failed images without custom icons
              <div className="flex items-center justify-center w-[46px] h-[46px] bg-slate-700 rounded-lg text-slate-400 text-xs font-semibold">
                {logo.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <p className="text-sm font-semibold text-white text-center">{logo.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroTechLogos;
