import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GoogleAuth from "../components/GoogleAuth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async(event) => {
        console.log("Login button clicked");
        event.preventDefault(); 
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
            setMessage(response.data.message);
            console.log("Navigating to:", '/SNPDatabase');
            navigate('/SNPDatabase');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            alert("Invalid Credentials!");
        }
        // In a real app, you would validate credentials here
        
    };

    const registerUser = async(event) => {
        event.preventDefault();
        try {
            await axios.post(`${BACKEND_URL}/register`, { username, password, repassword });
            alert("Data saved successfully!");
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error saving data:", error);
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>BRCA SNP Database - Login Page</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
        </head>
        <header className="fixed top-2 left-1/2 transform -translate-x-1/2 text-white shadow-lg p-4 rounded-md z-50 bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <h1 className="text-5xl font-bold">BRCA SNP Database</h1>
            <p className="text-lg">All in one database of BRCA Genes and their SNPs</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col justify-between">
                <h2 className="text-2xl font-semibold mb-4">About BRCA SNP Database</h2>
                <p className="text-gray-700 mb-4">The BRCA SNP Database provides a detailed catalog of clinically relevant SNPs in BRCA1 and BRCA2 genes. Designed for healthcare professionals and researchers, it includes population frequencies, pathogenicity data, and clinical annotations to aid in genetic analysis.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">Login to Continue</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        value={username}
                        placeholder="username or email" 
                        className="w-full p-2 border rounded" 
                        onChange={(e) => setUsername(e.target.value)}  
                    required/>
                    <input
                        type="password" 
                        value={password}
                        placeholder="Password" 
                        className="w-full p-2 border rounded" 
                        onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <button  
                        type="submit"
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
                    >
                        Login
                    </button>
                    <p>{message}</p>
                </form>
                <p className="text-sm text-gray-500 mt-4 text-center">
                    New to BRCA SNP Database? 
                    <button 
                    className="text-purple-600 hover:underline"
                    onClick={() => setIsOpen(true)}
                    >
                        Create an account
                    </button>
                    {isOpen && (
                        <div id="registerModal" className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                                <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
                                <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
                                <form className="space-y-4" onSubmit={registerUser}>
                                    <input 
                                      type="text" 
                                      placeholder="User Name or Email" 
                                      value={username}
                                      className="w-full p-2 border rounded" 
                                      onChange={(e) => setUsername(e.target.value)}
                                      />
                                    {/* <input id="registerEmail" type="email" placeholder="Email" className="w-full p-2 border rounded" /> */}
                                    <input 
                                      type="password" 
                                      placeholder="Password" 
                                      value={password}
                                      className="w-full p-2 border rounded"
                                      onChange={(e) => setPassword(e.target.value)} 
                                      />
                                    <input 
                                      type="repassword" 
                                      placeholder="Confirm Password" 
                                      value={repassword}
                                      className="w-full p-2 border rounded" 
                                      onChange={(e) => setRepassword(e.target.value)} 
                                      />
                                    <p id="registrationError" className="text-red-500"></p>
                                    <button 
                                        
                                      type="submit"
                                      className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
                                      >Register
                                    </button>
                                    <p>{message}</p>
                                </form>
                                <button onClick={() => setIsOpen(false)} className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">Cancel</button>
                            </div>
                        </div>
                    )}
                </p>
                <div className="text-white px-4 py-2 rounded-md">
                    <GoogleAuth />
                </div>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col justify-between">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-5">
                    <li>Comprehensive Annotations</li>
                    <li>Advanced Search</li>
                    <li>Export Tools</li>
                </ul>
            </div>
        </div>
        <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white p-6 shadow-lg rounded-2xl flex items-center justify-center gap-6 w-full">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-gray-700">For inquiries, please reach out to:</p>
                <p className="text-gray-700">M. Keerthi</p>
                <p className="text-gray-700"><a href="mailto:keerthi1052031@gmail.com">📧 Email: keerthi1052031@gmail.com </a></p>
            </div>
        </footer>
        
    </div>
  );
};

export default Home;