import React from 'react';
import "../styles/T3_index.css";

const GeneSummary = ({ data }) => {
  if (!data?.primary_snapshot_data?.allele_annotations) {
    return null;
  }

  // Extract gene data
  const geneData = [];
  
  try {
    data.primary_snapshot_data.allele_annotations.forEach((annotation) => {
      annotation.assembly_annotation?.forEach((assembly) => {
        assembly.genes?.forEach((gene) => {
          const geneInfo = {
            name: gene.name || 'Unknown',
            id: gene.id || '',
            locus: gene.locus || '',
            rnas: gene.rnas?.map(rna => ({
              id: rna.id || '',
              product: rna.product?.name || 'Unknown product',
              nucleotide_change: rna.sequence_ontology?.map(so => so.name).join(', ') || 'Unknown'
            })) || []
          };
          
          geneData.push(geneInfo);
        });
      });
    });
  } catch (e) {
    console.error('Error parsing gene data:', e);
  }

  if (geneData.length === 0) {
    return null;
  }

  return (
    <div className="gene-card">
      <div className="card-header">
        <h3 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-primary">
            <path d="M9 21c-2.287-.673-4-2.986-4-5.5m4 5.5c.677.2 1.326.2 2 0m-2 0v-3c0-.328-.083-.646-.236-.932m-3.764-1.068c-.862-.762-1.5-1.887-1.5-3.5 0-1.328.783-2.5 1.5-3.5m14.236 4.568c.153.286.236.604.236.932v3m0 0c-.677.2-1.326.2-2 0m2 0c2.287-.673 4-2.986 4-5.5m-4-5.5v3"></path>
            <path d="M7 15h2m8 0h-2"></path>
          </svg>
          Gene Information
        </h3>
      </div>
      <div className="card-content">
        {geneData.map((gene, index) => (
          <div key={index} className="gene-info">
            <h4 className="gene-name">{gene.name}</h4>
            {gene.id && (
              <p className="gene-id">Gene ID: {gene.id}</p>
            )}
            {gene.locus && (
              <p className="gene-locus">Locus: {gene.locus}</p>
            )}
            
            {gene.rnas.length > 0 && (
              <div className="rnas-container">
                <h5 className="rnas-title">Transcripts:</h5>
                {gene.rnas.map((rna, rnaIndex) => (
                  <div key={rnaIndex} className="rna-item">
                    <div className="rna-header">
                      <span className="rna-id">{rna.id}</span>
                      <span className="rna-product">{rna.product}</span>
                    </div>
                    <p className="rna-change">
                      Effect: <span className="change-value">{rna.nucleotide_change}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style jsx="true">{`
        .gene-card {
          background-color: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 24px;
          animation: slideUp 0.4s ease-out;
        }
        
        .card-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .card-title {
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        
        .icon-primary {
          color: var(--primary);
        }
        
        .card-content {
          padding: 16px 24px;
        }
        
        .gene-info {
          margin-bottom: 20px;
        }
        
        .gene-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        
        .gene-id, .gene-locus {
          margin: 4px 0;
          color: var(--muted-foreground);
        }
        
        .rnas-container {
          margin-top: 12px;
        }
        
        .rnas-title {
          font-size: 16px;
          font-weight: 500;
          margin: 12px 0 8px 0;
        }
        
        .rna-item {
          background-color: var(--muted);
          border-radius: var(--radius);
          padding: 12px;
          margin-bottom: 8px;
        }
        
        .rna-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .rna-id {
          font-family: monospace;
          font-size: 14px;
        }
        
        .rna-product {
          font-style: italic;
        }
        
        .rna-change {
          margin: 4px 0 0 0;
          font-size: 14px;
        }
        
        .change-value {
          font-weight: 500;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default GeneSummary;
