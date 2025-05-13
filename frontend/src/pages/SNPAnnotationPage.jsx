import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AnnotationTool.css";
import SnpSelector from '../components/SnpSelector';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

const SNPAnnotationTool = () => {
  const [source, setSource] = useState("clinvar");
  const [snp, setSnp] = useState("");
  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState({ gene: "", snpId: "", source: "" });
    
  const handleSelectionChange = (newSelection) => {
      setSelectedData(newSelection);
  };

  useEffect(() => {
      if (selectedData) {
      //   setGeneInput(selectedData.gene);
        setSource(selectedData.source);
        setSnp(selectedData.snpId);
      }
  }, [selectedData]);

  const fetchSnpData = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/fetch-snp?snp=${snp}&source=${source}`);
        const result = response.data
      setData(result);
    } catch (error) {
      console.error("Error fetching SNP data:", error);
    }
  };

  return (
    <div className="annotation-tool">
      <h1 className="annotation-header">SNP Annotation Tool</h1>
      <SnpSelector onSelectionChange={handleSelectionChange} />
      <div className="filter-container">
        <label>Source:</label>
        <select className="source-select" onChange={(e) => setSource(e.target.value)} value={source}>
          <option value="clinvar">ClinVar</option>
          <option value="snp">SNP</option>
        </select>
        <label>SNP ID:</label>
        <input
          type="text"
          className="snp-input"
          placeholder="Enter SNP"
          value={snp}
          onChange={(e) => setSnp(e.target.value)}
        />
        <button className="fetch-button" onClick={fetchSnpData}>Fetch SNP</button>
      </div>
      {data && (
        <div className="data-card">
          {/* Display first object of data.data */}
          {data.data.length > 0 && Object.entries(data.data[0]).map(([key, value]) => (
            (key !== "dbSNP_link" && key !== "ClinVar_Link") && (
              <div key={key} className="data-row">
                <span className="data-key">{key}:</span>
                <input type="text" className="data-value" value={value} readOnly />
              </div>
            )
          ))}
          
          {/* Display sources */}
          {data.sources && Object.keys(data.sources).length > 0 && (
            <>
              <h2 className="sources-header">Sources:</h2>
              <ul className="sources-list">
                {Object.entries(data.sources).map(([key, value]) => (
                  <li key={key}>
                    <a href={value} target="_blank" rel="noopener noreferrer" className="source-link">{key}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SNPAnnotationTool;
