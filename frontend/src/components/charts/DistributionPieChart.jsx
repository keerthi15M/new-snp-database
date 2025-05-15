import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from 'recharts';

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

// Custom active shape for the pie chart
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-lg font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999">
        {`Value: ${value}`}
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const DistributionPieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}`, 'Value']}
          labelFormatter={(name) => `${name}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
