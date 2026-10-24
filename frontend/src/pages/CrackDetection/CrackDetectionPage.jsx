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
import { api, dataUrlToFile } from '../../services/api';

export default function CrackDetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [viewState, setViewState] = useState('normal'); // 'normal', 'loading', 'empty', 'error'
  const [elementCategory, setElementCategory] = useState('column');

  const handleImageSelected = async (imageDataUrl, filename = 'crack_image.jpg') => {
    setSelectedImage(imageDataUrl);
    setAnalysisResult(null);
    setErrorMessage(null);
    try {
      const file = await dataUrlToFile(imageDataUrl, filename);
      setSelectedFileObj(file);
    } catch (e) {
      console.error('File conversion error:', e);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedFileObj(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      let fileToUpload = selectedFileObj;
      if (!fileToUpload) {
        fileToUpload = await dataUrlToFile(selectedImage, 'crack_defect.jpg');
      }

      // Live FastAPI backend invocation
      const response = await api.analyzeCracks(fileToUpload, elementCategory, 'Metro Heights Tower A');
      setAnalysisResult(response);
    } catch (err) {
      console.error('Crack detection failed:', err);
      setErrorMessage(err.message || 'Failed to communicate with crack segmentation endpoint.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Structural Crack Detection & Analysis"
        subtitle="Multimodal computer vision defect assessment for concrete columns, beams, retention walls, and foundations"
        badgeText="OpenCV + Structural AI"
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

      {(viewState === 'error' || errorMessage) && (
        <ErrorAlert
          title="Defect Segmentation Alert"
          message={errorMessage || "Could not isolate fracture contours or connect to backend."}
          onRetry={handleRunAnalysis}
          onDismiss={() => {
            setErrorMessage(null);
            setViewState('normal');
          }}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Structural Scans Logged"
          description="Take a close-up photo of the concrete defect or structural element to begin classification."
          actionLabel="Load Sample Concrete Crack"
          onAction={() => {
            setViewState('normal');
            handleImageSelected(SAMPLE_CRACK_ANALYSIS_PRESET.imageUrl, "crack_sample.jpg");
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

            {/* Diagnostic Details Card */}
            {analysisResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-sky-400" />
                    Inspection Assessment Details
                  </h4>
                  <Badge variant={analysisResult.crack_detected ? "rose" : "emerald"} size="xs">
                    {analysisResult.crack_detected ? "Fracture Isolated" : "No Defect"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Fracture Typology</span>
                    <p className="text-sm font-bold text-white mt-1">{analysisResult.crack_type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Metric Scale Status</span>
                    <p className="text-sm font-bold text-amber-400 font-mono mt-1">
                      {analysisResult.is_dimension_calibrated ? "Calibrated Target" : "Uncalibrated 2D"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Analysis Engine</span>
                    <p className="text-[11px] font-bold text-white mt-1 truncate">
                      {analysisResult.detection_method}
                    </p>
                  </div>
                </div>

                {analysisResult.limitations?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Engine Limitations:</span>
                    <ul className="text-[11px] text-slate-400 list-disc list-inside mt-1 space-y-0.5">
                      {analysisResult.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                          {analysisResult.severity_level}
                        </Badge>
                      </div>
                      <p className="text-xs text-rose-200/90 mt-1">
                        Assessed against ACI 224R tolerable crack parameters.
                      </p>
                    </div>
                  </div>

                  {/* Structural Impact */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-slate-400 font-semibold mb-1">Structural Impact Assessment:</div>
                    <p className="text-slate-200 leading-relaxed">
                      {analysisResult.structural_impact_analysis}
                    </p>
                  </div>

                  {/* Urgency and Confidence */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400">Intervention Urgency:</span>
                      <p className="text-xs font-bold text-amber-400 mt-1 font-mono">
                        {analysisResult.repair_urgency}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-slate-400">Analysis Confidence:</span>
                      <p className="text-xs font-bold text-emerald-400 mt-1 font-mono">
                        {(analysisResult.confidence * 100).toFixed(1)}%
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
                      {analysisResult.recommended_repair_method}
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/80 leading-relaxed">
                    <p className="font-semibold text-slate-300">Engineering Disclaimer:</p>
                    <p>{analysisResult.disclaimer}</p>
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
