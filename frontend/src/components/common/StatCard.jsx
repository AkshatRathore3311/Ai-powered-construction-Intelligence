import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  delta,
  deltaType = 'positive', // positive, negative, neutral
  icon: Icon,
  accentColor = 'amber',
}) {
  const accentClasses = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[accentColor] || 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const deltaColors = {
    positive: 'text-emerald-400 bg-emerald-500/10',
    negative: 'text-rose-400 bg-rose-500/10',
    neutral: 'text-slate-400 bg-slate-800',
  }[deltaType] || 'text-slate-400 bg-slate-800';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all duration-200 shadow-sm relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
            {delta && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${deltaColors}`}>
                {delta}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${accentClasses} transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
