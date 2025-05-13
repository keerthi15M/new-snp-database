import React from 'react';
import "../styles/T3_index.css";

const LoadingState = () => {
  return (
    <div className="loading-container">
      <div className="loader-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>
      
      <div className="loader-content">
        <div className="loading-spinner">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loader-icon">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
        <h3 className="loading-title">Loading SNP Data</h3>
        <p className="loading-subtitle">
          Retrieving information from NCBI database...
        </p>
      </div>
      
      <div className="skeleton skeleton-bar mx-auto mb-6"></div>
      
      <div className="loader-grid">
        <div className="skeleton skeleton-card"></div>
        <div className="skeleton skeleton-card"></div>
      </div>
      
      <style jsx="true">{`
        .loading-container {
          width: 100%;
          animation: fadeIn 0.3s ease-out;
          padding: 24px 0;
        }
        
        .loader-header {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .skeleton {
          background: linear-gradient(90deg, var(--muted) 0%, var(--accent) 50%, var(--muted) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: var(--radius);
        }
        
        .skeleton-title {
          height: 20px;
          width: 150px;
          margin-bottom: 4px;
        }
        
        .skeleton-subtitle {
          height: 40px;
          width: 250px;
        }
        
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 48px;
        }
        
        .loading-spinner {
          margin-bottom: 16px;
        }
        
        .loader-icon {
          animation: spin 1.5s linear infinite;
          color: var(--primary);
        }
        
        .loading-title {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 0;
        }
        
        .loading-subtitle {
          color: var(--muted-foreground);
          text-align: center;
          margin-top: 8px;
        }
        
        .skeleton-bar {
          height: 32px;
          width: 100%;
          max-width: 500px;
          margin-bottom: 24px;
        }
        
        .loader-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        
        .skeleton-card {
          height: 256px;
          width: 100%;
        }
        
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        
        .mb-6 {
          margin-bottom: 24px;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        
        @media (min-width: 768px) {
          .loader-header {
            flex-direction: row;
            align-items: center;
          }
          
          .loader-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
