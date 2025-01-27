const axios = require('axios');
const { generateProof } = require('../services/zkProofService');

const AKAVE_API_BASE_URL = 'http://localhost:8000';

exports.receiveEHR = async (req, res) => {
  try {
    const { did } = req.params;
    const { claimDisease } = req.body;

    console.log(did, claimDisease);

    if (!did || !claimDisease) {
      return res.status(400).json({ success: false, message: "'did' and 'claimDisease' are required." });
    }

    // Function to download and process the file content
    const downloadAndProcess = async (bucketName, fileName) => {
      try {
        const response = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${bucketName}/files/${fileName}/download`, {
          responseType: 'arraybuffer', // Using arraybuffer for binary data
        });
        console.log(`File downloaded: ${fileName}`);

        // Process file content in memory
        const fileContent = Buffer.from(response.data, 'binary').toString('utf8'); // Convert buffer to a string
        const jsonData = JSON.parse(fileContent); // Parse the JSON content

        return jsonData; // Return the parsed JSON data
      } catch (error) {
        console.error('Error downloading the file:', error.response?.data || error.message);
        throw error;
      }
    };

    // Retrieve data from Akave bucket and process it
    let diseases;
    try {
      const bucketDataResponse = await downloadAndProcess(did, 'output.json'); // Replace 'your-file-name' with actual file name
      diseases = bucketDataResponse.diseases || []; // Get diseases from the JSON response
      console.log('Diseases:', diseases);
    } catch (error) {
      console.error('Error retrieving data from Akave:', error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving data from Akave',
        error: error.response?.data || error.message,
      });
    }

    // Check for the claimed disease in the retrieved data
    const diseaseToClaim = diseases.find(disease => disease.disease_name && disease.disease_name.toLowerCase() === claimDisease.toLowerCase());

    let conditionCode = 0; // Default conditionCode is 0

    if (diseaseToClaim) {
      conditionCode = 1; // Set to 1 if disease found
    }

    const inputData = {
      did,
      conditionCode,
    };

    console.log('Input data for proof generation:', inputData);

    // Generate the proof
    const proof = await generateProof(inputData);

    // Respond with the proof
    res.setHeader('Accept', '*/*');
    return res.status(200).json({ success: true, proof });
  } catch (error) {
    console.error('Error processing EHR or generating proof:', error);
    res.status(500).json({ success: false, message: 'Error processing data', error: error.message });
  }
};
