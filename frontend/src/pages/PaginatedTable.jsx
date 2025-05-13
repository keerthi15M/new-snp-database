import React, { useState } from "react";
import "../styles/TableStyles.css"

const PaginatedTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Show 50 rows per page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get data for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

   // Handle row click to open ClinVar_Link
   const handleRowClick = (row) => {
    if (row.ClinVar_Link) {
      window.open(row.ClinVar_Link, "_blank");
    } else if (row.dbSNP_link) {
      window.open(row.dbSNP_link, "_blank");
    }
  };

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            {Object.keys(data[0] || {}).map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, rowIndex) => {
            const columns = Object.keys(row);
            const hasAccessionId = columns.includes("Accession_ID");
            const linkColumn = hasAccessionId ? "Accession_ID" : "SNP_ID";

            return (
              <tr key={rowIndex} className="clickable-row">
                {columns.map((colName, colIndex) => (
                  <td key={colIndex}>
                    {colName === "SNP_ID" || colName === "Accession_ID" ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents row click event
                          handleRowClick(row);
                        }}
                        className="clickable-column"
                      >
                        {row[colName]}
                      </a>
                    ) : (
                      row[colName]
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
