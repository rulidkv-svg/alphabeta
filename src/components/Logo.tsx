import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'full' | 'icon' | 'badge' | 'image';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showTagline = true,
}) => {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16',
    full: 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    full: 'text-4xl',
  };

  const LogoIcon = (
    <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="abPrimaryGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E40AF" />
            <stop offset="0.5" stopColor="#2563EB" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="abAccentGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Soft Modern Hexagonal Rounded Base */}
        <rect x="8" y="8" width="104" height="104" rx="28" fill="url(#abPrimaryGrad)" />

        {/* Subtle Inner Lighting */}
        <rect x="10" y="10" width="100" height="100" rx="26" stroke="white" strokeOpacity="0.15" strokeWidth="2" />

        {/* Stylized 'A' and 'B' Learning Shield / Graduation Cap */}
        <path
          d="M60 26L90 42L60 58L30 42L60 26Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Tassel */}
        <path
          d="M86 44V66"
          stroke="url(#abAccentGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="86" cy="69" r="3.5" fill="#FBBF24" />

        {/* Book pages / Alpha Curve base */}
        <path
          d="M38 52C46 56 54 58 60 58C66 58 74 56 82 52V76C74 80 66 82 60 82C54 82 46 80 38 76V52Z"
          fill="white"
          fillOpacity="0.88"
        />
        {/* Center Spine */}
        <path d="M60 58V82" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Academic Star Spark */}
        <path
          d="M60 90L62 95L67 95.5L63 99L64.5 104L60 101L55.5 104L57 99L53 95.5L58 95L60 90Z"
          fill="#FBBF24"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none flex items-center gap-1.5 ${textSizes[size]}`}>
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent font-black tracking-tight">
            ALPHA BETA
          </span>
          <span className="text-slate-800 font-extrabold tracking-tight">
            LEARNING CENTER
          </span>
        </div>

        {showTagline && size !== 'xs' && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-tight">
              Belajar • Berlatih • Bersertifikat • Siap Kerja
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


