import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import "../styles/T3_index.css";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9146FF', '#FF4560'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-name">{`${payload[0].name}`}</p>
        <p className="tooltip-value">{`Frequency: ${payload[0].value.toFixed(4)}`}</p>
        <p className="tooltip-percent">{`${(payload[0].value * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const FrequencyChart = ({ data }) => {
  const frequencyData = useMemo(() => {
    if (!data?.primary_snapshot_data?.allele_annotations) return [];

    // Extract frequency data from various sources
    const frequencies = {};
    
    try {
      data.primary_snapshot_data.allele_annotations.forEach((annotation) => {
        annotation.frequency?.forEach((freqData) => {
          freqData.observation?.forEach((obs) => {
            const allele = obs.allele || 'Unknown';
            const count = obs.count || 0;
            const totalCount = freqData.total_count || 0;
            
            if (totalCount > 0) {
              if (!frequencies[allele]) {
                frequencies[allele] = 0;
              }
              frequencies[allele] += count / totalCount;
            }
          });
        });
      });
    } catch (e) {
      console.error('Error parsing frequency data:', e);
    }

    // Format data for the pie chart
    return Object.entries(frequencies).map(([name, value]) => ({
      name,
      value: value / Object.keys(frequencies).length // Normalize
    }));
  }, [data]);

  if (!frequencyData.length) {
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Allele Frequencies</h3>
        </div>
        <div className="card-content">
          <p className="text-muted">No frequency data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="frequency-card">
      <div className="card-header">
        <h3 className="card-title">Allele Frequencies</h3>
      </div>
      <div className="card-content">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={frequencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={750}
                animationBegin={0}
              >
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <style jsx="true">{`
        .frequency-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 24px;
          animation: slideUp 0.4s ease-out;
        }
        
        .card-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .card-title {
          font-size: 20px;
          margin: 0;
        }
        
        .card-content {
          padding: 16px 24px;
        }
        
        .chart-container {
          height: 300px;
          width: 100%;
        }
        
        .chart-tooltip {
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          padding: 8px;
          border-radius: var(--radius);
        }
        
        .tooltip-name {
          font-weight: 500;
          margin: 0 0 4px 0;
        }
        
        .tooltip-value {
          font-size: 14px;
          color: var(--muted-foreground);
          margin: 0 0 4px 0;
        }
        
        .tooltip-percent {
          font-size: 12px;
          color: var(--primary);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default FrequencyChart;
