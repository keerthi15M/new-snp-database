import React, { useState } from 'react';
import "../styles/T3_index.css";

const SearchBar = ({ onSearch, isLoading }) => {
  const [snpId, setSnpId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!snpId.trim()) {
      alert('Please enter a SNP ID');
      return;
    }
    
    // Remove any non-numeric characters
    const cleanedSnpId = snpId.replace(/\D/g, '');
    
    if (!cleanedSnpId) {
      alert('Please enter a valid SNP ID (numbers only)');
      return;
    }
    
    onSearch(cleanedSnpId);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-wrapper">
          <div className="input-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Enter SNP ID (e.g. 6666)"
            value={snpId}
            onChange={(e) => setSnpId(e.target.value)}
            className="input"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary search-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
      <p className="hint-text">
        Try searching for SNP IDs like 6666, 7 or 328
      </p>
      
      <style jsx="true">{`
        .search-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .search-form {
          display: flex;
          position: relative;
        }
        
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          pointer-events: none;
        }
        
        .input {
          width: 100%;
          height: 48px;
          padding-left: 40px;
          font-size: 16px;
        }
        
        .search-button {
          margin-left: 8px;
          height: 48px;
          padding: 0 24px;
        }
        
        .hint-text {
          text-align: center;
          font-size: 14px;
          color: var(--muted-foreground);
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
