import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sf-logo-bg" x1="0" y1="0" x2="32" y2="32">
        <stop offset="0%" stopColor="#6BA3FF" />
        <stop offset="100%" stopColor="#4A7FD4" />
      </linearGradient>
      <linearGradient id="sf-logo-inner" x1="8" y1="8" x2="24" y2="24">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="100%" stopColor="#9DC4FF" />
      </linearGradient>
    </defs>

    {/* Rounded square background */}
    <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#sf-logo-bg)" />

    {/* Aperture blades — 6 curved petals */}
    <g opacity="0.15" fill="white">
      <path d="M16 4 L20 10 L16 8 Z" />
      <path d="M26 10 L22 16 L24 12 Z" />
      <path d="M26 22 L20 20 L24 22 Z" />
      <path d="M16 28 L12 22 L16 24 Z" />
      <path d="M6 22 L10 16 L8 20 Z" />
      <path d="M6 10 L12 12 L8 10 Z" />
    </g>

    {/* Outer ring */}
    <circle cx="16" cy="16" r="9" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" />

    {/* Inner aperture hole */}
    <circle cx="16" cy="16" r="5" fill="#050507" opacity="0.6" />

    {/* Center spark */}
    <circle cx="16" cy="16" r="2.5" fill="url(#sf-logo-inner)" />

    {/* Flash / spark lines */}
    <line x1="16" y1="10" x2="16" y2="12.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="16" y1="19.5" x2="16" y2="22" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="10" y1="16" x2="12.5" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <line x1="19.5" y1="16" x2="22" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);
