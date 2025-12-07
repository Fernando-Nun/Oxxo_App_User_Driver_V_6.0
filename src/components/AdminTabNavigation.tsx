import { useState, useEffect, useRef } from 'react';
import { BarChart3, Car, Users, UserCheck, Eye } from 'lucide-react';

interface AdminTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Resumen', icon: BarChart3 },
  { id: 'trips', label: 'Viajes', icon: Car },
  { id: 'drivers', label: 'Conductores', icon: UserCheck },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'monitor', label: 'Monitor', icon: Eye },
];

export function AdminTabNavigation({ activeTab, onTabChange }: AdminTabNavigationProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];
    
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-1 overflow-hidden">
      {/* Animated Bottom Indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-red-600 transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Tabs Container */}
      <div className="grid grid-cols-5 gap-0 relative z-10">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-4 py-3 transition-all duration-300 ease-out
                flex flex-col items-center justify-center gap-1.5
                group
                ${isActive 
                  ? 'text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                transition-all duration-300 ease-out
                ${isActive ? 'transform scale-110' : 'group-hover:scale-105'}
              `}>
                <Icon className={`
                  size-6 transition-all duration-300
                  ${isActive ? 'stroke-[2.5]' : 'stroke-2'}
                `} />
              </div>

              {/* Label */}
              <span className={`
                text-xs transition-all duration-300 ease-out
                ${isActive ? 'font-semibold' : 'font-medium group-hover:font-semibold'}
              `}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}