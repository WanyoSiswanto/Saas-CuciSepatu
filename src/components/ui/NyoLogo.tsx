import React from 'react';

interface NyoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  tagline?: string;
  className?: string;
}

export function NyoLogo({
  size = 'md',
  showText = false,
  tagline,
  className = '',
}: NyoLogoProps) {
  const badgeSizes = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-2xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-14 h-14 rounded-3xl text-lg',
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-2 h-2',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Iconic Graphic Badge */}
      <div
        className={`${badgeSizes[size]} bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20 select-none shrink-0 relative overflow-hidden transition group-hover:scale-105`}
      >
        <div className="flex items-baseline tracking-tight lowercase">
          <span className="font-black">nyo</span>
          <span className={`${dotSizes[size]} rounded-full bg-amber-300 ml-0.5 animate-pulse`} />
        </div>
      </div>

      {/* Optional Side Brand Typography */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              Nyo<span className="text-blue-600">Clean</span>
            </span>
          </div>
          {tagline && (
            <p className="text-[10px] text-slate-500 font-semibold">{tagline}</p>
          )}
        </div>
      )}
    </div>
  );
}
