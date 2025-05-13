import { useState } from "react";
import "../styles/JSONViewer.css"
import "react-resizable/css/styles.css";

// const sampleData = {
//   name: "John Doe",
//   age: 30,
//   address: {
//     city: "New York",
//     country: "USA"
//   },
//   contacts: [
//     { type: "Email", value: "john@example.com" },
//     { type: "Phone", value: "123-456-7890" }
//   ]
// };

const DataCard = ({ data }) => {
    console.log("data")
  const [openDetails, setOpenDetails] = useState({});

  const toggleDetails = (key) => {
    setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  if (!data) return <p>No data available</p>;
  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-2xl">
      <h2 className="text-lg font-bold mb-2">Data Summary</h2>
      <ul className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="border-b pb-2">
            <strong className="key">{key}:</strong> 
            <span className="value">
            {(Array.isArray(value) || typeof value === 'object') ? (
              <button
                onClick={() => toggleDetails(key)}
                className="text-blue-500 underline ml-2"
              >
                Click here
              </button>
            ) : (
              value
            )}
            </span>
            {openDetails[key] && (
              <div className="overflow-auto p-4">
                {Array.isArray(value) ? <Table data={value} /> : <ObjectTable data={value} />}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Table = ({ data }) => {
  if (!data.length) return <p>No data available</p>;
  const headers = [...new Set(data.flatMap(Object.keys))];

  return (
    <table className="table-auto border-collapse border w-full">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header) => (
            <th key={header} className="border border-gray-400 px-2 py-1">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header} className="border border-gray-400 px-2 py-1">
                {item[header] || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ObjectTable = ({ data }) => {
  const headers = Object.keys(data);

  return (
    <table className="w-full border-collapse border border-gray-400 mt-2">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((header) => (
            <th key={header} className="border border-gray-400 px-2 py-1">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {headers.map((header) => (
            <td key={header} className="border border-gray-400 px-2 py-1">
              {data[header]}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

const JsonViewer = ({inputData}) => {
  console.log("inputdata:", inputData)
  return (
    <div className="flex justify-center p-4">
      <DataCard data={inputData} />
    </div>
  );
};

export default JsonViewer;