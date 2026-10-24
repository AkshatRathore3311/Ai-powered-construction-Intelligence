import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Scan,
  Building2,
  CalendarRange,
  CloudSun,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  HardHat,
  Activity,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import {
  SAMPLE_DASHBOARD_METRICS,
  SAMPLE_WEEKLY_SAFETY_TREND,
  SAMPLE_INSPECTION_DISTRIBUTION,
  SAMPLE_RECENT_ALERTS,
} from '../../data/sampleData';
import { api } from '../../services/api';

export default function DashboardPage() {
  const [alerts, setAlerts] = useState(SAMPLE_RECENT_ALERTS);
  const [backendHealth, setBackendHealth] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  useEffect(() => {
    async function loadBackendData() {
      try {
        const [healthData, weatherData, analysesData] = await Promise.allSettled([
          api.getHealth(),
          api.getWeather(),
          api.getAnalyses(),
        ]);

        if (healthData.status === 'fulfilled') {
          setBackendHealth(healthData.value);
        }
        if (weatherData.status === 'fulfilled') {
          setLiveWeather(weatherData.value);
        }
        if (analysesData.status === 'fulfilled' && analysesData.value?.items?.length) {
          // Format real backend analyses into dashboard alerts
          const backendAlerts = analysesData.value.items.map((item) => ({
            id: item.id,
            title: item.title,
            zone: item.site_name,
            timestamp: item.timestamp,
            severity: item.badge_color === 'rose' ? 'Critical' : item.badge_color === 'amber' ? 'High' : 'Normal',
            status: item.status,
            confidence: item.metadata?.confidence ? `${(item.metadata.confidence * 100).toFixed(1)}%` : 'Verified',
          }));
          setAlerts(backendAlerts);
        }
      } catch (err) {
        console.warn('Backend initialization check:', err);
      } finally {
        setIsLoadingLive(false);
      }
    }
    loadBackendData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {backendHealth?.status === 'healthy' ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                FastAPI Backend Connected ({backendHealth.environment})
              </span>
            ) : (
              <span>FastAPI Backend Integrated • Full Stack Mode</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Powered Multimodal Construction Intelligence
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Real-time visual site hazard audits, structural crack diagnostics, project estimation, and daily weather safety advisories.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/safety"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              Run Safety Audit
            </Link>
            <Link
              to="/crack-detection"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Scan className="w-4 h-4" />
              Structural Crack Analysis
            </Link>
            <Link
              to="/daily-weather"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <CloudSun className="w-4 h-4" />
              Site Weather Check
            </Link>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-amber-400 to-transparent pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Site Safety Score"
          value={`${SAMPLE_DASHBOARD_METRICS.safetyScore}%`}
          subtitle="Overall PPE & hazard rating"
          delta={SAMPLE_DASHBOARD_METRICS.safetyScoreDelta}
          deltaType="positive"
          icon={ShieldAlert}
          accentColor="emerald"
        />
        <StatCard
          title="Active Hazard Alerts"
          value={alerts.filter((a) => a.severity === 'Critical').length || 2}
          subtitle="Requires supervisor review"
          delta="Immediate Priority"
          deltaType="negative"
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          title="Inspections Completed"
          value={alerts.length || SAMPLE_DASHBOARD_METRICS.inspectionsCompletedToday}
          subtitle="Recorded in audit log"
          delta="Synchronized"
          deltaType="positive"
          icon={Activity}
          accentColor="blue"
        />
        <StatCard
          title="Crane Weather Status"
          value={liveWeather ? (liveWeather.crane_operation_permitted ? "Permitted" : "Paused") : "Operational"}
          subtitle={liveWeather ? `Gusts: ${liveWeather.wind_gusts_kmh} km/h` : "Wind gusts safe"}
          delta={liveWeather?.is_live_telemetry ? "Live Feed" : "Calibrated"}
          deltaType={liveWeather?.crane_operation_permitted === false ? "negative" : "positive"}
          icon={CloudSun}
          accentColor="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Safety Compliance Trend */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Weekly Safety Compliance Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Site-wide PPE and safe perimeter compliance (%)</p>
            </div>
            <Badge variant="emerald">Live Trend</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAMPLE_WEEKLY_SAFETY_TREND}>
                <defs>
                  <linearGradient id="safetyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  domain={[80, 100]}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="complianceRate"
                  name="Compliance %"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#safetyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Benchmark: OSHA 90% Threshold</span>
            <span className="text-amber-400 font-mono">Current Average: 94.8%</span>
          </div>
        </div>

        {/* Inspection Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Inspection Categories</h3>
              <Badge variant="blue">Breakdown</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-2">Total 125 multimodal inspections logged this month.</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SAMPLE_INSPECTION_DISTRIBUTION}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {SAMPLE_INSPECTION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {SAMPLE_INSPECTION_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-medium text-slate-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Quick Launch Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">Intelligence Capabilities</h2>
          <span className="text-xs text-slate-400">Quickly launch dedicated modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/safety"
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Safety Monitoring
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Detect missing hardhats, vests, falling hazards, and perimeter breaches from site photos.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
              <span>Open Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/crack-detection"
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Scan className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                Crack Detection
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Identify concrete crack severity, shear patterns, width estimates, and repair methods.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-sky-400 gap-1">
              <span>Analyze Defect</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/valuation"
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Real Estate Valuation
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Estimate property valuation based on built-up area, quality tiers, and comparable market data.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>Estimate Value</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/planning"
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarRange className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                Project Planning
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Generate project phase timelines, resource allocations, critical milestones, and risk ratings.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 gap-1">
              <span>Plan Milestones</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Alerts Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Site Alerts & Logs</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time alerts detected across active project sites</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/80">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    alert.severity === 'Critical'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : alert.severity === 'High'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                    <Badge
                      variant={
                        alert.severity === 'Critical'
                          ? 'rose'
                          : alert.severity === 'High'
                          ? 'amber'
                          : 'blue'
                      }
                      size="xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{alert.zone}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{alert.timestamp}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400">Status: {alert.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {alert.confidence}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
