import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  HardHat,
  Save,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sliders,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'Metro Heights Tower A',
    units: 'metric',
    windThreshold: 38,
    ppeViolationThreshold: 85,
    autoAlertDispatch: true,
    emailAlerts: true,
    fastApiEndpoint: 'http://localhost:8000/api/v1',
    geminiModel: 'gemini-1.5-flash',
    engineerName: 'Alex Mercer',
    engineerRole: 'Lead Structural & Safety Engineer',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Platform & Intelligence Settings"
        subtitle="Manage project sites, safety alert threshold triggers, and backend API integration endpoints"
        badgeText="Configuration"
        badgeVariant="blue"
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        {[
          { id: 'general', label: 'General & Site', icon: HardHat },
          { id: 'safety', label: 'Safety Thresholds', icon: Shield },
          { id: 'api', label: 'Backend & AI Integration', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-white mb-2">Project Site Configuration</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Active Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Engineering Unit Standard
                </label>
                <select
                  value={settings.units}
                  onChange={(e) => setSettings({ ...settings, units: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                >
                  <option value="metric">Metric (Meters, mm, Celsius, km/h)</option>
                  <option value="imperial">Imperial (Feet, inches, Fahrenheit, mph)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Site Supervisor / Engineer
                </label>
                <input
                  type="text"
                  value={settings.engineerName}
                  onChange={(e) => setSettings({ ...settings, engineerName: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={settings.engineerRole}
                  onChange={(e) => setSettings({ ...settings, engineerRole: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Safety Thresholds Tab */}
        {activeTab === 'safety' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-white mb-2">Automated Alert Triggers</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tower Crane Wind Gust Ceiling (km/h)
                </label>
                <input
                  type="number"
                  value={settings.windThreshold}
                  onChange={(e) => setSettings({ ...settings, windThreshold: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400">Operations paused automatically when exceeded</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum Safety Compliance Score (%)
                </label>
                <input
                  type="number"
                  value={settings.ppeViolationThreshold}
                  onChange={(e) => setSettings({ ...settings, ppeViolationThreshold: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
                <span className="text-[11px] text-slate-400">Flags immediate supervisor intervention when score drops</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAlertDispatch}
                  onChange={(e) => setSettings({ ...settings, autoAlertDispatch: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-800"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Dispatch instant alert notification to mobile radios upon PPE violation
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-800"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Send end-of-shift daily safety and weather summary emails
                </span>
              </label>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Backend & AI Architecture Setup</h3>
              <Badge variant="amber">Phase 2-4 Plan</Badge>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Security Architecture Notice
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                As required by capstone guidelines, private API keys (Gemini, Weather API, Supabase Secret Keys) are strictly stored in the FastAPI backend environment (<code className="font-mono">backend/.env</code>) and NEVER exposed in frontend code.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  FastAPI Backend URL (Target for Phase 2 & 3)
                </label>
                <input
                  type="text"
                  value={settings.fastApiEndpoint}
                  onChange={(e) => setSettings({ ...settings, fastApiEndpoint: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Multimodal Reasoning LLM Model
                </label>
                <select
                  value={settings.geminiModel}
                  onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast multimodal inference)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep structural reasoning)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Save button and feedback */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Preferences updated successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
