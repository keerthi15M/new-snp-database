import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Home from './pages/Home';
import SNPDatabase from './pages/SNPDatabase';
import Layout from './components/Layout'
import GoogleAuth from "./components/GoogleAuth";
import DatasetPage from './pages/DatasetPage';
import SNPAnnotationTool from './pages/SNPAnnotationPage';
import ToolsSuite from './pages/ToolsSuite';
import VEPTool from './pages/VEPTool';
import SequenceFinder from './pages/SequenceFinder';
import NCBITool from './pages/T3_NCBITool';


function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Home/Login Page */}
        <Route path="/" element={<SNPDatabase/>} />
        {/* <Route path="/auth" element={<GoogleAuth />} /> */}
        {/* ✅ Layout Wrapper for Protected Routes */}
        <Route element={<Layout />}>
          {/* <Route path="/SNPDatabase" element={<Home/>} /> */}
          <Route path="/DatasetPage" element={<DatasetPage/>} /> 
          <Route path="/SNPAnnotationTool" element={<SNPAnnotationTool/>} /> 
          <Route path="/ToolsSuite" element={<ToolsSuite/>} /> 
          <Route path="/VEPTool" element={<VEPTool/>} /> 
          <Route path="/SequenceFinder" element={<SequenceFinder/>} />
          <Route path="/NCBITool" element={<NCBITool/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
