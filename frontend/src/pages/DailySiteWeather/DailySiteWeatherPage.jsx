import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_WEATHER_DATA } from '../../data/sampleData';
import { api } from '../../services/api';

export default function DailySiteWeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [viewState, setViewState] = useState('normal');

  const [newLog, setNewLog] = useState({
    shift: 'Day Shift (08:00 - 17:00)',
    workerCount: 42,
    highRiskWork: 'Crane Lifts & Facade Installation',
    supervisorNotes: 'Concrete curing window optimal. Wind gusts under safety threshold.',
  });

  const [recentLogs, setRecentLogs] = useState([
    {
      id: 'LOG-304',
      date: 'Today - Oct 25, 2026',
      shift: 'Morning Shift',
      workerCount: 42,
      weather: '24°C, Partly Cloudy, 18 km/h Wind',
      status: 'Normal Operations',
    },
    {
      id: 'LOG-303',
      date: 'Yesterday - Oct 24, 2026',
      shift: 'Day Shift',
      workerCount: 48,
      weather: '26°C, Clear, 16 km/h Wind',
      status: 'Normal Operations',
    },
  ]);
  const [logSubmitted, setLogSubmitted] = useState(false);

  const loadWeather = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getWeather();
      setWeatherData(data);
    } catch (err) {
      console.warn('Weather fetch error:', err);
      setErrorMessage(err.message || 'Unable to fetch meteorological telemetry.');
      // Graceful fallback to calibrated data
      setWeatherData(SAMPLE_WEATHER_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const handleLogSubmit = (e) => {
    e.preventDefault();
    const currentTemp = weatherData?.current_temperature_celsius
      ? `${weatherData.current_temperature_celsius}°C`
      : weatherData?.current?.temp || '24°C';
    const condition = weatherData?.weather_condition || weatherData?.current?.condition || 'Partly Cloudy';

    const entry = {
      id: `LOG-${305 + recentLogs.length}`,
      date: 'Just Now',
      shift: newLog.shift,
      workerCount: Number(newLog.workerCount),
      weather: `${currentTemp}, ${condition}`,
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
        badgeText={weatherData?.is_live_telemetry ? "Live Telemetry" : "Site Weather"}
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={loadWeather}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Weather</span>
            </button>
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

      {(viewState === 'error' || errorMessage) && (
        <ErrorAlert
          title="Weather Feed Notice"
          message={errorMessage || "Using calibrated site weather parameters."}
          onRetry={loadWeather}
          onDismiss={() => {
            setErrorMessage(null);
            setViewState('normal');
          }}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Weather Telemetry Received"
          description="Local weather station is currently offline."
          actionLabel="Reload Weather Feed"
          onAction={loadWeather}
        />
      )}

      {viewState === 'normal' && weatherData && (
        <>
          {/* Weather KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Ambient Temp</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                {weatherData.current_temperature_celsius !== undefined
                  ? `${weatherData.current_temperature_celsius}°C`
                  : weatherData.current?.temp}
              </p>
              <span className="text-[10px] text-slate-400">
                {weatherData.weather_condition || weatherData.current?.condition}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Wind Velocity</span>
              <p className="text-2xl font-black text-sky-400 font-mono mt-1">
                {weatherData.wind_speed_kmh !== undefined
                  ? `${weatherData.wind_speed_kmh} km/h`
                  : weatherData.current?.windSpeed}
              </p>
              <span className="text-[10px] text-emerald-400">
                {weatherData.crane_operation_permitted ? "Crane Safe" : "Wind Alert"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Wind Gust Peak</span>
              <p className="text-2xl font-black text-white font-mono mt-1">
                {weatherData.wind_gusts_kmh !== undefined
                  ? `${weatherData.wind_gusts_kmh} km/h`
                  : weatherData.current?.windGust}
              </p>
              <span className="text-[10px] text-amber-400">Limit: 38 km/h</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Relative Humidity</span>
              <p className="text-2xl font-black text-white font-mono mt-1">
                {weatherData.relative_humidity_percentage !== undefined
                  ? `${weatherData.relative_humidity_percentage}%`
                  : weatherData.current?.humidity}
              </p>
              <span className="text-[10px] text-slate-400">Curing Metric</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">Rain Chance</span>
              <p className="text-2xl font-black text-white font-mono mt-1">
                {weatherData.precipitation_chance !== undefined
                  ? `${weatherData.precipitation_chance}%`
                  : weatherData.current?.precipitationChance}
              </p>
              <span className="text-[10px] text-emerald-400">Low Risk</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">UV Solar Index</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                {weatherData.uv_index !== undefined ? weatherData.uv_index : weatherData.current?.uvIndex}
              </p>
              <span className="text-[10px] text-slate-400">Hydration Care</span>
            </div>
          </div>

          {/* Construction Operational Advisories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(weatherData.advisories || []).map((adv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white">{adv.title}</span>
                    <Badge variant={adv.severity_badge || adv.color || 'blue'}>
                      {adv.status_level || adv.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{adv.guidance || adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Progression */}
          {weatherData.hourly_progression?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-white mb-3">Today's Hourly Weather Progression</h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {weatherData.hourly_progression.map((fc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
                    <div className="font-mono text-slate-400">{fc.time}</div>
                    <div className="text-base font-bold text-white font-mono my-1">{fc.temperature_celsius}°C</div>
                    <div className="text-[11px] text-slate-300">{fc.condition}</div>
                    <div className="text-[10px] text-sky-400 font-mono mt-1">Wind: {fc.wind_speed_kmh} km/h</div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
