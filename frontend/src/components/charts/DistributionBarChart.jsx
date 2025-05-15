import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Updated colors with more premium, glassy feel
const COLORS = [
  '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', 
  '#8B5CF6', '#D946EF', '#0EA5E9', '#33C3F0'
];

export const DistributionBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`colorGradient-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="95%" stopColor={color} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#555' }} 
          angle={-45}
          textAnchor="end"
          height={70}
          stroke="#888"
        />
        <YAxis 
          stroke="#888" 
          tick={{ fontSize: 12, fill: '#555' }}
        />
        <Tooltip
          formatter={(value) => [`${value}`, 'Value']}
          labelFormatter={(name) => `${name}`}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
          wrapperStyle={{ outline: 'none' }}
          cursor={{ fill: 'rgba(155, 135, 245, 0.1)' }}
        />
        <Bar 
          dataKey="value" 
          radius={[6, 6, 0, 0]}
          animationDuration={1200}
          animationEasing="ease-in-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#colorGradient-${index % COLORS.length})`}
              style={{
                filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))',
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
