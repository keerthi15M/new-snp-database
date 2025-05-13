import React, { useState } from 'react';
import AlleleTable from './T3_AlleleTable';
import FrequencyChart from './T3_FrequencyChart';
import ClinicalSignificance from './T3_ClinicalSignificance';
import GenotypeTable from './T3_GenotypeTable';
import PublicationsList from './T3_PublicationsList';
import GeneSummary from './T3_GeneSummary';
import "../styles/T3_index.css";

const SnpContent = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!data) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dna' },
    { id: 'clinical', label: 'Clinical', icon: 'alert-triangle' },
    { id: 'frequency', label: 'Frequency', icon: 'bar-chart' },
    { id: 'genotype', label: 'Genotype', icon: 'dices' },
    { id: 'publications', label: 'Publications', icon: 'book-open' }
  ];

  const renderIcon = (icon) => {
    switch(icon) {
      case 'dna':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
            <path d="m17 6-2.5-2.5" />
            <path d="m7 18-2.5-2.5" />
          </svg>
        );
      case 'alert-triangle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'bar-chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
        );
      case 'dices':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="8" height="8" rx="2"></rect>
            <rect x="14" y="2" width="8" height="8" rx="2"></rect>
            <rect x="8" y="14" width="8" height="8" rx="2"></rect>
            <path d="m6 6 .01.01"></path>
            <path d="M18 6 18.01 6.01"></path>
            <path d="m12 18 .01.01"></path>
          </svg>
        );
      case 'book-open':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{renderIcon(tab.icon)}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <AlleleTable data={data} />
            <GeneSummary data={data} />
          </div>
        )}

        {activeTab === 'clinical' && (
          <ClinicalSignificance data={data} />
        )}

        {activeTab === 'frequency' && (
          <FrequencyChart data={data} />
        )}

        {activeTab === 'genotype' && (
          <GenotypeTable data={data} />
        )}

        {activeTab === 'publications' && (
          <PublicationsList data={data} />
        )}
      </div>
      
      <style jsx="true">{`
        .tabs-container {
          width: 100%;
          animation: fadeIn 0.3s ease-out;
        }
        
        .tabs-list {
          display: flex;
          overflow-x: auto;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 500;
          color: var(--muted-foreground);
          transition: all 0.2s ease;
        }
        
        .tab-button:hover {
          color: var(--foreground);
        }
        
        .tab-button.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        
        .tab-icon {
          display: flex;
          align-items: center;
        }
        
        .tab-content {
          padding-top: 8px;
        }
        
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        
        @media (min-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SnpContent;
