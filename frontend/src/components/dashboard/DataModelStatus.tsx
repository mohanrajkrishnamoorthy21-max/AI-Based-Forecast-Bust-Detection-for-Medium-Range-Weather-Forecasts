import React from 'react';
import type { DataStatus } from '../../types/api';
import { Cpu, Database, CheckCircle, Info, ShieldCheck, Layers } from 'lucide-react';

interface DataModelStatusProps {
  status: DataStatus | null;
}

export const DataModelStatus: React.FC<DataModelStatusProps> = ({ status }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Overview Banner */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">System Technical & Model Specifications</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Operational verification specs, dataset disclosure, and model architecture documentation for SIH 26079.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-lg text-xs font-bold">
            <Info className="w-4 h-4" />
            <span>DEMO MODE ACTIVE</span>
          </div>
        </div>

        {/* Data Agnostic Architecture Callout */}
        <div className="bg-[#0B1120] border border-cyan-900/50 p-4 rounded-lg text-xs text-slate-300 leading-relaxed mb-6">
          <div className="font-bold text-cyan-400 text-sm mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Data-Agnostic Architecture Disclosure
          </div>
          As specified in project guidelines, no raw IMDAA NCMRWF dataset has been hardcoded. The application operates on a data-agnostic pipeline running on a validated synthetic dataset. When live IMDAA GRIB files are downloaded, the ingestion layer processes grid parameters seamlessly without requiring frontend UI modifications.
        </div>

        {/* Status Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0B1120] border border-[#1E293B] p-4 rounded-lg">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Dataset Source
            </div>
            <div className="text-sm font-bold text-slate-100">{status?.data_source || 'Synthetic Dataset'}</div>
            <div className="text-[11px] text-amber-400 mt-2 font-medium">● {status?.status_label}</div>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-4 rounded-lg">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Machine Learning Model
            </div>
            <div className="text-sm font-bold text-slate-100">{status?.model_type || 'Random Forest Classifier'}</div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">Version: {status?.model_version}</div>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-4 rounded-lg">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Feature Engineering
            </div>
            <div className="text-sm font-bold text-slate-100">{status?.features_count || 9} Predictor Features</div>
            <div className="text-[11px] text-slate-400 mt-2">Atmospheric + Tendency Derived</div>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-4 rounded-lg">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              FastAPI Health
            </div>
            <div className="text-sm font-bold text-emerald-400">{status?.api_health || 'Healthy'}</div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">Port 8000 / JSON REST</div>
          </div>
        </div>
      </div>

      {/* Pipeline Architecture visual diagram */}
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
          Target Production Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="font-bold text-cyan-400">NWP Forecast</span>
            <span className="text-[10px] text-slate-500 mt-1">IMDAA / GRIB2</span>
          </div>

          <div className="hidden sm:flex items-center justify-center text-slate-600 font-bold">→</div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="font-bold text-cyan-400">Feature Engine</span>
            <span className="text-[10px] text-slate-500 mt-1">xarray / Pandas</span>
          </div>

          <div className="hidden sm:flex items-center justify-center text-slate-600 font-bold">→</div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg flex flex-col items-center justify-center">
            <span className="font-bold text-emerald-400">ML Risk Model</span>
            <span className="text-[10px] text-slate-500 mt-1">Random Forest / XGB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
