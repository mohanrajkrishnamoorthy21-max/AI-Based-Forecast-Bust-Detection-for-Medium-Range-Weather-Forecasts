import React from 'react';
import { Activity, ShieldCheck, Database, Calendar, Clock, RefreshCw } from 'lucide-react';
import type { DashboardSummary } from '../../types/api';

interface HeaderProps {
  summary: DashboardSummary | null;
  selectedDay: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ summary, selectedDay, onRefresh, isLoading }) => {
  return (
    <header className="bg-[#151E32] border-b border-[#1E293B] px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-50 shadow-lg">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-100 tracking-tight">SIH 26079</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 font-medium">
              NWP Bust Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Medium-Range Forecast Reliability & Uncertainty Estimation Console
          </p>
        </div>
      </div>

      {/* Center/Right Status Badges */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Model Readiness Badge */}
        <div className="flex items-center gap-1.5 bg-[#0B1120] border border-emerald-900/60 px-2.5 py-1 rounded-md text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>MODEL READY</span>
        </div>

        {/* Data Status Disclosure Badge */}
        <div className="flex items-center gap-1.5 bg-[#0B1120] border border-amber-900/60 px-2.5 py-1 rounded-md text-amber-400 font-medium">
          <Database className="w-3.5 h-3.5" />
          <span>DEMO / SYNTHETIC DATA</span>
        </div>

        {/* Selected Lead Day */}
        <div className="flex items-center gap-1.5 bg-[#0B1120] border border-[#1E293B] px-2.5 py-1 rounded-md text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lead Day: <strong className="text-white font-semibold">{selectedDay}</strong></span>
        </div>

        {/* Timestamp */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0B1120] border border-[#1E293B] px-2.5 py-1 rounded-md text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{summary?.timestamp || '2026-09-22 20:30 UTC'}</span>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-md bg-[#0B1120] border border-[#1E293B] text-slate-400 hover:text-cyan-400 hover:border-cyan-800 transition-colors disabled:opacity-50"
            title="Refresh Diagnostics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
};
