import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Dna, FileSearch, Calculator } from 'lucide-react';
import '../styles/toolssuite.css';

const ToolsSuite = () => {
  return (
    <div className="min-height-screen">
      <div className="text-center">
        <div className="tag">
          BIOINFORMATICS SUITE
        </div>
        
        <h1 className="main-heading">
          SNP Tools
        </h1>
        
        <p className="main-description">
          A comprehensive suite of professional tools for analyzing Single Nucleotide Polymorphisms 
          in genomic data. Simple, powerful, and precise.
        </p>
      </div>
      
      <div className="tools-grid">
        <Link to="/SNPAnnotationTool" className="tool-button blue">
          <Dna className="tool-icon" strokeWidth={1.5} />
          <h3 className="tool-title">SNP Annotation</h3>
          <div className="tool-description">
          Detailed insights into single nucleotide polymorphisms (SNPs)
          </div>
        </Link>
        
        <Link to="/VEPTool" className="tool-button green">
          <Calculator className="tool-icon" strokeWidth={1.5} />
          <h3 className="tool-title">VEP</h3>
          <div className="tool-description">
          Predicts variant impact on genes and regulation.
          </div>
        </Link>
        
        {/* <Link to="/NCBITool" className="tool-button orange"> */}
          {/* <BarChart3 className="tool-icon" strokeWidth={1.5} /> */}
          {/* <h3 className="tool-title">SNP Visualization</h3> */}
          {/* <div className="tool-description"> */}
            {/* Interactive graphical representation of SNP distribution and patterns */}
          {/* </div> */}
        {/* </Link> */}
        
        <Link to="/SequenceFinder" className="tool-button purple">
          <FileSearch className="tool-icon" strokeWidth={1.5} />
          <h3 className="tool-title">SNP Mapping</h3>
          <div className="tool-description">
          Identifies and annotates SNPs.
          </div>
        </Link>
      </div>
      
      <div className="footer">
        <p>© 2025 SNP Tools. Professional genomic analysis suite.</p>
      </div>
    </div>
  );
};

export default ToolsSuite;
