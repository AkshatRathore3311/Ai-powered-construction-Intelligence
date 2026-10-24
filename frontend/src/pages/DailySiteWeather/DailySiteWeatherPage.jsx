import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  PlusCircle,
  Clock,
  Users,
  Compass,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_WEATHER_DATA } from '../../data/sampleData';

export default function DailySiteWeatherPage() {
  const [weatherData] = useState(SAMPLE_WEATHER_DATA);
  const [viewState, setViewState] = useState('normal');
  const [newLog, setNewLog] = useState({
    shift: 'Day Shift (08:00 - 17:00)',
    workerCount: 42,
    highRiskWork: 'Crane Lifts & Facade Installation',
    supervisorNotes: 'Morning concrete pour for Column C12 completed before noon. Wind gusts under threshold.',
  });
  const [recentLogs, setRecentLogs] = useState([
    {
      id: 'LOG-304',
      date: 'Today - Oct 25, 2026',
      shift: 'Morning Shift',
      workerCount: 42,
      weather: '24°C, Partly Cloudy, 22 km/h Wind',
      status: 'Normal Operations',
    },
    {
      id: 'LOG-303',
      date: 'Yesterday - Oct 24, 2026',
      shift: 'Day Shift',
      workerCount: 48,
      weather: '26°C, Clear, 18 km/h Wind',
      status: 'Normal Operations',
    },
  ]);
  const [logSubmitted, setLogSubmitted] = useState(false);

  const handleLogSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: `LOG-${305 + recentLogs.length}`,
      date: 'Just Now',
      shift: newLog.shift,
      workerCount: Number(newLog.workerCount),
      weather: `${weatherData.current.temp}, ${weatherData.current.condition}`,
      status: 'Verified by Engineer',
    };
    setRecentLogs([entry, ...recentLogs]);
    setLogSubmitted(true);
    setTimeout(() => setLogSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Site Assistant & Weather Advisory"
        subtitle="Real-time environmental telemetry, crane wind hazard thresholds, and concrete curing condition checks"
        badgeText="Weather Telemetry"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">UI Test Modes:</span>
            <select
              value={viewState}
              onChange={(e) => setViewState(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="normal">Normal Mode</option>
              <option value="loading">Loading State</option>
              <option value="empty">Empty State</option>
              <option value="error">Error State</option>
            </select>
          </div>
        }
      />

      {viewState === 'loading' && (
        <LoadingState
          message="Querying Live Meteorological Station..."
          subtext="Fetching barometric pressure, wind vector sensors, and ambient humidity"
        />
      )}

      {viewState === 'error' && (
        <ErrorAlert
          title="Weather API Satellite Link Lost"
          message="Could not connect to regional meteorological telemetry stream. (Simulated test error)."
          onRetry={() => setViewState('normal')}
          onDismiss={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Weather Telemetry Received"
          description="Local weather station is currently offline. Connect API key in Settings."
          actionLabel="Switch to Simulated Feed"
          onAction={() => setViewState('normal')}
        />
      )}

      {viewState === 'normal' && (
        <>
          {/* Weather KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Ambient Temp</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">{weatherData.current.temp}</p>
              <span className="text-[10px] text-slate-400">{weatherData.current.condition}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Wind Velocity</span>
              <p className="text-2xl font-black text-sky-400 font-mono mt-1">{weatherData.current.windSpeed}</p>
              <span className="text-[10px] text-emerald-400">Below Crane Limit</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Wind Gust Peak</span>
              <p className="text-2xl font-black text-white font-mono mt-1">{weatherData.current.windGust}</p>
              <span className="text-[10px] text-amber-400">Limit: 38 km/h</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Relative Humidity</span>
              <p className="text-2xl font-black text-white font-mono mt-1">{weatherData.current.humidity}</p>
              <span className="text-[10px] text-slate-400">Normal Curing</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Rain Probability</span>
              <p className="text-2xl font-black text-white font-mono mt-1">{weatherData.current.precipitationChance}</p>
              <span className="text-[10px] text-emerald-400">Low Risk</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">UV Solar Index</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">{weatherData.current.uvIndex}</p>
              <span className="text-[10px] text-slate-400">Mandatory Shade</span>
            </div>
          </div>

          {/* Construction Operational Advisories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weatherData.advisories.map((adv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white">{adv.title}</span>
                    <Badge variant={adv.color === 'emerald' ? 'emerald' : adv.color === 'blue' ? 'blue' : 'amber'}>
                      {adv.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Forecast Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-white mb-3">Today's Hourly Weather Progression</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weatherData.forecast.map((fc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                  <div className="font-mono text-slate-400">{fc.time}</div>
                  <div className="text-base font-bold text-white font-mono my-1">{fc.temp}</div>
                  <div className="text-[11px] text-slate-300">{fc.condition}</div>
                  <div className="text-[10px] text-sky-400 font-mono mt-1">Wind: {fc.wind}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Site Log Form & History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Daily Site Supervisor Log Entry</h3>
                </div>
                {logSubmitted && <span className="text-xs text-emerald-400 font-medium">Log Saved!</span>}
              </div>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Active Shift
                    </label>
                    <select
                      value={newLog.shift}
                      onChange={(e) => setNewLog({ ...newLog, shift: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                      <option value="Day Shift (08:00 - 17:00)">Day Shift (08:00 - 17:00)</option>
                      <option value="Night Pouring Shift (20:00 - 04:00)">Night Pouring Shift (20:00 - 04:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      On-site Headcount
                    </label>
                    <input
                      type="number"
                      value={newLog.workerCount}
                      onChange={(e) => setNewLog({ ...newLog, workerCount: e.target.value })}
                      className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    High-Risk Operations in Progress
                  </label>
                  <input
                    type="text"
                    value={newLog.highRiskWork}
                    onChange={(e) => setNewLog({ ...newLog, highRiskWork: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Supervisor Notes & Weather Safeguards
                  </label>
                  <textarea
                    rows={3}
                    value={newLog.supervisorNotes}
                    onChange={(e) => setNewLog({ ...newLog, supervisorNotes: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Record Daily Shift Log
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Logs (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-white mb-3">Recent Daily Shift Logs</h3>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.date}</span>
                      <span className="font-mono text-[10px] text-amber-400">{log.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{log.shift}</span>
                      <span>Workers: <strong className="text-white font-mono">{log.workerCount}</strong></span>
                    </div>
                    <div className="text-slate-300 text-[11px]">Weather: {log.weather}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
