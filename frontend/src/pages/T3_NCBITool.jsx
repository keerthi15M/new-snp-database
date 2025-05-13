import React, { useState } from 'react';
import { fetchSnpById } from '../api/T3_snpService';
import "../styles/T3_index.css";

// Components
import SearchBar from '../components/T3_SearchBar';
import SnpHeader from '../components/T3_SnpHeader';
import SnpContent from '../components/T3_SnpContent';
import LoadingState from '../components/T3_LoadingState';
import ErrorState from '../components/T3_ErrorState';

const NCBITool = () => {
  const [snpData, setSnpData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (snpId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchSnpById(snpId);
      setSnpData(data);
      showToast('success', `SNP rs${snpId} data loaded successfully`);
    } catch (err) {
      console.error('Error fetching SNP data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch SNP data'));
      showToast('error', err instanceof Error ? err.message : 'Failed to fetch SNP data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };
  
  // Simple toast function since we're removing the UI library
  const showToast = (type, message) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-hidden');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-primary">
              <path d="M2 15c6.667-6 13.333 0 20-6" />
              <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
              <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
              <path d="m17 6-2.5-2.5" />
              <path d="m7 18-2.5-2.5" />
            </svg>
            <h1 className="text-2xl font-bold">SNP Explorer</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Powered by NCBI Variation API
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-center mb-3 animate-fade-in">
              Explore Genetic Variants
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 animate-fade-in">
              Enter a SNP ID to access comprehensive information about genetic variants from the NCBI database.
            </p>
            
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} resetError={resetError} />
          ) : snpData ? (
            <div className="space-y-6">
              <SnpHeader data={snpData} />
              <SnpContent data={snpData} />
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary-light p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-primary">
                    <path d="M2 15c6.667-6 13.333 0 20-6" />
                    <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
                    <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
                    <path d="m17 6-2.5-2.5" />
                    <path d="m7 18-2.5-2.5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Begin Your Genetic Exploration</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Search for SNP IDs like 6666, 7, or 328 to view detailed information about genetic variants.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>SNP Explorer uses data from the NCBI Variation API. This tool is for research and educational purposes only.</p>
        </div>
      </footer>
      
      <style jsx="true">{`
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 10px 20px;
          border-radius: var(--radius);
          color: white;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }
        
        .toast-success {
          background-color: #10b981;
        }
        
        .toast-error {
          background-color: var(--destructive);
        }
        
        .toast-hidden {
          animation: slideOut 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NCBITool;
