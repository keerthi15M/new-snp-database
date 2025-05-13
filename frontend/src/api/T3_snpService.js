import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;; 

// const BASE_URL = `https://api.ncbi.nlm.nih.gov/variation/v0`;

/**
 * Fetches SNP data by ID from NCBI Variation API
 * @param {string} snpId - The SNP ID number (without 'rs' prefix)
 * @returns {Promise<any>} - The SNP data
 */
export const fetchSnpById = async (snpId) => {
  try {
    // Validate SNP ID
    if (!snpId || !snpId.trim()) {
      throw new Error('SNP ID is required');
    }

    // Remove any 'rs' prefix or non-numeric characters if present
    const cleanedSnpId = snpId.replace(/\D/g, '');
    
    if (!cleanedSnpId) {
      throw new Error('Invalid SNP ID format');
    }

    // Create request with proper headers to help with CORS issues
    // const response = await axios.get(`${BACKEND_URL}/refsnp/${cleanedSnpId}`, {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   // timeout: 15000 // 15 second timeout
    // });

    const response = await axios.get(`${BACKEND_URL}/refsnp/${cleanedSnpId}`)
    
    if (!response.data) {
      throw new Error(`No data found for SNP rs${cleanedSnpId}`);
    }
    
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`SNP rs${snpId} not found in the database`);
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again');
      } else if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Network error. This may be due to CORS restrictions. Consider using a proxy server.');
      }
      throw new Error(`API Error: ${error.message}`);
    }
    
    // Re-throw other errors
    throw error;
  }
};
