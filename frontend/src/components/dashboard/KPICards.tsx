import React from 'react';
import { AlertTriangle, ShieldAlert, Calendar, Cpu } from 'lucide-react';
import type { DashboardSummary } from '../../types/api';

interface KPICardsProps {
  summary: DashboardSummary | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  const maxBustPct = summary ? Math.round(summary.max_bust_probability * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* KPI 1: Max Bust Probability */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Bust Risk</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold ${maxBustPct >= 61 ? 'text-rose-400' : maxBustPct >= 31 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {maxBustPct}%
          </span>
          <span className="text-xs text-slate-400">Peak grid probability</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Region: <span className="text-slate-300 font-medium">{summary?.highest_risk_region || 'N/A'}</span>
        </div>
      </div>

      {/* KPI 2: Low-Confidence Area % */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Confidence Area</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-400">
            {summary?.low_confidence_area_pct ?? 0}%
          </span>
          <span className="text-xs text-slate-400">Grid zones &lt; 50 conf</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Evaluated across {summary?.total_regions ?? 10} regional zones
        </div>
      </div>

      {/* KPI 3: Highest-Risk Lead Day */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peak Risk Lead Day</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-cyan-400">
            Day {summary?.highest_risk_lead_day ?? 6}
          </span>
          <span className="text-xs text-slate-400">Maximum grid divergence</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Monitored range: Day 1 – Day 10
        </div>
      </div>

      {/* KPI 4: Model & System Status */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ML Model Status</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-400">
            {summary?.model_status || 'READY'}
          </span>
          <span className="text-xs text-emerald-500/90 font-medium">Random Forest</span>
        </div>
        <div className="mt-2 text-[11px] text-amber-400 font-medium truncate">
          ● {summary?.data_mode || 'DEMO / SYNTHETIC DATA'}
        </div>
      </div>
    </div>
  );
};
