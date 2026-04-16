import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/** Camera body with an eclipse ring as the lens */
export const IconCamera: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Camera body */}
    <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
    {/* Viewfinder bump */}
    <path d="M8.5 6V4.5A1.5 1.5 0 0 1 10 3h4a1.5 1.5 0 0 1 1.5 1.5V6" stroke="currentColor" strokeWidth="1.5" />
    {/* Eclipse lens — dark disc offset to create crescent */}
    <circle cx="12" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="13.2" cy="12.2" r="3.2" fill="currentColor" opacity="0.15" />
    {/* Corona glow accent */}
    <path d="M9 10.5a4.5 4.5 0 0 0-.5 2" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 9.5a4.5 4.5 0 0 0-1 1" stroke="#6BA3FF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/** Two overlapping face silhouettes merging with eclipse glow at intersection */
export const IconFaceFusion: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left face silhouette */}
    <path d="M7 20v-1a5 5 0 0 1 3-4.58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Right face silhouette */}
    <path d="M17 20v-1a5 5 0 0 0-3-4.58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="15.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    {/* Eclipse glow at intersection */}
    <circle cx="12" cy="8.5" r="2" fill="#6BA3FF" opacity="0.25" />
    <path d="M12 6a3.5 3.5 0 0 0 0 5" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Artist palette with eclipse ring as paint dot, brush accent */
export const IconStyleTransfer: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Palette shape */}
    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 8 10 8 1.1 0 2-.9 2-2 0-.5-.2-.97-.5-1.33A1.46 1.46 0 0 1 14.5 15c1.1 0 2-.9 2-2h3.5c1.1 0 2-.9 2-2 0-5.52-4.48-9-10-9Z" stroke="currentColor" strokeWidth="1.5" />
    {/* Regular paint dots */}
    <circle cx="7.5" cy="10" r="1.2" fill="currentColor" opacity="0.4" />
    <circle cx="10" cy="7" r="1.2" fill="currentColor" opacity="0.4" />
    <circle cx="15" cy="7.5" r="1.2" fill="currentColor" opacity="0.4" />
    {/* Eclipse ring paint dot — the accent */}
    <circle cx="7" cy="14" r="1.5" stroke="#6BA3FF" strokeWidth="1.2" />
    <circle cx="7.5" cy="13.7" r="0.8" fill="#6BA3FF" opacity="0.3" />
  </svg>
);

/** Cloud with upward arrow, eclipse crescent shape */
export const IconUpload: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cloud with eclipse crescent — slightly offset inner */}
    <path d="M6.5 19a4.5 4.5 0 0 1-.42-8.98A7 7 0 0 1 19.5 11a4.5 4.5 0 0 1 .5 8.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Eclipse crescent accent on cloud */}
    <path d="M8 12a4 4 0 0 1 6-3.46" stroke="#6BA3FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    {/* Upload arrow */}
    <path d="M12 22v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 17l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Wand with sparking tip, geometric starburst */
export const IconWand: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wand body */}
    <path d="M15 4l-11 11 4 4 11-11-4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 6l4 4" stroke="currentColor" strokeWidth="1.5" />
    {/* Starburst at tip */}
    <path d="M19 2v4" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 4h4" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 6l-1.5-1.5" stroke="#6BA3FF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M17 2l1.5 1.5" stroke="#6BA3FF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/** Three-pointed star with eclipse crescent detail */
export const IconSparkles: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Main four-pointed star */}
    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Eclipse crescent inside */}
    <path d="M13 9a3 3 0 0 0-2.5 4" stroke="#6BA3FF" strokeWidth="1.2" strokeLinecap="round" />
    {/* Small accent star */}
    <path d="M19 3l0.5 1.5L21 5l-1.5 0.5L19 7l-0.5-1.5L17 5l1.5-0.5L19 3Z" fill="#6BA3FF" opacity="0.5" />
  </svg>
);

/** Gear with eclipse crescent cut-out */
export const IconSettings: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Gear teeth path */}
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5" />
    {/* Eclipse crescent center instead of simple circle */}
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="13" cy="11.2" r="2" fill="currentColor" opacity="0.12" />
    <path d="M10.2 10.5a3 3 0 0 0 0 3" stroke="#6BA3FF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Clock face as eclipse ring — broken circle with gap */
export const IconHistory: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Eclipse ring — broken circle */}
    <path d="M21 12a9 9 0 1 1-3-6.72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Gap glow */}
    <path d="M21 12a9 9 0 0 0-3-6.72" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    {/* Clock hands */}
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Center dot */}
    <circle cx="12" cy="12" r="0.8" fill="#6BA3FF" />
  </svg>
);

/** Question mark inside an eclipse corona ring */
export const IconGuide: React.FC<IconProps> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer corona ring */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    {/* Eclipse crescent glow */}
    <path d="M5 8a10 10 0 0 0-1 4" stroke="#6BA3FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M5.5 6.5a10 10 0 0 0-1.5 2" stroke="#6BA3FF" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    {/* Question mark */}
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
);
