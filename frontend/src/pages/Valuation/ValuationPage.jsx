import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  MapPin,
  Sparkles,
  Calculator,
  Layers,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { api } from '../../services/api';

export default function ValuationPage() {
  const [formData, setFormData] = useState({
    propertyType: 'commercial',
    builtUpArea: 18500,
    landArea: 25000,
    locationTier: 'prime',
    structuralGrade: 'grade_a',
    constructionAge: 'new',
    transitProximity: 0.8,
    isLeedCertified: true,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [viewState, setViewState] = useState('normal');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setErrorMessage(null);

    const payload = {
      property_type: formData.propertyType,
      built_up_area_sqft: Number(formData.builtUpArea),
      land_area_sqft: formData.landArea ? Number(formData.landArea) : null,
      location_tier: formData.locationTier,
      structural_grade: formData.structuralGrade,
      construction_age_stage: formData.constructionAge,
      transit_proximity_miles: Number(formData.transitProximity),
      is_leed_certified: Boolean(formData.isLeedCertified),
    };

    try {
      // Live backend invocation
      const res = await api.estimateValuation(payload);
      setValuationResult(res);
    } catch (err) {
      console.error('Valuation error:', err);
      setErrorMessage(err.message || 'Failed to calculate property valuation.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Real Estate & Asset Valuation"
        subtitle="Estimate commercial and residential construction asset market value using multi-factor predictive modeling"
        badgeText="Valuation Engine"
        badgeVariant="emerald"
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
          message="Running Real Estate Valuation Multi-factor Models..."
          subtext="Aggregating municipal zoning rates, recent transaction comparables, and structural grade multipliers"
        />
      )}

      {(viewState === 'error' || errorMessage) && (
        <ErrorAlert
          title="Market Valuation Alert"
          message={errorMessage || "Could not complete valuation calculation. Check backend service status."}
          onRetry={handleCalculate}
          onDismiss={() => {
            setErrorMessage(null);
            setViewState('normal');
          }}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Valuation Parameters Defined"
          description="Enter property square footage and specifications on the left to compute the asset valuation."
          actionLabel="Load Default Parameters"
          onAction={() => {
            setViewState('normal');
            setFormData({
              propertyType: 'commercial',
              builtUpArea: 18500,
              landArea: 25000,
              locationTier: 'prime',
              structuralGrade: 'grade_a',
              constructionAge: 'new',
              transitProximity: 0.8,
              isLeedCertified: true,
            });
          }}
        />
      )}

      {viewState === 'normal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Column (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Property Specification Form</h3>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Property Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Property Asset Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="commercial">Commercial Office Tower</option>
                    <option value="residential">High-Rise Residential</option>
                    <option value="industrial">Industrial Logistics Warehouse</option>
                    <option value="mixed">Mixed-Use Retail & Residential</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location Corridor Tier
                  </label>
                  <select
                    name="locationTier"
                    value={formData.locationTier}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="prime">Tier 1 — Prime Downtown Core</option>
                    <option value="suburban">Tier 2 — Commercial Suburban Corridor</option>
                    <option value="outer">Tier 3 — Developing Outer Ring</option>
                  </select>
                </div>
              </div>

              {/* Area Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Built-up Area (Sq. Ft)
                  </label>
                  <input
                    type="number"
                    name="builtUpArea"
                    value={formData.builtUpArea}
                    onChange={handleChange}
                    placeholder="e.g. 18500"
                    required
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Land Parcel Area (Sq. Ft)
                  </label>
                  <input
                    type="number"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Structural Quality and Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Structural Material Grade
                  </label>
                  <select
                    name="structuralGrade"
                    value={formData.structuralGrade}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="grade_a">Grade A — Reinforced Seismic Core</option>
                    <option value="grade_b">Grade B — Standard Steel Frame</option>
                    <option value="grade_c">Grade C — Conventional Masonry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Construction Age / Stage
                  </label>
                  <select
                    name="constructionAge"
                    value={formData.constructionAge}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="new">Under Active Construction (New)</option>
                    <option value="1_to_3">1 - 3 Years Completed</option>
                    <option value="5_plus">5+ Years (Existing Asset)</option>
                  </select>
                </div>
              </div>

              {/* Proximity and Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Transit / Highway Proximity (Miles)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="transitProximity"
                    value={formData.transitProximity}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-400 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isLeedCertified"
                    name="isLeedCertified"
                    checked={formData.isLeedCertified}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <label htmlFor="isLeedCertified" className="text-xs text-slate-300 font-medium">
                    LEED / Green Building Certified (+5% Premium)
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10"
                >
                  {isCalculating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Computing Valuation...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      Calculate Valuation Estimate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Valuation Summary & Appraisal</h3>
                </div>
                {valuationResult && (
                  <Badge variant="emerald">Confidence: {valuationResult.confidence_score_percentage}%</Badge>
                )}
              </div>

              {valuationResult ? (
                <div className="space-y-4">
                  {/* Big Number Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-emerald-950/30 border border-slate-800">
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                      Estimated Market Valuation
                    </span>
                    <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                      {valuationResult.formatted_value}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                      <span>Rate: <strong className="text-white font-mono">{valuationResult.formatted_per_sqft}</strong> / sq.ft</span>
                      <span>Range: <strong className="text-slate-300 font-mono">${valuationResult.valuation_range_low?.toLocaleString()} - ${valuationResult.valuation_range_high?.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  {valuationResult.formula_breakdown && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Base Regional Rate</span>
                        <span className="font-mono text-white">${valuationResult.formula_breakdown.base_rate_per_sqft} / sq.ft</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Structural Quality Multiplier</span>
                        <span className="font-mono text-emerald-400">x{valuationResult.formula_breakdown.structural_grade_multiplier}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">LEED Green Certified Multiplier</span>
                        <span className="font-mono text-emerald-400">x{valuationResult.formula_breakdown.leed_green_premium_multiplier}</span>
                      </div>
                    </div>
                  )}

                  {/* Recent Comps Table */}
                  {valuationResult.comparables?.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">
                        Comparable Recent Transactions (Comps)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-mono">
                            <tr>
                              <th className="p-2 rounded-l">Property</th>
                              <th className="p-2">Sq. Ft</th>
                              <th className="p-2">Sale Price</th>
                              <th className="p-2 rounded-r">Per Sq. Ft</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {valuationResult.comparables.map((comp, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/40">
                                <td className="p-2 font-medium text-white">{comp.address}</td>
                                <td className="p-2 font-mono">{comp.sqft.toLocaleString()}</td>
                                <td className="p-2 font-mono text-emerald-400">{comp.sale_price}</td>
                                <td className="p-2 font-mono text-slate-400">{comp.price_per_sqft}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/80 leading-relaxed">
                    <p className="font-semibold text-slate-300">Valuation Disclaimer:</p>
                    <p>{valuationResult.disclaimer}</p>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p>Configure property dimensions and click "Calculate Valuation Estimate"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
