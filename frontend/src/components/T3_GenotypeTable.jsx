import React from 'react';
import "../styles/T3_index.css";

const GenotypeTable = ({ data }) => {
  if (!data?.primary_snapshot_data?.allele_annotations?.[0]?.frequency) {
    return null;
  }

  // Extract genotype data
  const genotypeData = [];
  
  try {
    data.primary_snapshot_data.allele_annotations.forEach((annotation) => {
      annotation.frequency?.forEach((freqData) => {
        if (freqData.study_name && freqData.observation) {
          const totalCount = freqData.total_count || 0;
          const observations = freqData.observation.map((obs) => {
            return {
              allele: obs.allele || 'N/A',
              count: obs.count || 0,
              frequency: totalCount > 0 ? (obs.count / totalCount) : 0
            };
          });
          
          genotypeData.push({
            study: freqData.study_name,
            source: freqData.study_info?.publication_datasource || 'Unknown',
            observations,
            totalCount
          });
        }
      });
    });
  } catch (e) {
    console.error('Error parsing genotype data:', e);
  }

  if (genotypeData.length === 0) {
    return null;
  }

  return (
    <div className="genotype-card">
      <div className="card-header">
        <h3 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-primary">
            <rect x="2" y="2" width="8" height="8" rx="2"></rect>
            <rect x="14" y="2" width="8" height="8" rx="2"></rect>
            <rect x="8" y="14" width="8" height="8" rx="2"></rect>
            <path d="m6 6 .01.01"></path>
            <path d="M18 6 18.01 6.01"></path>
            <path d="m12 18 .01.01"></path>
          </svg>
          Population Studies
        </h3>
        <p className="card-description">
          Frequency data from various population studies
        </p>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Study</th>
              <th>Source</th>
              <th>Allele</th>
              <th className="text-right">Count</th>
              <th className="text-right">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {genotypeData.flatMap((study, studyIndex) => 
              study.observations.map((obs, obsIndex) => (
                <tr key={`${studyIndex}-${obsIndex}`}>
                  {obsIndex === 0 ? (
                    <>
                      <td rowSpan={study.observations.length} className="study-cell">
                        {study.study}
                      </td>
                      <td rowSpan={study.observations.length} className="source-cell">
                        {study.source}
                      </td>
                    </>
                  ) : null}
                  <td>
                    <span className="allele-code">{obs.allele}</span>
                  </td>
                  <td className="text-right">{obs.count.toLocaleString()}</td>
                  <td className="text-right frequency-cell">
                    {(obs.frequency * 100).toFixed(2)}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <style jsx="true">{`
        .genotype-card {
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
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 4px 0;
        }
        
        .card-description {
          margin: 4px 0 0 0;
          color: var(--muted-foreground);
          font-size: 14px;
        }
        
        .icon-primary {
          color: var(--primary);
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table th {
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
        }
        
        .table td {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
        }
        
        .text-right {
          text-align: right;
        }
        
        .study-cell, .source-cell {
          vertical-align: top;
          border-right: 1px solid rgba(229, 231, 235, 0.3);
        }
        
        .allele-code {
          font-family: monospace;
          background-color: var(--secondary);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .frequency-cell {
          font-weight: 500;
        }
        
        .table tr:hover {
          background-color: var(--muted);
        }
      `}</style>
    </div>
  );
};

export default GenotypeTable;
