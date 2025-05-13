import React from "react";
import "../styles/PopUp.css";

const Popup = ({ title, columns, formData, onClose, onChange, onClear, onSubmit }) => {
  console.log("Columns prop:", columns);
  return (
    <div className="popup-popup">
      <div className="popup-content">
        {/* Close Button */}
        <span className="close-btn" onClick={onClose}>&times;</span>

        <h3>Enter Data for {title}</h3>

        {/* Input Fields */}
        {columns.length > 0 ? (
          columns.map((col) => (
            <div key={col} className="input-group">
              <label>{col}:</label>
              <input type="text" name={col} value={formData[col] || ""} onChange={onChange} />
            </div>
          ))
        ) : (
          <p>Loading columns...</p>
        )}

        {/* Buttons */}
        <div className="popup-buttons">
          <button className="clear-btn" onClick={onClear}>Clear</button>
          <button className="submit-btn" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
