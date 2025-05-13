import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Database } from "lucide-react";
import PaginatedTable from "./PaginatedTable";
import Popup from "../components/PopUp";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

export default function DatasetPage() { 
  const [searchParams] = useSearchParams();
//   const dataset = searchParams.get("dataset") || "clinvar"; // Default dataset
  const navigate = useNavigate();
  // const [exportDisabled, setExportDisabled] = useState(true);

  const [results, setResults] = useState([]); // Stores dataset records
  const [filteredResults, setFilteredResults] = useState([]); // Stores search results
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [rsid, setRsid] = useState(""); // SNP Search input
  const [dataset, setDataset] = useState("clinvar"); // Dataset input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [columnValues, setColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch dataset when component loads
  useEffect(() => {
    fetchColumns(dataset);
    loadDataset(dataset);
  }, []);

  // Function to load dataset from API
  const loadDataset = async () => {
    setLoading(true);
    setError("");
    try {
      // Mock data for development - in production this would be a real API call
      // setTimeout(() => {
      //   const mockData = generateMockData(dataset);
      //   setResults(mockData);
      //   setFilteredResults(mockData);
      //   setLoading(false);
      // }, 800);
      
      // In production, use this:
      const { data } = await axios.get(`${BACKEND_URL}/all-rsids?dataset=${dataset}`);
      setResults(data);
      setFilteredResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      setError("Failed to load dataset. Please try again later.");
      setLoading(false);
    }
  };

  // Function to search dataset by rsID
  const searchDataset = async () => {
    if (!dataset.trim()) {
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Mock search for development
      setTimeout(() => {
        const mockData = generateMockData(dataset)
        setResults(mockData);
        setFilteredResults(mockData);
        setLoading(false);
      }, 500);
      
      // In production, use this:
      // const { data } = await axios.get(`http://localhost:5000/search?dataset=${dataset}`);
      // setResults(data);
      // setFilteredResults(data);
    } catch (error) {
      console.error("Error searching Dataset:", error);
      setError("Failed to search for Dataset. Please try again.");
      setLoading(false);
    }
  };

  // Function to search SNP by rsID
  const searchSNP = async () => {
    if (!rsid.trim()) {
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Mock search for development
      // setTimeout(() => {
      //   const mockData = generateMockData(dataset).filter(item => 
      //     item.rsid.toLowerCase().includes(rsid.toLowerCase())
      //   );
      //   setResults(mockData);
      //   setFilteredResults(mockData);
      //   setLoading(false);
      // }, 500);
      
      // In production, use this:
      const { data } = await axios.get(`${BACKEND_URL}/search?dataset=${dataset}&rsid=${rsid}`);
      setResults(data);
      setFilteredResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Error searching SNP:", error);
      setError("Failed to search for SNP. Please try again.");
      setLoading(false);
    }
  };

  // Handle search filtering
  useEffect(() => {
    const filterResults = async () => {
      if (searchTerm.trim() === "") {
        setFilteredResults(results);
      } else {
        const filtered = results.filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredResults(filtered);
      }
    };
  
    filterResults();
  }, [searchTerm, results]);


  // Generate mock data for development
  const generateMockData = (datasetType) => {
    const count = 20;
    const data = [];
    
    if (datasetType === 'clinvar') {
      for (let i = 0; i < count; i++) {
        data.push({
          rsid: `rs${100000 + i}`,
          gene: ['BRCA1', 'BRCA2', 'TP53', 'APC', 'CFTR'][Math.floor(Math.random() * 5)],
          chromosome: ['1', '2', '3', '4', '5', '6', '7', 'X', 'Y'][Math.floor(Math.random() * 9)],
          position: Math.floor(Math.random() * 100000000),
          clinical_significance: ['Pathogenic', 'Likely pathogenic', 'Uncertain significance', 'Likely benign', 'Benign'][Math.floor(Math.random() * 5)],
          phenotype: ['IBD', 'Crohn\'s disease', 'Ulcerative colitis', 'Not specified'][Math.floor(Math.random() * 4)]
        });
      }
    } else {
      for (let i = 0; i < count; i++) {
        data.push({
          rsid: `rs${200000 + i}`,
          gene: ['NOD2', 'IL23R', 'ATG16L1', 'IRGM', 'IL10'][Math.floor(Math.random() * 5)],
          chromosome: ['1', '2', '3', '4', '5', '6', '7', 'X', 'Y'][Math.floor(Math.random() * 9)],
          position: Math.floor(Math.random() * 100000000),
          risk_allele: ['A', 'C', 'G', 'T'][Math.floor(Math.random() * 4)],
          odds_ratio: (1 + Math.random() * 3).toFixed(2),
          p_value: (Math.random() * 0.001).toExponential(3)
        });
      }
    }
    
    return data;
  };

  const applyDatasetFilter = async () => {
    try {
      // Your API call or logic here
      await loadDataset();
      
      // Clear SNP input after completion
      setRsid("");
    } catch (error) {
      console.error("Error applying dataset filter:", error);
    }
  };
  
  const exportToCSV = () => {
    const csvRows = [];
    const headers = Object.keys(filteredResults[0]); // Get table headers
    csvRows.push(headers.join(",")); // Convert headers to CSV format

    // Convert data rows
    filteredResults.forEach((row) => {
      const values = Object.values(row).map((value) => `"${value}"`); // Ensure values are properly formatted
      csvRows.push(values.join(","));
    });

    // Create CSV Blob and download
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fetch columns when a source is selected
  const fetchColumns = async () => {
    if (dataset) {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/get-columns/${dataset}`);
        setColumns(data);
        console.log("response.data:", data)
        console.log("columns: ", columnValues)
        setFormData(Object.fromEntries(data.map((col) => [col, ""])));
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    }else{
      console.log("Dataset is not specified")
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clear form
  const handleClear = () => {
    setFormData(Object.fromEntries(columnValues.map((col) => [col, ""])));
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/append-row`, {
        source: dataset,
        rowData: formData,
      });
      alert(response.data.message);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // useEffect(() => {
  //   setExportDisabled(filteredResults.length === 0);
  // }, [filteredResults]);

  return (
    <div>
      <header className="main-dataset-header">
        BRCA SNP Database Advanced Search
        <div className="dataset-header">
            <h1>Dataset: {dataset === 'clinvar' ? 'ClinVar' : 'SNP'}</h1>
        </div>
      </header>
      
      <div className="main-container dataset-page">
        <div className="dataset-view">
          <div className="tools-section">
            {/* Dataset Search */}
            <div className="tool-card">
              <h2> Select a database </h2>
              <div className="tool-content">
                    <select
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                    className="dropdown"
                    >
                    <option value="clinvar">ClinVar</option>
                    <option value="snp">SNP</option>
                    </select>
                    <button onClick={applyDatasetFilter} className="btn btn-primary">Search {dataset === 'clinvar' ? "ClinVar" : "SNP"} Dataset</button>
                </div>
            </div>
            {/* SNP Search */}
            <div className="tool-card">
              <h2><Search size={18} /> Search by {dataset === 'clinvar' ? "Accession ID" : "SNP ID "}</h2>
              <div className="tool-content">
                <input
                  type="text"
                  placeholder={dataset === 'clinvar' ? "Enter Accession_ID" : "Enter SNP ID "}
                  value={rsid}
                  onChange={(e) => setRsid(e.target.value)}
                  className="form-control"
                />
                <button onClick={searchSNP} className="btn btn-primary">Search {dataset === 'clinvar' ? "ClinVar" : "SNP"}</button>
              </div>
            </div>

            {/* PRS Calculator
            <div className="tool-card">
              <h2><Calculator size={18} /> PRS Calculator</h2>
              <div className="tool-content">
                <p>Calculate polygenic risk score based on genetic variants.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(`/tools?dataset=${dataset}`)}
                >
                  Open Calculator
                </button>
              </div>
            </div>*/}
          </div>

          {/* Dataset Table Section */}
          <div className="table-section">
            <div className="table-header">
              <h2><Database size={18} /> Data Explorer</h2>
              <div className="table-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={exportToCSV} > Export to CSV </button>
              <button onClick={() => setIsPopupOpen(true)} disabled={!dataset}>
                Input Data
              </button>

              {isPopupOpen && (
                <Popup
                  title={dataset}
                  columns={columnValues}
                  formData={formData}
                  onClose={() => setIsPopupOpen(false)}
                  onChange={handleChange}
                  onClear={handleClear}
                  onSubmit={handleSubmit}
                />
              )}
            </div>

            {loading ? (
              <div className="loading-state">Loading data...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : filteredResults.length === 0 ? (
              <div className="empty-state">No results found. Try a different search term.</div>
            ) : (
              < PaginatedTable data={filteredResults} />
              // <div className="table-container">
              //   <table className="data-table">
              //     <thead>
              //       <tr>
              //         {Object.keys(filteredResults[0]).map((key) => (
              //           <th key={key}>{key.replace('_', ' ').toUpperCase()}</th>
              //         ))}
              //       </tr>
              //     </thead>
              //     <tbody>
              //       {filteredResults.map((row, index) => (
              //         <tr key={index}>
              //           {Object.keys(row).map((key, i) => (
              //             <td key={i}>
              //               {key === "CLINVAR LINK" && dataset === "clinvar" ? (
              //                 <a href={row[key]} target="_blank" rel="noopener noreferrer">
              //                   {row[key]}
              //                 </a>
              //               ) : (
              //                 row[key]
              //               )}
              //             </td>
              //           ))}
              //         </tr>
              //       ))}
              //     </tbody>
              //   </table>
              // </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        M. Keerthi | Email:  keerthi1052031@gmail.com
      </footer>
    </div>
    );
};