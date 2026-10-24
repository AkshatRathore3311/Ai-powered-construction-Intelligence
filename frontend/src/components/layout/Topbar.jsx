import React, { useState } from 'react';
import { Menu, Bell, MapPin, ChevronDown, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { SAMPLE_SITES } from '../../data/sampleData';
import Badge from '../common/Badge';

export default function Topbar({ onOpenMobile }) {
  const [selectedSite, setSelectedSite] = useState(SAMPLE_SITES[0]);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Active Site Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Site Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSiteMenuOpen(!siteMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {selectedSite.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ({selectedSite.code})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {siteMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Switch Active Project Site
              </div>
              {SAMPLE_SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => {
                    setSelectedSite(site);
                    setSiteMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2 hover:bg-slate-800 transition-colors ${
                    selectedSite.id === site.id ? 'bg-amber-400/10 text-amber-300' : 'text-slate-300'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-medium text-white">{site.name}</div>
                    <div className="text-[10px] text-slate-400">{site.location}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Status Indicators & Alerts */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Phase Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-slate-400">Environment:</span>
          <span className="font-semibold text-white">Phase 1 UI Shell</span>
        </div>

        {/* Live Site Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>Site Monitored</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full"></span>
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-white">Active System Alerts</span>
                <span className="text-[10px] text-amber-400 font-mono">3 New</span>
              </div>
              <div className="space-y-3 mt-3">
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20">
                  <div className="font-medium text-rose-300">PPE Alert in Zone 3</div>
                  <div className="text-[10px] text-slate-400">Worker detected without required hardhat.</div>
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                  <div className="font-medium text-amber-300">High Wind Warning</div>
                  <div className="text-[10px] text-slate-400">Gusts over 30 km/h expected by 14:00.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / User info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
            SE
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Site Engineer</div>
            <div className="text-[10px] text-slate-400">Project Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
