import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import "./styles/global.css"; // Import global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
