import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GridPoint } from '../../types/api';
import { Layers, Info } from 'lucide-react';

export type MapLayerMode = 'bust_prob' | 'confidence' | 'precipitation' | 'pressure' | 'wind';

interface RiskMapProps {
  regions: GridPoint[];
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  selectedDay: number;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  selectedDay,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayerMode>('bust_prob');

  const getMarkerColor = (point: GridPoint) => {
    if (activeLayer === 'confidence') {
      if (point.confidence_score >= 65) return '#06B6D4'; // High confidence cyan
      if (point.confidence_score >= 40) return '#3B82F6'; // Mid confidence blue
      return '#F43F5E'; // Low confidence rose
    } else if (activeLayer === 'precipitation') {
      if (point.precipitation > 80) return '#3B82F6';
      if (point.precipitation > 30) return '#06B6D4';
      return '#64748B';
    } else {
      // Default Bust Probability
      if (point.bust_probability >= 0.61) return '#EF4444'; // Red High Risk
      if (point.bust_probability >= 0.31) return '#F59E0B'; // Amber Moderate Risk
      return '#10B981'; // Emerald Low Risk
    }
  };

  return (
    <div className="bg-[#151E32] border border-[#1E293B] rounded-xl p-4 flex flex-col h-[520px] relative shadow-lg overflow-hidden">
      {/* Map Control Bar & Layer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            India Geospatial Risk Map — Day {selectedDay}
          </h2>
        </div>

        {/* Floating Layer Controls */}
        <div className="flex items-center gap-1 bg-[#0B1120]/90 border border-[#1E293B] p-1 rounded-lg backdrop-blur-sm overflow-x-auto text-xs">
          <span className="text-slate-400 px-2 py-0.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Layer:
          </span>
          <button
            onClick={() => setActiveLayer('bust_prob')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeLayer === 'bust_prob' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bust Risk
          </button>
          <button
            onClick={() => setActiveLayer('confidence')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeLayer === 'confidence' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Confidence
          </button>
          <button
            onClick={() => setActiveLayer('precipitation')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeLayer === 'precipitation' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rainfall
          </button>
        </div>
      </div>

      {/* Leaflet Geospatial Canvas */}
      <div className="flex-1 w-full rounded-lg overflow-hidden border border-[#1E293B] relative">
        <MapContainer
          center={[21.5, 78.5]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          />

          {regions.map((point) => {
            const isSelected = selectedRegionId === point.id;
            const color = getMarkerColor(point);
            const radius = isSelected ? 18 : 14;

            return (
              <CircleMarker
                key={point.id}
                center={[point.lat, point.lon]}
                radius={radius}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.9 : 0.65,
                  color: isSelected ? '#FFFFFF' : color,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onSelectRegion(point.id),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
                  <div className="text-xs bg-[#151E32] text-slate-100 p-1 font-sans">
                    <strong className="text-cyan-300">{point.region_name}</strong>
                    <div className="mt-0.5">Bust Probability: <strong>{Math.round(point.bust_probability * 100)}%</strong></div>
                    <div>Confidence: <strong>{point.confidence_score}/100</strong></div>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 text-xs text-slate-200 font-sans space-y-1">
                    <div className="font-bold text-sm text-cyan-400">{point.region_name}</div>
                    <div className="flex justify-between gap-4">
                      <span>Bust Probability:</span>
                      <strong className={point.bust_probability >= 0.6 ? 'text-rose-400' : 'text-amber-400'}>
                        {Math.round(point.bust_probability * 100)}%
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Confidence Score:</span>
                      <strong className="text-cyan-300">{point.confidence_score} / 100</strong>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-400">
                      <span>2m Temp:</span>
                      <span>{point.temp_2m} °C</span>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-400">
                      <span>Precipitation:</span>
                      <span>{point.precipitation} mm</span>
                    </div>
                    <button
                      onClick={() => onSelectRegion(point.id)}
                      className="w-full mt-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-center transition-colors"
                    >
                      Inspect Explainability
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-[#0B1120]/90 border border-[#1E293B] p-2.5 rounded-lg text-xs backdrop-blur-sm shadow-md">
          <div className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            {activeLayer === 'confidence' ? 'Confidence Scale' : 'Bust Risk Level'}
          </div>
          <div className="space-y-1 text-[11px]">
            {activeLayer === 'confidence' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#06B6D4]" />
                  <span className="text-slate-300">High Confidence (65-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-300">Moderate (40-64)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                  <span className="text-slate-300">Low Confidence (&lt;40)</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="text-slate-300">High Risk (prob &ge; 0.61)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-slate-300">Moderate Risk (0.31–0.60)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-slate-300">Low Risk (prob &le; 0.30)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
