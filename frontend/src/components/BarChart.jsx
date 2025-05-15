import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, Label } from "recharts";

const BarChart_1 = ({data}) => {
  console.log("data: ",data)
  // Color palette - will cycle through for any number of bars
  const colors = [
    "#845EC2", "#D65DB1", "#FF6F91", "#FFC75F", "#0081CF", "#00C9A7", "#FF9F1C", "#2EC4B6",
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-xl font-bold text-gray-800 mb-4">Consequence Distribution Chart</h1>
        <BarChart
          width={600}
          height={350}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#333", fontSize: 12 }} 
            angle={-45} 
            textAnchor="end"
          >
            <Label value="Consequences" offset={-40} position="insideBottom" />
          </XAxis>
          <YAxis tick={{ fill: "#333", fontSize: 12 }}>
            <Label value="Count" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} />
          </YAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={2}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default BarChart_1;
