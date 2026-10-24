import React from 'react';

const VARIANT_MAP = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  blue: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  slate: 'bg-slate-800 text-slate-300 border-slate-700',
};

export default function Badge({ children, variant = 'blue', size = 'sm', className = '' }) {
  const colorClasses = VARIANT_MAP[variant] || VARIANT_MAP.blue;
  const sizeClasses = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full font-mono tracking-wide ${colorClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
}
