import React from 'react';
import type { RegionDiagnostic } from '../../types/api';
import { HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExplainabilityPanelProps {
  diagnostic: RegionDiagnostic | null;
  selectedDay: number;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  diagnostic,
  selectedDay,
}) => {
  if (!diagnostic) {
    return (
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-5 text-slate-400 text-xs text-center flex flex-col items-center justify-center h-full">
        Select a region on the map to inspect feature explainability attribution.
      </div>
    );
  }

  const isLowConf = diagnostic.confidence_score < 40;
  const isHighBust = diagnostic.bust_probability >= 0.61;

  return (
    <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Explainability Engine
            </span>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">
              Why is forecast confidence {isLowConf ? 'Low' : 'Moderate'} for {diagnostic.region_name}?
            </h3>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              isHighBust
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : diagnostic.bust_probability >= 0.31
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isHighBust ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>Risk Level: {diagnostic.risk_level}</span>
          </div>
        </div>

        {/* Explainability Summary Note */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          The Random Forest classifier evaluated <strong className="text-slate-200">Day {selectedDay}</strong> NWP grid dynamics and identified key atmospheric drivers contributing to potential model divergence:
        </p>

        {/* Feature Contribution Bars */}
        <div className="space-y-3">
          {diagnostic.top_factors.map((factor, index) => {
            const barWidth = Math.min(100, Math.max(10, factor.contribution * 2.2));
            return (
              <div key={factor.feature_name} className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold text-[11px]">0{index + 1}</span>
                    <span className="font-semibold text-slate-200">{factor.display_name}</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">{factor.contribution}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule-Based Meteorological Insight */}
      <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-start gap-2 text-[11px] text-slate-400">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Explanations are derived deterministically from Random Forest feature importance weights and meteorological threshold rules without requiring third-party LLM API keys.
        </span>
      </div>
    </div>
  );
};
