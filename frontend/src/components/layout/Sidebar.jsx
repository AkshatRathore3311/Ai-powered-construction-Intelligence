import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Scan,
  Building2,
  CalendarRange,
  CloudSun,
  Bot,
  History,
  Settings,
  HardHat,
  X,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/safety', label: 'Safety Monitoring', icon: ShieldAlert, badge: 'Vision' },
  { to: '/crack-detection', label: 'Crack Detection', icon: Scan, badge: 'Vision' },
  { to: '/valuation', label: 'Real Estate Valuation', icon: Building2 },
  { to: '/planning', label: 'Project Planning', icon: CalendarRange },
  { to: '/daily-weather', label: 'Site & Weather Advisory', icon: CloudSun },
  { to: '/assistant', label: 'Knowledge Assistant', icon: Bot, badge: 'LLM' },
  { to: '/history', label: 'Analysis History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <HardHat className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">BuildIntel</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-semibold">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Multimodal Platform</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Platform Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-medium border ${
                          isActive
                            ? 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1">
              <span>Capstone Project</span>
              <span className="text-[10px] text-amber-400 font-mono">Phase 1</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Frontend UI Architecture. Connects to FastAPI & Multimodal AI in next phases.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
