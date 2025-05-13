const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios")


const app = express();
const PORT = 5001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

// Middleware
app.use(express.json());
app.use(cors({ 
    origin: `${FRONTEND_URL}` ,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const USERS_FILE = 'users.json';

// Function to read users from the JSON file
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

// Function to write users to the JSON file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
  const { username, password, repassword } = req.body;

  // Ensure all required fields are provided
  if (!username || !password || !repassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== repassword) {
    return res.status(400).json({ error: "Both Passwords are Not Matching, Try Again" });
  }

  let users = readUsers();
  
  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
  }
  
  users.push({ username, password });
  writeUsers(users);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  
  const user = users.find(user => user.username === username && user.password === password);
  
  if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', login: false });
  }
  
  res.json({ message: 'Login successful', user, login: true });
});

// Function to load and parse CSV data
const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
  });
};

// Load preprocessed datasets
let clinvarData = [];
let snpData = [];

const loadData = async () => {
  clinvarData = await loadCSV(path.join(__dirname, "ClinVar_BRCAs_data_with_links.csv"));
  snpData = await loadCSV(path.join(__dirname, "SNP_BRCAs_data.csv"));
};

// Load data initially
loadData().then(() => console.log("Datasets loaded successfully"));

// API to fetch all SNPs from the selected dataset
app.get("/all-rsids", (req, res) => {
  const { dataset } = req.query;

  if (dataset === "clinvar") {
      return res.json(clinvarData);
  } else if (dataset === "snp") {
      return res.json(snpData);
  } else {
      return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'snp'" });
  }
});

// app.get('/all-rsids', async (req, res) => {
//   try {
//       res.json({ message: "API is working!" });
//   } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// API to search SNPs by rsID
app.get("/search", (req, res) => {
  const { dataset, rsid } = req.query;
  
  let data;
  let rSID_col1;
  let rSID_col2;
  if (dataset === "clinvar") {
      data = clinvarData;
      rSID_col1 = "Accession_ID";
      rSID_col2 = "SNP_ID";
  } else if (dataset === "snp") {
      data = snpData;
      rSID_col1 = "SNP_ID";
      rSID_col2 = null;
  } else {
      return res.status(400).json({ error: "Invalid dataset. Use 'clinvar' or 'ibd'" });
  }

  const result = data.filter(item => 
    item[rSID_col1]?.trim().toLowerCase() === rsid.toLowerCase() || 
    (rSID_col2 && item[rSID_col2]?.trim().toLowerCase() === rsid.toLowerCase())
  );
  return res.json(result); 
});

app.get("/fetch-snp", async (req, res) => {
  const { snp, source } = req.query;
  if (!snp || !source) {
    return res.status(400).json({ error: "SNP ID and source are required" });
  }
  // console.log(Array.isArray(clinvarData));  // Should be true
  // console.log(typeof clinvarData[0]);  // Should be 'object'
  // console.log(Object.keys(clinvarData[0])); // Should contain "Accession_ID"
  let data = {"data": null}
  if (source === "clinvar") {
    data.data = clinvarData.filter(item => item["Accession_ID"]?.trim().toLowerCase() === snp.toLowerCase())
  }
  else {
    data.data = snpData.filter(item => item["SNP_ID"]?.trim().toLowerCase() === snp.toLowerCase())
  }
  // let data = source === "clinvar" ? clinvarData[snp] : snpData[snp];
  if (!data) {
    return res.status(404).json({ error: "SNP not found in selected source" });
  }

  data.sources = {
    dbSNP: `https://www.ncbi.nlm.nih.gov/snp/${snp}`,
    clinvar: `https://www.ncbi.nlm.nih.gov/clinvar/?term=${snp}`
  };

  return res.json(data);
});

app.get("/get_snp_table", async (req, res) => {
  data = clinvarData;
  if (!data) {
    return res.status(404).json({ error: "SNP data is not found" });
  }
  return res.json(data);
});

