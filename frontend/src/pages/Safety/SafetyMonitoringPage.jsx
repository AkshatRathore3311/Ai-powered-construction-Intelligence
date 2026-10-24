import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HardHat,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import ImageUploader from '../../components/common/ImageUploader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_SAFETY_ANALYSIS_PRESET } from '../../data/sampleData';

export default function SafetyMonitoringPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [viewState, setViewState] = useState('normal'); // 'normal', 'loading', 'empty', 'error'
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleImageSelected = (imageDataUrl) => {
    setSelectedImage(imageDataUrl);
    setAnalysisResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    // Simulate multimodal CV inference latency
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(SAMPLE_SAFETY_ANALYSIS_PRESET);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Construction Site Safety Monitoring"
        subtitle="Automated PPE verification, hazard boundary inspection, and OSHA compliance scanning"
        badgeText="Computer Vision"
        badgeVariant="amber"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">UI Test Modes:</span>
            <select
              value={viewState}
              onChange={(e) => setViewState(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-amber-400"
            >
              <option value="normal">Normal Mode</option>
              <option value="loading">Force Loading State</option>
              <option value="empty">Force Empty State</option>
              <option value="error">Force Error State</option>
            </select>
          </div>
        }
      />

      {/* State overrides for testing */}
      {viewState === 'loading' && (
        <LoadingState
          message="Running Computer Vision PPE Model..."
          subtext="Scanning pixels for hard hats, reflective vests, and unsafe worker perimeters"
        />
      )}

      {viewState === 'error' && (
        <ErrorAlert
          title="Inference Connection Failed"
          message="FastAPI AI endpoint unreachable. (Note: Backend is scheduled for implementation in Phase 2 & 4)."
          onRetry={() => setViewState('normal')}
          onDismiss={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Safety Scans Recorded"
          description="Upload an image from your site cameras or drone footage to begin automated safety monitoring."
          actionLabel="Load Sample Inspection Image"
          onAction={() => {
            setViewState('normal');
            setSelectedImage(SAMPLE_SAFETY_ANALYSIS_PRESET.imageUrl);
            setAnalysisResult(SAMPLE_SAFETY_ANALYSIS_PRESET);
          }}
        />
      )}

      {viewState === 'normal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Upload & Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Site Camera Feed / Inspection Upload
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Input: RGB Stream / Image</span>
              </div>

              <ImageUploader
                title="Drop Site Image for Safety Inspection"
                description="Supports JPG, PNG drone snapshots, CCTV frames, or mobile uploads"
                selectedImage={selectedImage}
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
                sampleImageUrl={SAMPLE_SAFETY_ANALYSIS_PRESET.imageUrl}
                sampleLabel="Load Sample Site Photo"
                isLoading={isAnalyzing}
                aspectRatio="aspect-video"
              />

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  {selectedImage ? (
                    <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Image loaded and preprocessed
                    </span>
                  ) : (
                    <span>Select an image or load the sample above to start</span>
                  )}
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={!selectedImage || isAnalyzing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    !selectedImage || isAnalyzing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-500/10'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run Safety Audit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detection Bounding Box Guide Card */}
            {analysisResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Identified Bounding Entities ({analysisResult.detections.length})
                  </h4>
                  <div className="flex gap-1.5">
                    {['all', 'violation', 'hazard', 'safe'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`text-[10px] px-2 py-0.5 rounded capitalize font-mono ${
                          selectedFilter === filter
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {analysisResult.detections
                    .filter((d) => selectedFilter === 'all' || d.status === selectedFilter)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          item.status === 'violation'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            : item.status === 'hazard'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.status === 'violation' ? (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : item.status === 'hazard' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="font-medium text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[11px] text-slate-400">
                            Confidence: {(item.confidence * 100).toFixed(0)}%
                          </span>
                          <Badge
                            variant={
                              item.status === 'violation'
                                ? 'rose'
                                : item.status === 'hazard'
                                ? 'amber'
                                : 'emerald'
                            }
                            size="xs"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Scorecard & Audit Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Safety Score Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-white mb-1">Site Safety Scorecard</h3>
              <p className="text-xs text-slate-400 mb-4">
                Automated multi-factor compliance rating based on current visual assessment
              </p>

              {analysisResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        Calculated Safety Rating
                      </div>
                      <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                        78%
                      </div>
                      <div className="text-xs text-amber-300/80 font-medium mt-0.5">
                        Attention Needed — PPE Gaps
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-slate-400">Workers Scanned</div>
                      <div className="text-lg font-bold text-white font-mono mt-1">
                        {analysisResult.summary.totalPeople}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-slate-400">PPE Compliant</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                        {analysisResult.summary.ppeCompliantWorkers}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-slate-400">PPE Violations</div>
                      <div className="text-lg font-bold text-rose-400 font-mono mt-1">
                        {analysisResult.summary.ppeNonCompliantWorkers}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-slate-400">Perimeter Hazards</div>
                      <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                        {analysisResult.summary.perimeterHazards}
                      </div>
                    </div>
                  </div>

                  {/* Immediate Action Checklist */}
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
                      Supervisor Action Checklist
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>Issue High-Vis Vest to Worker in Zone 2 immediately.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>Erect high-visibility cones along heavy machinery swing radius.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>Scaffolding tier harness anchor verified compliant with OSHA standard 1926.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <HardHat className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p>Awaiting image upload to compute safety scorecard</p>
                </div>
              )}
            </div>

            {/* OSHA Guidelines Reference Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Info className="w-4 h-4" />
                <span>OSHA 1926 Safety Standard Protocol</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Mandatory PPE includes ANSI-approved hard hats, reflective class 2/3 vests, and steel-toe boots in all active rigging and excavation zones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
