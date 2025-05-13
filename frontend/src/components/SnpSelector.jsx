import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SnpSelector.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

const SnpSelector = ({ onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("");
  const [geneList, setGeneList] = useState([]);
  const [snpList, setSnpList] = useState([]);
  const [selectedGene, setSelectedGene] = useState("");
  const [selectedSnp, setSelectedSnp] = useState("");

  useEffect(() => {
      fetchGenes(source);
      fetchSnps(selectedGene);
    }, [source, selectedGene]);
    

  const fetchGenes = async () => {
    if (source) {
      try {
        const res = await axios.get(`${BACKEND_URL}/genes?source=${source}`);
        setGeneList(res.data);
      } catch (err) {
        console.error("Error fetching genes:", err);
      }
    }
  };

  const fetchSnps = async () => {
    if (source && selectedGene) {
      try {
        const res = await axios.get(`${BACKEND_URL}/snps?source=${source}&gene=${selectedGene}`);
        setSnpList(res.data);
      } catch (err) {
        console.error("Error fetching SNPs:", err);
      }
    }
  };

  // useEffect(() => {
  //   if (source) {
  //     axios
  //       .get(`${BACKEND_URL}/genes?source=${source}`)
  //       .then((res) => setGeneList(res.data))
  //       .catch((err) => console.error("Error fetching genes:", err));
  //   }
  // }, [source]);

  // useEffect(() => {
  //   if (source && selectedGene) {
  //     axios
  //       .get(`${BACKEND_URL}/snps?source=${source}&gene=${selectedGene}`)
  //       .then((res) => setSnpList(res.data))
  //       .catch((err) => console.error("Error fetching SNPs:", err));
  //   }
  // }, [selectedGene]);

  const handleSelection = () => {
    setIsOpen(false);
    onSelectionChange({ gene: selectedGene, snpId: selectedSnp, source: source });
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="select-button">
        Search SNPIDs
      </button>

      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={() => setIsOpen(false)}>✖</button>
            <h3>Select SNP Information</h3>

            <label>Source:</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Select Source</option>
              <option value="snp">dbSNP</option>
              <option value="clinvar">ClinVar</option>
            </select>

            <label>Gene:</label>
            <select value={selectedGene} onChange={(e) => setSelectedGene(e.target.value)} disabled={!source}>
              <option value="">Select Gene</option>
              {geneList.map((gene) => (
                <option key={gene} value={gene}>
                  {gene}
                </option>
              ))}
            </select>

            <label>{source === "snp" ? "SNP ID:" : "Accession ID:"}</label>
            <select value={selectedSnp} onChange={(e) => setSelectedSnp(e.target.value)} disabled={!selectedGene}>
              <option value="">Select SNP ID</option>
              {snpList.map((snp) => (
                <option key={snp} value={snp}>
                  {snp}
                </option>
              ))}
            </select>

            <div className="popup-buttons">
              <button onClick={handleSelection} disabled={!selectedGene || !selectedSnp}>
                Confirm
              </button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnpSelector;