// API Route to fetch variant effect data from Ensembl VEP API
app.get('/vep/:variant', async (req, res) => {
  const { variant } = req.params;
  try {
      const response = await axios.get(`https://rest.ensembl.org/vep/human/id/${variant}?content-type=application/json`); //80357969
      // console.log(`Fetched data for ${variant}:`, response.data);
      if (!response.data || response.data.length === 0) {
          console.warn(`No data found for variant: ${variant}`);
          return res.status(404).json({ error: `No data found for variant: ${variant}` });
      }
      res.json(response.data);
  } catch (error) {
      console.error(`Error fetching data for ${variant}:`, error.response?.data || error.message);
      console.log(`Error fetching data for ${variant}:`, error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch data from Ensembl' });
  }
});

// Helper function to make Ensembl API requests
async function fetchFromEnsembl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching from Ensembl API: ${error.message}`);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch data from Ensembl');
    }
    throw new Error('Failed to connect to Ensembl API');
  }
}

// Endpoint to find sequence by SNP ID
app.get('/api/find-sequence/:snpId', async (req, res) => {
  const { snpId } = req.params;
  
  try {
    // Step 1: Get SNP data
    const snpUrl = `https://rest.ensembl.org/variation/homo_sapiens/${snpId}?content-type=application/json`;
    const snpData = await fetchFromEnsembl(snpUrl);
    
    // Step 2: Extract location from mappings
    if (!snpData.mappings || snpData.mappings.length === 0) {
      return res.status(404).json({ 
        message: 'No mapping location found for this SNP ID' 
      });
    }
    
    // Use the first mapping location
    const location = snpData.mappings[0].location;
    
    // Step 3: Get sequence data using the location
    const sequenceUrl = `https://rest.ensembl.org/sequence/region/human/${location}?content-type=application/json`;
    const sequenceData = await fetchFromEnsembl(sequenceUrl);
    
    // Format the response
    const result = {
      id: snpId,
      seq: sequenceData.seq,
      mappings: snpData.mappings,
      fullData: snpData,
      sequenceData: sequenceData
    };
    
    res.json(result);
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    res.status(500).json({ 
      message: error.message || 'An error occurred while processing your request' 
    });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// NCBI API Proxy endpoint
app.get('/api/snp/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate SNP ID
    if (!id || !id.trim()) {
      return res.status(400).json({ error: 'SNP ID is required' });
    }

    // Remove any 'rs' prefix or non-numeric characters if present
    const cleanedSnpId = id.replace(/\D/g, '');
    
    if (!cleanedSnpId) {
      return res.status(400).json({ error: 'Invalid SNP ID format' });
    }

    // Make request to NCBI API
    const response = await axios.get(`https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/${cleanedSnpId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    // Return the data
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching SNP data:', error);
    
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: `SNP rs${req.params.id} not found in the database` });
      } else if (error.response?.status === 429) {
        return res.status(429).json({ error: 'Too many requests. Please try again later' });
      } else if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ error: 'Request timed out. Please try again' });
      }
    }
    
    return res.status(500).json({ error: 'An error occurred while fetching SNP data' });
  }
});

// API for fetchsnpid function
app.get('/refsnp/:cleanedSnpId', async (req, res) => {
  const { cleanedSnpId } = req.params;

  const response = await axios.get(`https://api.ncbi.nlm.nih.gov/variation/v0/refsnp/${cleanedSnpId}?content-type=application/json`); //80357969
  // console.log(`Fetched data for ${variant}:`, response.data);
  // if (!response.data || response.data.length === 0) {
  //     console.warn(`No data found for variant: ${variant}`);
  //     return res.status(404).json({ error: `No data found for variant: ${variant}` });
  // }
  res.json(response.data);
});

// API to get column names
app.get("/get-columns/:source", async (req, res) => {
  const { source } = req.params;
  let columns = [];
  try{
    if (source === "snp" && snpData.length > 0) {
      columns = Object.keys(snpData[0]); // Get column names from first row
    } else if (source === "clinvar" && clinvarData.length > 0) {
      columns = Object.keys(clinvarData[0]);
    }
    res.json(columns);
  }catch(err){
    res.status(301).json({error: "the error is in the backend function"});
  }

});

// API to append a row
app.post("/append-row", (req, res) => {
  const { source, rowData } = req.body;

  const filePath = source === "snp" ? "SNP_BRCAs_data.csv" : "ClinVar_BRCAs_data_with_links.csv";
  const values = Object.values(rowData).join(",");

  fs.appendFile(filePath, `\n${values}`, (err) => {
    if (err) {
      console.error("Error appending data:", err);
      return res.status(500).json({ message: "Failed to append row." });
    }
    res.json({ message: "Row added successfully!" });
  });
});

app.get('/fasta/snp/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const snpResponse = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=snp&id=${id}&rettype=fasta`);
      console.log("snp_response_done")
      // const snpData = snpResponse.data;
      // console.log("snpData done", snpData)
      // const match = snpData.match(/NC_\d+\.\d+/);
      // console.log("match done", match)
      // if (!match) return res.status(400).json({ error: 'Reference sequence not found' });
      
      // const refSeq = match[0];
      // const positionMatch = snpData.match(/g\.(\d+)/);
      // console.log("positionMatch done", positionMatch)
      // if (!positionMatch) return res.status(400).json({ error: 'Position not found' });
      
      // const position = parseInt(positionMatch[1]);
      // const seqStart = position - 10;
      // const seqStop = position + 10;
      // console.log("fast response is called")
      // const fastaResponse = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${refSeq}&seq_start=${seqStart}&seq_stop=${seqStop}&rettype=fasta&strand=1`);
      // res.json({ fasta: fastaResponse.data, details: snpData });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching SNP data' });
  }
});

app.get("/genes", async (req, res) => {
  const { source } = req.query;
  if (!source) return res.status(400).json({ error: "Source is required" });

  // const filePath = source === "dbSNP" ? "snp.csv" : "clinvar.csv";
  try {
    const data = source === "snp" ? snpData : clinvarData;
    const uniqueGenes = [...new Set(data.map((row) => row.Gene))];
    res.json(uniqueGenes);
  } catch (error) {
    res.status(500).json({ error: "Error loading gene data" });
  }
});

app.get("/snps", async (req, res) => {
  const { source, gene } = req.query;
  if (!source || !gene) return res.status(400).json({ error: "Source and gene are required" });

  // const filePath = source === "dbSNP" ? "snp.csv" : "clinvar.csv";
  try {
    const data = source === "snp" ? snpData : clinvarData;
    const snpIds = data
    .filter((row) => row.Gene === gene)
    .map((row) => source === "clinvar" ? row.Accession_ID : row.SNP_ID);
    res.json([...new Set(snpIds)]);
  } catch (error) {
    res.status(500).json({ error: "Error loading SNP data" });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
