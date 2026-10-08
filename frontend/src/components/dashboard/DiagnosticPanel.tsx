import React from 'react';
import type { RegionDiagnostic } from '../../types/api';
import { Thermometer, Droplets, Gauge, Wind, CloudRain, ShieldAlert } from 'lucide-react';

interface DiagnosticPanelProps {
  diagnostic: RegionDiagnostic | null;
  selectedDay: number;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  diagnostic,
  selectedDay,
}) => {
  if (!diagnostic) {
    return (
      <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-5 text-slate-400 text-xs text-center flex flex-col items-center justify-center h-full">
        Select a region on the map to inspect atmospheric metrics.
      </div>
    );
  }

  const conf = diagnostic.confidence_score;
  const bustPct = Math.round(diagnostic.bust_probability * 100);

  return (
    <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="border-b border-[#1E293B] pb-3 mb-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Region Diagnostics
          </span>
          <h3 className="text-base font-extrabold text-slate-100 mt-0.5">
            {diagnostic.region_name}
          </h3>
          <p className="text-xs text-slate-400">
            Selected Lead Day: <strong className="text-cyan-400">Day {selectedDay}</strong>
          </p>
        </div>

        {/* Confidence & Bust Risk Gauge Meters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Forecast Confidence</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${conf >= 60 ? 'text-cyan-400' : conf >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {conf}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${conf >= 60 ? 'bg-cyan-400' : conf >= 40 ? 'bg-amber-400' : 'bg-rose-500'}`}
                style={{ width: `${conf}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] p-3 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Bust Probability</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${bustPct >= 60 ? 'text-rose-400' : bustPct >= 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {bustPct}%
              </span>
              <span className="text-xs text-slate-500">risk</span>
            </div>
            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${bustPct >= 60 ? 'bg-rose-500' : bustPct >= 35 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${bustPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Atmospheric Variable Values */}
        <div className="space-y-2 text-xs">
          <div className="bg-[#0B1120] border border-[#1E293B] px-3 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>2m Surface Temp</span>
            </div>
            <strong className="text-slate-100 font-mono">{diagnostic.temp_2m} °C</strong>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] px-3 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Relative Humidity</span>
            </div>
            <strong className="text-slate-100 font-mono">{diagnostic.humidity} %</strong>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] px-3 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Mean Sea-Level Pressure</span>
            </div>
            <strong className="text-slate-100 font-mono">{diagnostic.pressure} hPa</strong>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] px-3 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>Total Precipitation</span>
            </div>
            <strong className="text-slate-100 font-mono">{diagnostic.precipitation} mm</strong>
          </div>

          <div className="bg-[#0B1120] border border-[#1E293B] px-3 py-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>10m Wind Speed</span>
            </div>
            <strong className="text-slate-100 font-mono">{diagnostic.wind_speed} m/s</strong>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-slate-500 border-t border-[#1E293B] pt-2.5 flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>NWP forecast grid parameters refreshed for lead cycle.</span>
      </div>
    </div>
  );
};
