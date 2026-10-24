import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function ErrorAlert({
  title = "Analysis Error",
  message = "An error occurred while processing the request. Please check input parameters and retry.",
  onRetry,
  onDismiss,
}) {
  return (
    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start justify-between gap-3 text-rose-200 my-4">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-rose-500/20 rounded-lg text-rose-400 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">{title}</h4>
          <p className="text-xs text-rose-200/90 mt-0.5">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 px-2.5 py-1 rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Operation
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-white p-1 rounded hover:bg-rose-500/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
