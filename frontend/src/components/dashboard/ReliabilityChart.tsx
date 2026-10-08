import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { TimelinePoint } from '../../types/api';
import { TrendingUp, ShieldAlert } from 'lucide-react';

interface ReliabilityChartProps {
  timeline: TimelinePoint[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export const ReliabilityChart: React.FC<ReliabilityChartProps> = ({
  timeline,
  selectedDay,
  onSelectDay,
}) => {
  const [chartMode, setChartMode] = useState<'confidence' | 'bust'>('confidence');

  const formattedData = timeline.map((pt) => ({
    day: `D${pt.lead_day}`,
    lead_day: pt.lead_day,
    confidence: pt.avg_confidence,
    bust_prob: Math.round(pt.max_bust_probability * 100),
  }));

  return (
    <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Temporal Trend Analysis
          </span>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mt-0.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Day 1 – Day 10 Forecast Reliability & Error Decay Curve
          </h3>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-[#0B1120] border border-[#1E293B] p-1 rounded-lg text-xs">
          <button
            onClick={() => setChartMode('confidence')}
            className={`px-3 py-1 rounded-md transition-colors ${
              chartMode === 'confidence' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Confidence Score
          </button>
          <button
            onClick={() => setChartMode('bust')}
            className={`px-3 py-1 rounded-md transition-colors ${
              chartMode === 'bust' ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bust Probability %
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={formattedData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#151E32] border border-[#334155] p-2.5 rounded-lg text-xs shadow-lg font-sans">
                      <div className="font-bold text-cyan-400">Lead Day {data.lead_day}</div>
                      <div className="mt-1 text-slate-200">
                        Avg Confidence: <strong className="text-cyan-300">{data.confidence}%</strong>
                      </div>
                      <div className="text-slate-200">
                        Max Bust Risk: <strong className="text-rose-400">{data.bust_prob}%</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine x={`D${selectedDay}`} stroke="#06B6D4" strokeDasharray="4 4" label={{ value: `Selected: Day ${selectedDay}`, fill: '#06B6D4', fontSize: 11 }} />

            {chartMode === 'confidence' ? (
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: '#06B6D4', r: 4 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, onClick: (_: any, entry: any) => onSelectDay(entry?.payload?.lead_day || selectedDay) }}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="bust_prob"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, onClick: (_: any, entry: any) => onSelectDay(entry?.payload?.lead_day || selectedDay) }}
              />
            )}
          </ReLineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-[#1E293B] pt-2.5">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          Higher lead days exhibit exponential error compounding.
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          NWP Grid Resolution: ~25km
        </span>
      </div>
    </div>
  );
};
