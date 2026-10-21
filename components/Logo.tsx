'use client'

import { useSiteConfig } from './providers/SiteDataProvider'

interface LogoProps {
  className?: string
  size?: number
  showSubtitle?: boolean
}

export function Logo({ className = '', size = 36, showSubtitle = true }: LogoProps) {
  let brandName = '//MAYK'
  let brandSubtitle = 'SYSTEMS ARCHITECT'

  try {
    const { config } = useSiteConfig()
    if (config?.brand_name) brandName = config.brand_name
    if (config?.brand_subtitle) brandSubtitle = config.brand_subtitle
  } catch {
    // static fallback
  }

  return (
    <div className={`relative flex items-center gap-3 group cursor-pointer select-none ${className}`}>
      {/* Bespoke Geometric Brandmark: Isometric Prism + Terminal Execution Chevron + Relational Nexus */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="prismFaceA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="prismFaceB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" />
            <stop offset="100%" stopColor="#FF3D00" />
          </linearGradient>
          <linearGradient id="accentGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B2B" />
            <stop offset="100%" stopColor="#FF8F5E" />
          </linearGradient>
          <filter id="coreGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Isometric Hexagonal Diamond Shield */}
        <polygon
          points="50,6 90,28 90,72 50,94 10,72 10,28"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="2.5"
          fill="rgba(10, 22, 40, 0.4)"
          className="transition-all duration-500 group-hover:stroke-accent/60"
        />

        {/* Structural Isometric Axes forming the "M" and Terminal Chevron ">" */}
        {/* Left pillar of M */}
        <path
          d="M26 68V34L50 50"
          stroke="url(#prismFaceA)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right pillar of M and fold */}
        <path
          d="M74 68V34L50 50"
          stroke="url(#prismFaceA)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Isometric Center Axis */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="82"
          stroke="url(#prismFaceA)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />

        {/* Dynamic Execution Chevron & Data Trace ">" in Electric Ember */}
        <path
          d="M40 38L56 50L40 62"
          stroke="url(#prismFaceB)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#coreGlow)"
        />

        {/* Relational Database Core Node */}
        <circle
          cx="56"
          cy="50"
          r="4.5"
          fill="#FF5722"
          filter="url(#coreGlow)"
        />
        <circle
          cx="56"
          cy="50"
          r="2"
          fill="#FFFFFF"
        />
      </svg>

      {/* Modern Developer Brand Typography */}
      <div className="flex flex-col">
        <span className="font-mono font-bold text-lg leading-none tracking-tight text-white flex items-center group-hover:text-accent transition-colors duration-300">
          {brandName}
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-mono tracking-[0.2em] text-gray-400 uppercase mt-1">
            {brandSubtitle}
          </span>
        )}
      </div>
    </div>
  )
}
