import React from 'react';
import Badge from './Badge';

export default function SectionHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'blue',
  actions,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h1>
          {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
        </div>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
