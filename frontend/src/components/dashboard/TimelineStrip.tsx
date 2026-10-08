import React from 'react';
import type { TimelinePoint } from '../../types/api';
import { Calendar } from 'lucide-react';

interface TimelineStripProps {
  timeline: TimelinePoint[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export const TimelineStrip: React.FC<TimelineStripProps> = ({
  timeline,
  selectedDay,
  onSelectDay,
}) => {
  return (
    <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Day 1 – Day 10 Forecast Reliability Scrubbing Strip
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Click any lead day to inspect risk evolution
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {Array.from({ length: 10 }, (_, i) => {
          const day = i + 1;
          const point = timeline.find((t) => t.lead_day === day) || {
            lead_day: day,
            avg_confidence: Math.max(15, 90 - day * 7),
            max_bust_probability: Math.min(0.9, 0.2 + day * 0.07),
            high_risk_region_count: Math.min(5, Math.floor(day * 0.5)),
          };

          const isSelected = selectedDay === day;
          const confScore = point.avg_confidence;
          const maxBustPct = Math.round(point.max_bust_probability * 100);

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-slate-100 shadow-md ring-2 ring-cyan-500/30'
                  : 'bg-[#0B1120] border-[#1E293B] text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-tight">Day {day}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="text-slate-400">Conf:</span>
                  <span className={`font-bold ${confScore >= 60 ? 'text-cyan-400' : confScore >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {confScore}%
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="text-slate-400">Bust:</span>
                  <span className={`font-bold ${maxBustPct >= 60 ? 'text-rose-400' : maxBustPct >= 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {maxBustPct}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
