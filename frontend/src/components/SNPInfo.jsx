// src/components/SNPInfo.js
import React, { useState, useEffect } from 'react';
import PieChart from './PieChart';
import '../styles/SNPInfo.css';

const SNPInfo = ({ snpId, onClose }) => {
  const [snpData, setSnpData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://rest.ensembl.org/vep/human/id/${snpId}?content-type=application/json`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSnpData(data[0]);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [snpId]);

  if (error) {
    return <div className="modal">Error: {error.message}</div>;
  }

  if (!snpData) {
    return <div className="modal">Loading...</div>;
  }

  // Extract necessary data for summary statistics
  const { id, most_severe_consequence, transcript_consequences } = snpData;

  // Prepare data for pie charts
  const consequenceCounts = transcript_consequences.reduce((acc, tc) => {
    const consequence = tc.consequence_terms[0];
    acc[consequence] = (acc[consequence] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(consequenceCounts),
    values: Object.values(consequenceCounts),
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>SNP: {id}</h2>
        <p>Most Severe Consequence: {most_severe_consequence}</p>
        <div className="charts">
          <PieChart data={pieChartData} title="Consequence Distribution" />
        </div>
      </div>
    </div>
  );
};

export default SNPInfo;
