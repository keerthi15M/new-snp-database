import React from 'react';
import "../styles/T3_index.css";

const ErrorState = ({ error, resetError }) => {
  const isCorsError = error?.message.includes('CORS') || error?.message.includes('Network error');
  
  return (
    <div className="error-container">
      <div className="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h2 className="error-title">Error Loading SNP Data</h2>
      
      <p className="error-message">
        {error?.message || "We couldn't retrieve the data for this SNP. Please check the SNP ID and try again."}
      </p>
      
      {isCorsError && (
        <div className="cors-alert">
          <p>
            This error is likely due to CORS restrictions when accessing the NCBI API directly from the browser. 
            In a production environment, you would need to set up a proxy server to make the requests.
          </p>
        </div>
      )}
      
      <div className="error-actions">
        <button onClick={resetError} className="btn btn-primary">
          Try Again
        </button>
        
        {isCorsError && (
          <a 
            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline learn-link"
          >
            Learn About CORS
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        )}
      </div>
      
      <style jsx="true">{`
        .error-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 0;
          animation: fadeIn 0.3s ease-out;
        }
        
        .error-icon {
          background-color: rgba(239, 68, 68, 0.1);
          padding: 16px;
          border-radius: 50%;
          margin-bottom: 16px;
          color: var(--destructive);
        }
        
        .error-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .error-message {
          text-align: center;
          max-width: 500px;
          margin-bottom: 24px;
          color: var(--muted-foreground);
        }
        
        .cors-alert {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius);
          padding: 16px;
          margin-bottom: 24px;
          max-width: 500px;
        }
        
        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .learn-link {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        @media (min-width: 640px) {
          .error-actions {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default ErrorState;
