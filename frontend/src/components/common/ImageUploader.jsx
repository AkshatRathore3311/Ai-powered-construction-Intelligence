import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function ImageUploader({
  title = "Upload Site Image",
  description = "Drag & drop your inspection photo, or browse from files",
  onImageSelected,
  selectedImage,
  onClear,
  sampleImageUrl,
  sampleLabel = "Load Sample Inspection Image",
  isLoading = false,
  aspectRatio = "aspect-video",
  acceptedFormats = "JPG, PNG, WEBP up to 25MB",
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (onImageSelected) {
        onImageSelected(reader.result, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = (e) => {
    e.stopPropagation();
    if (sampleImageUrl && onImageSelected) {
      onImageSelected(sampleImageUrl, "sample-site-inspection.jpg");
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${aspectRatio} ${
            isDragOver
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 mb-4 border border-slate-700 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">{description}</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Browse Files
            </button>
            {sampleImageUrl && (
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {sampleLabel}
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 font-mono">{acceptedFormats}</p>
        </div>
      ) : (
        <div className={`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 ${aspectRatio} group`}>
          <img
            src={selectedImage}
            alt="Inspection input"
            className="w-full h-full object-cover object-center"
          />

          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                Running Multimodal Analysis...
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Extracting features and bounding coordinates</p>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 bg-slate-900/90 hover:bg-rose-500 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">Inspection Asset Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
