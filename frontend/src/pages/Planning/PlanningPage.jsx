import React, { useState } from 'react';
import {
  CalendarRange,
  Layers,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_PROJECT_PLAN } from '../../data/sampleData';

export default function PlanningPage() {
  const [formData, setFormData] = useState({
    projectName: 'Metro Heights Tower B - Superstructure',
    siteArea: '45,000 sq.ft',
    budgetCeiling: '$3,800,000',
    targetDurationMonths: 6,
    constructionMethod: 'Cast-in-place Concrete Core with Steel Frame',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState(SAMPLE_PROJECT_PLAN);
  const [viewState, setViewState] = useState('normal');

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanResult(SAMPLE_PROJECT_PLAN);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Construction Project Planning & Scheduling"
        subtitle="Automated phase milestone sequencing, critical path risk forecasting, and material quantity takeoffs"
        badgeText="Planning Engine"
        badgeVariant="purple"
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
          message="Computing Critical Path Milestone Schedule..."
          subtext="Balancing trade dependencies, weather curing buffers, and concrete pour staging"
        />
      )}

      {viewState === 'error' && (
        <ErrorAlert
          title="Schedule Optimization Solver Error"
          message="Contradictory milestone dependencies detected in input constraints. (Simulated test error)."
          onRetry={() => setViewState('normal')}
          onDismiss={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Project Plan Created"
          description="Fill out the project scope form below to generate a milestone schedule and bill of materials."
          actionLabel="Load Sample Project Plan"
          onAction={() => {
            setViewState('normal');
            setPlanResult(SAMPLE_PROJECT_PLAN);
          }}
        />
      )}

      {viewState === 'normal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Project Parameter Form (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <CalendarRange className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Project Scope Specs</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Site Built-up Footprint
                </label>
                <input
                  type="text"
                  value={formData.siteArea}
                  onChange={(e) => setFormData({ ...formData, siteArea: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Duration (Months)
                </label>
                <input
                  type="number"
                  value={formData.targetDurationMonths}
                  onChange={(e) => setFormData({ ...formData, targetDurationMonths: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Budget Target
                </label>
                <input
                  type="text"
                  value={formData.budgetCeiling}
                  onChange={(e) => setFormData({ ...formData, budgetCeiling: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Construction Methodology
                </label>
                <select
                  value={formData.constructionMethod}
                  onChange={(e) => setFormData({ ...formData, constructionMethod: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                >
                  <option value="Cast-in-place Concrete Core with Steel Frame">
                    Cast-in-place Concrete Core + Steel Frame
                  </option>
                  <option value="Precast Concrete Modular Assembly">
                    Precast Concrete Modular Assembly
                  </option>
                  <option value="Structural Timber Mass Frame">
                    Structural Mass Timber Frame
                  </option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/10"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Sequencing Milestones...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Project Schedule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated Plan & Milestones (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {planResult ? (
              <>
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Planned Duration</span>
                    <p className="text-lg font-bold text-white mt-1 font-mono">
                      {planResult.estimatedDuration}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Target Handover</span>
                    <p className="text-lg font-bold text-purple-400 mt-1 font-mono">
                      {planResult.targetCompletion}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-mono">Estimated Cost Band</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                      {planResult.budgetBand}
                    </p>
                  </div>
                </div>

                {/* Milestones Timeline */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white">Milestone Sequencing & Risk Matrix</h3>
                      <p className="text-xs text-slate-400">Critical path dependencies and contingency buffers</p>
                    </div>
                    <Badge variant="purple">Sequential Flow</Badge>
                  </div>

                  <div className="space-y-3">
                    {planResult.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{ms.phase}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Dependency: <span className="text-slate-300 font-medium">{ms.dependency}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                            {ms.duration}
                          </span>
                          <Badge
                            variant={
                              ms.risk === 'High' ? 'rose' : ms.risk === 'Medium' ? 'amber' : 'emerald'
                            }
                            size="xs"
                          >
                            {ms.risk} Risk
                          </Badge>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              ms.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : ms.status === 'In Progress'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {ms.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Quantities Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white">Estimated Material Takeoffs</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">BOM Forecast</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono">
                        <tr>
                          <th className="p-2.5 rounded-l">Material Item</th>
                          <th className="p-2.5">Estimated Quantity</th>
                          <th className="p-2.5 rounded-r">Cost Allocation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {planResult.materialEstimates.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-2.5 font-medium text-white">{item.item}</td>
                            <td className="p-2.5 font-mono text-purple-300">{item.quantity}</td>
                            <td className="p-2.5 font-mono text-emerald-400">{item.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState title="No plan generated yet" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
