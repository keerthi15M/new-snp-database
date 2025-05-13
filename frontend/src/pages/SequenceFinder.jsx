import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/mainV1.css';
import '../styles/sequencefinder.css';
import axios from 'axios';
import SnpSelector from '../components/SnpSelector';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

const DataExplorer = () => {
  const [snpId, setSnpId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedTags, setExpandedTags] = useState({});
  const [selectedData, setSelectedData] = useState({ gene: "", snpId: "", source: "" });
  
  const handleSelectionChange = (newSelection) => {
      setSelectedData(newSelection);
  };

  useEffect(() => {
      if (selectedData) {
      //   setGeneInput(selectedData.gene);
      setSnpId(selectedData.snpId);
      }
  }, [selectedData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!snpId.trim()) {
      setError('Please enter a valid SNP ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/find-sequence/${snpId}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleTag = (tag) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  const isSimpleValue = (value) => {
    return typeof value !== 'object' || value === null;
  };

  const isArrayOfObjects = (value) => {
    return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
  };

  const renderComplexTable = (arrayOfObjects) => {
    // Get all unique keys across all objects
    const allKeys = [...new Set(arrayOfObjects.flatMap(obj => Object.keys(obj)))];

    return (
      <div className="complex-table-wrapper">
        <table className="complex-table">
          <thead>
            <tr>
              {allKeys.map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arrayOfObjects.map((obj, index) => (
              <tr key={index}>
                {allKeys.map(key => (
                  <td key={`${index}-${key}`}>
                    {obj[key] !== undefined ? 
                      (typeof obj[key] === 'object' ? 
                        JSON.stringify(obj[key]) : 
                        String(obj[key])) 
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="null-value">null</span>;
    }

    if (isArrayOfObjects(value)) {
      return renderComplexTable(value);
    }

    if (Array.isArray(value)) {
      return (
        <ol className="array-list">
          {value.map((item, index) => (
            <li key={index}>
              {typeof item === 'object' ? renderObject(item) : String(item)}
            </li>
          ))}
        </ol>
      );
    }

    if (typeof value === 'object') {
      return renderObject(value);
    }

    return String(value);
  };

  const renderObject = (obj) => {
    if (!obj) return null;

    return (
      <table className="object-table">
        <thead>
          <tr>
            {Object.keys(obj).map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(obj).map(key => (
              <td key={key}>
                {typeof obj[key] === 'object' ? 
                  JSON.stringify(obj[key]) : 
                  String(obj[key])}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="page-container full-width">
      <div className="content-wrapper wide-content">
        <Link to="/ToolsSuite" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to Tools
        </Link>
        
        <h1 className="page-title">Data Explorer</h1>
        <p className="page-description">
          Efficiently search, filter, and explore large SNP datasets with our intuitive 
          and powerful data exploration tool.
        </p>
        
        <div className="content-box explorer-content">
          <h2 className="tool-section-title">SNP Mapping</h2>
          <p className="tool-section-description">
            Search for SNP mappings by ID and view detailed information.
          </p>
          <SnpSelector onSelectionChange={handleSelectionChange} />

          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Enter SNP ID (e.g.,rs699) / Accession ID"
                value={snpId}
                onChange={(e) => setSnpId(e.target.value)}
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? 'Searching...' : <><Search size={18} /> Find</>}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>

          {results && (
            <div className="results-container">
              <div className="results-header">
                <h3>Search Results</h3>
              </div>

              <div className="highlighted-results">
                <div className="result-hero-card">
                  <div className="result-hero-content">
                    <div className="result-hero-section">
                      <div className="result-hero-label">Mapping Details Table</div>
                      {renderComplexTable(results.mappings)}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="details-toggle-button"
                onClick={toggleDetails}
              >
                {showDetails ? 
                  <><ChevronUp size={16} /> Hide Details</> : 
                  <><ChevronDown size={16} /> More Details</>
                }
              </button>

              {showDetails && (
                <div className="details-container">
                  <div className="details-section">
                    <h4>Complete Data</h4>
                    <div className="tags-container">
                      {results.fullData && Object.keys(results.fullData).map(key => {
                        const value = results.fullData[key];
                        const isSimple = isSimpleValue(value);
                        
                        if (isSimple) {
                          return (
                            <div key={key} className="data-tag-container">
                              <div className="data-tag simple-tag">
                                <span className="tag-key">{key}</span>
                                <span className="tag-separator">::</span>
                                <span className="tag-value">{value === null ? 'null' : String(value)}</span>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={key} className="data-tag-container">
                            <button 
                              className={`data-tag ${expandedTags[key] ? 'expanded' : ''}`}
                              onClick={() => toggleTag(key)}
                            >
                              {key} {expandedTags[key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            
                            {expandedTags[key] && (
                              <div className="tag-content">
                                {renderValue(value)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Sequence Data</h4>
                    <div className="tags-container">
                      {results.sequenceData && Object.keys(results.sequenceData).map(key => {
                        const value = results.sequenceData[key];
                        const isSimple = isSimpleValue(value);
                        
                        if (isSimple) {
                          return (
                            <div key={key} className="data-tag-container">
                              <div className="data-tag simple-tag">
                                <span className="tag-key">{key}</span>
                                <span className="tag-separator">::</span>
                                <span className="tag-value">{value === null ? 'null' : String(value)}</span>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={key} className="data-tag-container">
                            <button 
                              className={`data-tag ${expandedTags[`seq_${key}`] ? 'expanded' : ''}`}
                              onClick={() => toggleTag(`seq_${key}`)}
                            >
                              {key} {expandedTags[`seq_${key}`] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            
                            {expandedTags[`seq_${key}`] && (
                              <div className="tag-content">
                                {renderValue(value)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorer;
