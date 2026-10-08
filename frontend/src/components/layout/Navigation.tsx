import React from 'react';
import { LayoutDashboard, MapPin, LineChart, Cpu, SlidersHorizontal } from 'lucide-react';

export type NavTab = 'overview' | 'map' | 'forecast' | 'diagnostics' | 'data';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'map', label: 'Risk Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'forecast', label: 'Reliability Strip', icon: <LineChart className="w-4 h-4" /> },
    { id: 'diagnostics', label: 'Explainability', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'data', label: 'Data & Model', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#151E32] border-b md:border-b-0 md:border-r border-[#1E293B] px-3 py-2 md:py-4 flex md:flex-col gap-1 overflow-x-auto md:w-56 shrink-0">
      <div className="hidden md:block px-3 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        Operational Views
      </div>

      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60'
            }`}
          >
            <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
