import React from 'react';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

export const ChartLegend = ({ data, activeItems, onToggle }) => {
  return (
    <div className="space-y-2 max-h-[320px] overflow-auto pr-2">
      {data.map((item, index) => (
        <button
          key={item}
          className={`flex items-center w-full p-2 rounded-md transition-all ${
            activeItems.includes(item)
              ? 'bg-white shadow-sm'
              : 'opacity-50 hover:opacity-80'
          }`}
          onClick={() => onToggle(item)}
        >
          <div
            className="w-3 h-3 rounded-sm mr-2"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-sm font-medium truncate">{item}</span>
        </button>
      ))}
    </div>
  );
};
