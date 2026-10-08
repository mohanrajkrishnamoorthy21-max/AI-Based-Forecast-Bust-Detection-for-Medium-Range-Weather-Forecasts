import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation, type NavTab } from './components/layout/Navigation';
import { KPICards } from './components/dashboard/KPICards';
import { RiskMap } from './components/dashboard/RiskMap';
import { TimelineStrip } from './components/dashboard/TimelineStrip';
import { ExplainabilityPanel } from './components/dashboard/ExplainabilityPanel';
import { DiagnosticPanel } from './components/dashboard/DiagnosticPanel';
import { ReliabilityChart } from './components/dashboard/ReliabilityChart';
import { DataModelStatus } from './components/dashboard/DataModelStatus';

import type {
  DashboardSummary,
  GridPoint,
  RegionDiagnostic,
  TimelinePoint,
  DataStatus,
} from './types/api';

import {
  fetchDashboardSummary,
  fetchRiskMapData,
  fetchTimelineData,
  fetchExplainability,
  fetchDataStatus,
} from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedDay, setSelectedDay] = useState<number>(5);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('IND_NE');

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [regions, setRegions] = useState<GridPoint[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [diagnostic, setDiagnostic] = useState<RegionDiagnostic | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial global data
  const loadGlobalData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, mapRes, timeRes, statusRes] = await Promise.all([
        fetchDashboardSummary(selectedDay),
        fetchRiskMapData(selectedDay),
        fetchTimelineData(),
        fetchDataStatus(),
      ]);

      setSummary(sumRes);
      setRegions(mapRes);
      setTimeline(timeRes);
      setDataStatus(statusRes);
    } catch (err) {
      console.error('Failed to load global forecast diagnostics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load selected region diagnostic explainability when region or day changes
  const loadRegionDiagnostic = async (regId: string, day: number) => {
    try {
      const diagRes = await fetchExplainability(regId, day);
      setDiagnostic(diagRes);
    } catch (err) {
      console.error('Failed to load region diagnostic:', err);
    }
  };

  useEffect(() => {
    loadGlobalData();
  }, [selectedDay]);

  useEffect(() => {
    if (selectedRegionId) {
      loadRegionDiagnostic(selectedRegionId, selectedDay);
    }
  }, [selectedRegionId, selectedDay]);

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        summary={summary}
        selectedDay={selectedDay}
        onRefresh={loadGlobalData}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* KPI Cards */}
              <KPICards summary={summary} />

              {/* Day 1 - 10 Timeline Strip */}
              <TimelineStrip
                timeline={timeline}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
              />

              {/* Central Map & Region Diagnostics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RiskMap
                    regions={regions}
                    selectedRegionId={selectedRegionId}
                    onSelectRegion={handleSelectRegion}
                    selectedDay={selectedDay}
                  />
                </div>

                <div className="lg:col-span-1">
                  <DiagnosticPanel
                    diagnostic={diagnostic}
                    selectedDay={selectedDay}
                  />
                </div>
              </div>

              {/* Lower Explainability & Reliability Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExplainabilityPanel
                  diagnostic={diagnostic}
                  selectedDay={selectedDay}
                />
                <ReliabilityChart
                  timeline={timeline}
                  selectedDay={selectedDay}
                  onSelectDay={handleSelectDay}
                />
              </div>
            </>
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <RiskMap
                regions={regions}
                selectedRegionId={selectedRegionId}
                onSelectRegion={handleSelectRegion}
                selectedDay={selectedDay}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DiagnosticPanel diagnostic={diagnostic} selectedDay={selectedDay} />
                <ExplainabilityPanel diagnostic={diagnostic} selectedDay={selectedDay} />
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <TimelineStrip
                timeline={timeline}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
              />
              <ReliabilityChart
                timeline={timeline}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
              />
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExplainabilityPanel diagnostic={diagnostic} selectedDay={selectedDay} />
              <DiagnosticPanel diagnostic={diagnostic} selectedDay={selectedDay} />
            </div>
          )}

          {activeTab === 'data' && (
            <DataModelStatus status={dataStatus} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
