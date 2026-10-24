import React, { useState } from 'react';
import {
  Scan,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Ruler,
  Wrench,
  ShieldAlert,
  HelpCircle,
  FileText,
  Activity,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import ImageUploader from '../../components/common/ImageUploader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_CRACK_ANALYSIS_PRESET } from '../../data/sampleData';

export default function CrackDetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [viewState, setViewState] = useState('normal'); // 'normal', 'loading', 'empty', 'error'
  const [elementCategory, setElementCategory] = useState('column');

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
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(SAMPLE_CRACK_ANALYSIS_PRESET);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Structural Crack Detection & Analysis"
        subtitle="Multimodal computer vision defect assessment for concrete columns, beams, retention walls, and foundations"
        badgeText="Structural AI"
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
          message="Executing Structural Feature Segmentation..."
          subtext="Measuring crack depth, orientation vectors, and surface fracture topology"
        />
      )}

      {viewState === 'error' && (
        <ErrorAlert
          title="Defect Segmentation Failed"
          message="Could not isolate fracture contours due to low contrast or lighting. (Simulated test error)."
          onRetry={() => setViewState('normal')}
          onDismiss={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Structural Scans Logged"
          description="Take a close-up photo of the concrete defect or structural element to begin classification."
          actionLabel="Load Sample Concrete Crack"
          onAction={() => {
            setViewState('normal');
            setSelectedImage(SAMPLE_CRACK_ANALYSIS_PRESET.imageUrl);
            setAnalysisResult(SAMPLE_CRACK_ANALYSIS_PRESET);
          }}
        />
      )}

      {viewState === 'normal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upload and Defect Visualizer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">Structural Asset Photo</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Target Element:</span>
                  <select
                    value={elementCategory}
                    onChange={(e) => setElementCategory(e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1"
                  >
                    <option value="column">Reinforced Column</option>
                    <option value="beam">Load-Bearing Beam</option>
                    <option value="slab">Floor / Roof Slab</option>
                    <option value="wall">Retention Wall</option>
                    <option value="foundation">Footing / Foundation</option>
                  </select>
                </div>
              </div>

              <ImageUploader
                title="Upload Photo of Concrete Defect"
                description="Include a clear perpendicular photo of the cracked concrete section with good illumination"
                selectedImage={selectedImage}
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
                sampleImageUrl={SAMPLE_CRACK_ANALYSIS_PRESET.imageUrl}
                sampleLabel="Load Sample Concrete Crack"
                isLoading={isAnalyzing}
                aspectRatio="aspect-video"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  {selectedImage ? (
                    <span className="text-sky-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for crack vector analysis
                    </span>
                  ) : (
                    <span>Upload or load sample concrete defect photo</span>
                  )}
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={!selectedImage || isAnalyzing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    !selectedImage || isAnalyzing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-md shadow-sky-500/10'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Diagnosing Defect...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Structural Crack
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual Measurement Overlay Card */}
            {analysisResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-sky-400" />
                  Estimated Dimensional Profiles
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Fracture Type</span>
                    <p className="text-sm font-bold text-white mt-1">{analysisResult.type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Estimated Max Width</span>
                    <p className="text-sm font-bold text-amber-400 font-mono mt-1">
                      {analysisResult.estimatedWidth}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Surface Trace Length</span>
                    <p className="text-sm font-bold text-white font-mono mt-1">
                      {analysisResult.estimatedLength}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 font-mono">
                  * Note: AI dimensional estimates are calibrated based on reference surface textures. Formal ultrasonic gauge validation recommended.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Engineering Diagnosis & Remediation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-white mb-1">Diagnostic Report</h3>
              <p className="text-xs text-slate-400 mb-4">
                Structural integrity evaluation and intervention urgency
              </p>

              {analysisResult ? (
                <div className="space-y-4">
                  {/* Severity Badge Alert */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Severity Level:</span>
                        <Badge variant="rose" size="xs">
                          {analysisResult.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-rose-200/90 mt-1">
                        Exceeds 0.3mm ACI 224R tolerable crack limit for exterior exposure.
                      </p>
                    </div>
                  </div>

                  {/* Structural Impact */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-slate-400 font-semibold mb-1">Structural Impact Assessment:</div>
                    <p className="text-slate-200 leading-relaxed">
                      {analysisResult.structuralImpact}
                    </p>
                  </div>

                  {/* Urgency and Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400">Intervention Urgency:</span>
                      <p className="text-xs font-bold text-amber-400 mt-1 font-mono">
                        {analysisResult.repairUrgency}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400">AI Confidence:</span>
                      <p className="text-xs font-bold text-emerald-400 mt-1 font-mono">
                        {analysisResult.confidence}
                      </p>
                    </div>
                  </div>

                  {/* Remediation Method */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                      <Wrench className="w-4 h-4" />
                      <span>Recommended Repair Protocol:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {analysisResult.recommendedMethod}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Activity className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p>Upload a structural photo to generate fracture diagnostics</p>
                </div>
              )}
            </div>

            {/* Structural Code Reference Card */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <FileText className="w-4 h-4" />
                <span>ACI 224R-01 Building Code Standard</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Tolerable crack widths in reinforced concrete: 0.41mm (dry interior), 0.30mm (exterior humidity/rain), 0.18mm (deicing chemicals).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
