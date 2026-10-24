import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = "Processing request...",
  subtext = "Fetching data and synchronizing site metrics",
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
      <h4 className="text-sm font-semibold text-white tracking-wide">{message}</h4>
      {subtext && <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtext}</p>}
    </div>
  );
}
