import React from 'react';
import "../styles/T3_index.css";

const AlleleTable = ({ data }) => {
  if (!data?.primary_snapshot_data?.placements_with_allele) {
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Allele Information</h3>
        </div>
        <div className="card-content">
          <p className="text-muted">No allele information available</p>
        </div>
      </div>
    );
  }

  const alleles = data.primary_snapshot_data.placements_with_allele.flatMap(
    (placement) => {
      return placement.alleles.map((allele) => {
        const sequenceInfo = placement.placement.seq_id_traits_by_assembly?.[0]?.seq_id_traits || {};
        return {
          allele: allele.allele?.spdi?.inserted_sequence || 'N/A',
          deleted: allele.allele?.spdi?.deleted_sequence || 'N/A',
          position: allele.allele?.spdi?.position || 'N/A',
          chromosome: sequenceInfo.name || 'N/A',
          assemblyName: placement.placement.seq_id_traits_by_assembly?.[0]?.assembly_name || 'N/A',
          is_ptlp: placement.is_ptlp,
        };
      });
    }
  );

  return (
    <div className="allele-card">
      <div className="card-header">
        <h3 className="card-title">Allele Information</h3>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Assembly</th>
              <th>Chromosome</th>
              <th>Position</th>
              <th>Reference</th>
              <th>Alternate</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {alleles.map((allele, index) => (
              <tr key={index}>
                <td>{allele.assemblyName}</td>
                <td>{allele.chromosome}</td>
                <td>{allele.position}</td>
                <td>
                  <span className="reference-allele">{allele.deleted}</span>
                </td>
                <td>
                  <span className="alternate-allele">{allele.allele}</span>
                </td>
                <td>
                  {allele.is_ptlp ? (
                    <span className="badge badge-primary">Primary</span>
                  ) : (
                    <span className="badge badge-outline">Alternative</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx="true">{`
        .allele-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 24px;
          overflow: hidden;
          animation: slideUp 0.4s ease-out;
        }
        
        .card-header {
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          padding: 16px 24px;
        }
        
        .card-title {
          font-size: 20px;
          display: flex;
          align-items: center;
          margin: 0;
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
        
        .table tr:hover {
          background-color: var(--muted);
        }
        
        .reference-allele {
          font-family: monospace;
          background-color: var(--secondary);
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .alternate-allele {
          font-family: monospace;
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default AlleleTable;
