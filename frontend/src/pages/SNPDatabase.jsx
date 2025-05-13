import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom"; // ✅ Import Link for navigation

const SNPDatabase = () => {
    const navigate = useNavigate();
  return (
    <>
      <head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>BRCA SNP Database</title>
      </head>
      <header className="header">
          <h1>BRCA1 and BRCA2 SNP Database</h1>
          <h3>A comprehensive resource for clinically relevant SNPs</h3>
          <nav className="gen-nav">
              <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a onClick={() => navigate("/DatasetPage")}>Search</a></li>
                  <li><a onClick={() => navigate("/ToolsSuite")}>SNP Tool</a></li>
                  <li><a href="#contact">Contact</a></li>
              </ul>
          </nav>
      </header>
      {/* About Section */}
      <section id="about" className="section-about">
          <h2>About the Database</h2>
          <p>The BRCA SNP Database provides a detailed catalog of clinically relevant SNPs in BRCA1 and BRCA2 genes. Designed for healthcare professionals and researchers, it includes population frequencies, pathogenicity data, and clinical annotations to aid in genetic analysis.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="section-features">
          <h2>Key Features</h2>
          <div className="features-grid">
              <div className="feature-card">
                  <h3>Comprehensive Annotation Tools</h3>
                  <p>Access SNP details like rsID, pathogenicity, and associated phenotypes.</p>
              </div>
              <div className="feature-card cursor-pointer hover:shadow-lg transition duration-300">
                  <h3>Advanced Search</h3>
                  <p>Filter data by gene, population frequency, or clinical impact.</p>
              </div>
              <div className="feature-card">
                  <h3>Export Tools</h3>
                  <p>Download data in CSV format for custom analysis.</p>
              </div>
          </div>
      </section>
      <footer>
          <div id="contact">
              <h2>Contact Us</h2>
              <p>Name: M. Keerthi</p>
              <p>Email: <a href="mailto:keerthi1052031@gmail.com">keerthi1052031@gmail.com</a></p>
          </div>
      </footer>
    </>
  );
};

export default SNPDatabase;