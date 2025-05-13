import React from 'react';
import "../styles/T3_index.css";

const ClinicalSignificance = ({ data }) => {
  if (!data?.primary_snapshot_data?.allele_annotations) {
    return null;
  }

  const clinicalData = [];
  
  try {
    data.primary_snapshot_data.allele_annotations.forEach((annotation) => {
      annotation.clinical?.forEach((clinical) => {
        if (clinical.clinical_significances) {
          const entry = {
            significance: clinical.clinical_significances.join(', '),
            disease: clinical.disease?.name || 'Not specified',
            origin: clinical.origins?.join(', ') || 'Unknown',
            reviewStatus: clinical.review_status || 'Not provided',
            citations: clinical.citations?.length || 0
          };
          
          clinicalData.push(entry);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing clinical data:', e);
  }

  if (clinicalData.length === 0) {
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-primary mr-2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Clinical Significance
          </h3>
        </div>
        <div className="card-content">
          <p className="text-muted">No clinical significance data available for this SNP</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clinical-card">
      <div className="card-header">
        <h3 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-primary">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Clinical Significance
        </h3>
      </div>
      <div className="card-content">
        {clinicalData.map((item, index) => (
          <div key={index} className="clinical-item">
            <div className="badge-row">
              <span className={`significance-badge ${getSignificanceClass(item.significance)}`}>
                {item.significance || 'Unknown significance'}
              </span>
              <span className="review-badge">
                {item.reviewStatus}
              </span>
            </div>
            
            <h4 className="disease-name">{item.disease}</h4>
            
            <div className="clinical-details">
              <div className="detail-item">
                <span className="detail-label">Origin:</span>
                <span className="detail-value">{item.origin}</span>
              </div>
              
              {item.citations > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Citations:</span>
                  <span className="detail-value">{item.citations}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx="true">{`
        .clinical-card {
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
          margin: 0;
        }
        
        .icon-primary {
          color: var(--primary);
        }
        
        .card-content {
          padding: 16px 24px;
        }
        
        .clinical-item {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 16px;
        }
        
        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .significance-badge {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .significance-pathogenic {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .significance-benign {
          background-color: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }
        
        .significance-uncertain {
          background-color: rgba(249, 115, 22, 0.1);
          color: #f97316;
        }
        
        .significance-other {
          background-color: rgba(59, 130, 246, 0.1);
          color: var(--primary);
        }
        
        .review-badge {
          background-color: var(--muted);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 12px;
        }
        
        .disease-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .clinical-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin: 0;
        }
        
        .detail-label {
          font-weight: 500;
          margin-right: 8px;
          min-width: 80px;
        }
        
        .detail-value {
          color: var(--muted-foreground);
        }
        
        @media (min-width: 640px) {
          .clinical-details {
            flex-direction: row;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to determine badge class based on significance text
function getSignificanceClass(significance) {
  if (!significance) return 'significance-other';
  
  const lowerSig = significance.toLowerCase();
  
  if (lowerSig.includes('pathogenic')) {
    return 'significance-pathogenic';
  } else if (lowerSig.includes('benign')) {
    return 'significance-benign';
  } else if (lowerSig.includes('uncertain') || lowerSig.includes('unknown')) {
    return 'significance-uncertain';
  } else {
    return 'significance-other';
  }
}

export default ClinicalSignificance;
