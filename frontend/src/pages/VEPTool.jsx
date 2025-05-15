// Frontend: React App
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VEPTool.css';
import JsonViewer from './JSONViewer.jsx';
import SNPInfo from '../components/SNPInfo.jsx';
import SnpSelector from '../components/SnpSelector';
import { Button_chart } from '../components/lib/button.jsx';
import DataVisualization from '../components/DataVisualization.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

function VEPTool() {
    const [variant, setVariant] = useState('');
    const [data, setData] = useState(null);
    const [t_consequences, setT_consequences] = useState(null);
    const [error, setError] = useState(null);
    const [formatdata, setFormatData] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [button1Clicked, setButton1Clicked] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({ gene: "", snpId: "", source: "" });

    const handleSelectionChange = (newSelection) => {
        setSelectedData(newSelection);
    };

    useEffect(() => {
        if (selectedData) {
        //   setGeneInput(selectedData.gene);
          setVariant(selectedData.snpId);
        }
    }, [selectedData]);


    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const isArrayOfObjects = (value) => {
        return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
    };

    const renderComplexTable = (arrayOfObjects) => {
        console.log("render")
        if(isArrayOfObjects(arrayOfObjects)){
            // Get all unique keys across all objects
            const allKeys = [...new Set(arrayOfObjects.flatMap(obj => Object.keys(obj)))];
            console.log("rendered t_consequences")
            return (
                <div className="complex-table-wrapper">
                <table className="complex-table">
                    <thead>
                    <tr>
                        {allKeys.map(key => (
                        <th key={key}>{key}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {arrayOfObjects.map((obj, index) => (
                        <tr key={index}>
                        {allKeys.map(key => (
                            <td key={`${index}-${key}`}>
                            {obj[key] !== undefined ? 
                                (typeof obj[key] === 'object' ? 
                                JSON.stringify(obj[key]) : 
                                String(obj[key])) 
                                : '-'}
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            );
        }   
    };

    const handleButton2Click = () => {
        // Close the card
        setIsCardOpen(false);
        
        // Call the original openModal function
        openModal();
    };

    const fetchVepData = async () => {
        try {
            setError(null);
            const response = await axios.get(`${BACKEND_URL}/vep/${variant}`);
            setData(response.data);
            transformData(response.data);
            console.log("dat")
        } catch (err) {
            setError('Failed to fetch variant data');
        }
    };

    const transformData = (data) => {
        try {
            const result = data.flatMap(({ transcript_consequences, colocated_variants, ...rest }) =>
                transcript_consequences.map(tc => ({ ...rest, ...tc }))
            );
            setT_consequences(result);
            console.log("result: ", result)
            console.log("consequences: ", t_consequences)
        } catch (error) {
            console.log("error in transformData")
            setError('Failed to fetch the transcript consequences');
        }
    };

    const formatVepData = () => {
        console.log("formatData is ")
        const result = [...new Set(data.flatMap(obj => (typeof obj === "object" && !Array.isArray(obj)) ? Object.keys(obj) : []))]
        const formatData = data[0]["colocated_variants"].map((item, index) => {
            if (Array.isArray(item)) {
              return { id: index, keys: getUniqueKeysFromArray(item) };
            } else if (typeof item === "object" && item !== null) {
              return { id: index, keys: Object.keys(item) };
            }
        });
        console.log(result)

    }

    return (
        <div className="container">
            <h1>Variant Effect Predictor</h1>
            <SnpSelector onSelectionChange={handleSelectionChange} />
            <input 
                type="text" 
                placeholder="Enter Variant (e.g., rs699)" 
                value={variant} 
                onChange={(e) => setVariant(e.target.value)} 
            />
            <button onClick={fetchVepData}>Search</button>
            {/* {error && <p className="error">{error}</p>} */}
            {data && (
                <table>
                    <thead>
                        <tr>
                            <th>Uploaded Variant</th>
                            <th>Location</th>
                            <th>Allele</th>
                            <th>Consequence</th>
                            <th>Gene</th>
                            <th>Feature Type</th>
                            <th>Biotype</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{variant}</td>
                                <td>{item.start}</td>
                                <td>{item.allele_string}</td>
                                <td>{item.most_severe_consequence}</td>
                                <td>{item.transcript_consequences?.[0]?.gene_id || 'N/A'}</td>
                                <td>{item.transcript_consequences?.[0]?.feature_type || 'N/A'}</td>
                                <td>{item.transcript_consequences?.[0]?.biotype || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {data ? (
                <div>
                    <button onClick={() => setIsCardOpen((prev) => !prev)}>View Transcript Consequences</button>
                    <button onClick={handleButton2Click}>View Consequence Distribution</button>
                    {showModal && <SNPInfo snpId={variant} onClose={closeModal} />}
                    {/* <div className="flex justify-center">
                        <Button_chart 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                        >
                            View Distribution Chart
                        </Button_chart>
                    </div>
                    {isModalOpen && (
                        <DataVisualization 
                        data={data} 
                        onClose={() => setIsModalOpen(false)}
                        />
                    )} */}
                </div>
            ) : (
                <p>Please Enter a Variant</p>
            )}
            {isCardOpen  && (
                <div style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
                    <h3>Card Title</h3>
                    {renderComplexTable(t_consequences)}
                </div>
            )}
        </div>
    );
}

export default VEPTool;