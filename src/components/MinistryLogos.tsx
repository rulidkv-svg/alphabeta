import React, { useState } from 'react';

interface MinistryLogoProps {
  customUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'badge';
}

const KEMNAKER_DRIVE_URL = 'https://lh3.googleusercontent.com/d/1ImJUe9V03aRTMuwmJhakxhFy0o-5417T';
const KEMDIKDASMEN_DRIVE_URL = 'https://lh3.googleusercontent.com/d/18kxXzzv1Lk5XmTM2Z88_k4mVDPmANkoj';

/**
 * Official Logo: Kementerian Ketenagakerjaan Republik Indonesia (Kemnaker)
 * Uses high-res drive image with fallback to crisp vector SVG
 */
export const KemnakerLogo: React.FC<MinistryLogoProps> = ({
  customUrl,
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  const [imgError, setImgError] = useState(false);

  const logoUrl = customUrl || KEMNAKER_DRIVE_URL;

  const heightClasses = {
    xs: 'h-7',
    sm: 'h-9',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  };

  const hClass = heightClasses[size] || 'h-12';

  if (!imgError) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={logoUrl}
          alt="Kementerian Ketenagakerjaan RI"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className={`${hClass} w-auto object-contain transition-opacity duration-300`}
        />
      </div>
    );
  }

  // Fallback SVG if image link is blocked or offline
  const textColor = variant === 'badge' ? '#FFFFFF' : '#0B3B60';
  const symbolColor = variant === 'badge' ? '#38BDF8' : '#0B3B60';

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 320 90"
        className={`${hClass} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={symbolColor}>
          <circle cx="12" cy="45" r="4.5" />
          <circle cx="78" cy="45" r="4.5" />
          <circle cx="45" cy="12" r="4.5" />
          <circle cx="45" cy="78" r="4.5" />
          <circle cx="22" cy="22" r="4.5" />
          <circle cx="68" cy="22" r="4.5" />
          <circle cx="22" cy="68" r="4.5" />
          <circle cx="68" cy="68" r="4.5" />
          <g transform="translate(45,45) rotate(45) translate(-45,-45)">
            <rect x="40" y="16" width="10" height="58" rx="5" />
            <rect x="16" y="40" width="58" height="10" rx="5" />
            <rect x="27" y="27" width="10" height="36" rx="5" />
            <rect x="53" y="27" width="10" height="36" rx="5" />
            <rect x="27" y="27" width="36" height="10" rx="5" />
            <rect x="27" y="53" width="36" height="10" rx="5" />
          </g>
        </g>
        <text x="96" y="24" fill={textColor} fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16.5" letterSpacing="0.6">KEMENTERIAN</text>
        <text x="96" y="43" fill={textColor} fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16.5" letterSpacing="0.6">KETENAGAKERJAAN</text>
        <text x="96" y="62" fill={textColor} fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16.5" letterSpacing="0.6">REPUBLIK</text>
        <text x="96" y="81" fill={textColor} fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16.5" letterSpacing="0.6">INDONESIA</text>
      </svg>
    </div>
  );
};

/**
 * Official Logo: Kementerian Pendidikan Dasar & Menengah RI / Tut Wuri Handayani
 * Uses high-res drive image with fallback to crisp vector SVG
 */
export const KemdikdasmenLogo: React.FC<MinistryLogoProps> = ({
  customUrl,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const logoUrl = customUrl || KEMDIKDASMEN_DRIVE_URL;

  const heightClasses = {
    xs: 'h-8',
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  };

  const hClass = heightClasses[size] || 'h-12';

  if (!imgError) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={logoUrl}
          alt="Kementerian Pendidikan Dasar dan Menengah RI"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className={`${hClass} w-auto object-contain transition-opacity duration-300`}
        />
      </div>
    );
  }

  // Fallback SVG if image link is blocked or offline
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className={`${hClass} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 10 L 188 52 L 165 160 L 100 190 L 35 160 L 12 52 Z"
          fill="#2382D0"
          stroke="#1D71B8"
          strokeWidth="1.5"
        />
        <path id="tut-wuri-arc" d="M 38 68 A 72 72 0 0 1 162 68" fill="none" />
        <text fontSize="12" fontWeight="900" fill="#000000" letterSpacing="0.8">
          <textPath href="#tut-wuri-arc" startOffset="50%" textAnchor="middle">
            TUT WURI HANDAYANI
          </textPath>
        </text>
        <g stroke="#000000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M 100 52 C 92 68 85 82 72 78 C 58 74 48 88 40 102 C 32 116 48 128 58 132 C 68 136 78 130 84 126 C 92 120 96 112 100 106 C 104 112 108 120 116 126 C 122 130 132 136 142 132 C 152 128 168 116 160 102 C 152 88 142 74 128 78 C 115 82 108 68 100 52 Z"
            fill="#FFFFFF"
          />
          <path d="M 46 110 C 56 108 68 118 78 122" fill="none" />
          <path d="M 52 120 C 62 120 72 124 80 126" fill="none" />
          <path d="M 154 110 C 144 108 132 118 122 122" fill="none" />
          <path d="M 148 120 C 138 120 128 124 120 126" fill="none" />
          <path d="M 100 52 L 100 100" fill="none" />
          <path d="M 90 60 C 88 78 96 92 100 98" fill="none" />
          <path d="M 110 60 C 112 78 104 92 100 98" fill="none" />
          <path
            d="M 100 100 C 92 112 90 124 100 138 C 110 124 108 112 100 100 Z"
            fill="#FFD100"
          />
          <path
            d="M 100 106 C 95 115 94 122 100 132 C 106 122 105 115 100 106 Z"
            fill="#FFAA00"
          />
          <path
            d="M 55 150 Q 100 142 100 152 Q 100 142 145 150 L 142 165 Q 100 155 100 162 Q 100 155 58 165 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};
