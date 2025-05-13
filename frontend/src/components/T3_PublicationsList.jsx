import React from 'react';
import "../styles/T3_index.css";

const PublicationsList = ({ data }) => {
  if (!data?.primary_snapshot_data?.citations?.publications) {
    return null;
  }

  const publications = data.primary_snapshot_data.citations.publications;

  if (publications.length === 0) {
    return null;
  }

  return (
    <div className="publications-card">
      <div className="card-header">
        <h3 className="card-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-primary">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
          Literature References
        </h3>
      </div>
      <div className="card-content">
        <div className="publications-list">
          {publications.map((pub, index) => (
            <div key={index} className="publication-item">
              {index > 0 && <div className="separator"></div>}
              <div className="publication-content">
                <h3 className="publication-title">{pub.title || 'Untitled Publication'}</h3>
                <p className="publication-authors">
                  {pub.authors?.map((author) => `${author.name || ''}`).join(', ')}
                </p>
                <p className="publication-journal">
                  <span className="journal-name">{pub.journal || ''}</span>
                  {pub.year ? ` (${pub.year})` : ''}
                  {pub.volume ? `, ${pub.volume}` : ''}
                  {pub.issue ? `(${pub.issue})` : ''}
                  {pub.pages ? `:${pub.pages}` : ''}
                </p>
                {pub.pmid && (
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pubmed-link"
                  >
                    PubMed: {pub.pmid}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx="true">{`
        .publications-card {
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
        
        .publications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .publication-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .separator {
          height: 1px;
          background-color: var(--border);
          margin-bottom: 8px;
        }
        
        .publication-content {
          padding-top: 8px;
        }
        
        .publication-title {
          font-weight: 500;
          margin: 0 0 8px 0;
          font-size: 16px;
        }
        
        .publication-authors {
          font-size: 14px;
          color: var(--muted-foreground);
          margin: 0 0 4px 0;
        }
        
        .publication-journal {
          font-size: 14px;
          margin: 0 0 8px 0;
        }
        
        .journal-name {
          font-weight: 500;
        }
        
        .pubmed-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: var(--primary);
          text-decoration: none;
          margin-top: 8px;
        }
        
        .pubmed-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default PublicationsList;
