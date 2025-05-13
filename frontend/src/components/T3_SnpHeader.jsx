import React from 'react';
import "../styles/T3_index.css";

const SnpHeader = ({ data }) => {
  if (!data) return null;
  
  const refsnpId = data.refsnp_id;
  const update_date = data.last_update_date || 'N/A';
  const chromosomeLocation = data.primary_snapshot_data?.placements_with_allele?.[0]?.placement?.seq_id_traits_by_assembly?.[0]?.seq_id_traits?.name || 'Unknown';
  const chromosomePos = data.primary_snapshot_data?.placements_with_allele?.[0]?.placement?.pos || 'Unknown';
  
  return (
    <div className="snp-header">
      <div className="header-container">
        <div className="header-left">
          <div className="badge-container">
            <span className="badge badge-primary">RefSNP</span>
            <span className="badge badge-secondary">NCBI dbSNP</span>
          </div>
          <h1 className="snp-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dna-icon">
              <path d="M2 15c6.667-6 13.333 0 20-6" />
              <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
              <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
              <path d="m17 6-2.5-2.5" />
              <path d="m7 18-2.5-2.5" />
            </svg>
            <span>rs{refsnpId}</span>
          </h1>
        </div>
        
        <div className="meta-container">
          <div className="meta-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            <div>
              <div className="meta-label">Chromosome</div>
              <div className="meta-value">{chromosomeLocation}</div>
            </div>
          </div>
          
          <div className="meta-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <div>
              <div className="meta-label">Position</div>
              <div className="meta-value">{chromosomePos}</div>
            </div>
          </div>
          
          <div className="meta-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meta-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <div className="meta-label">Last Updated</div>
              <div className="meta-value">{update_date ? new Date(update_date).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .snp-header {
          width: 100%;
          animation: fadeIn 0.3s ease-out;
        }
        
        .header-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .badge-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        .badge {
          font-size: 12px;
        }
        
        .badge-primary {
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--primary);
          border: none;
        }
        
        .snp-title {
          font-size: 32px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .dna-icon {
          color: var(--primary);
        }
        
        .meta-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .meta-card {
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: var(--radius);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .meta-icon {
          color: var(--primary);
        }
        
        .meta-label {
          font-size: 12px;
          color: var(--muted-foreground);
        }
        
        .meta-value {
          font-weight: 500;
        }
        
        @media (min-width: 768px) {
          .header-container {
            flex-direction: row;
            align-items: center;
          }
          
          .meta-container {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default SnpHeader;
