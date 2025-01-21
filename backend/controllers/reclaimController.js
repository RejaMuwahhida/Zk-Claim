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

    // Retrieve data from Akave bucket
    let diseases;
    try {
      const bucketDataResponse = await axios.get(`${AKAVE_API_BASE_URL}/buckets/${did}`);

      if (bucketDataResponse.status === 200 && bucketDataResponse.data) {
        diseases = bucketDataResponse.data?.data?.diseases || [];
        console.log('Akave API response:', JSON.stringify(bucketDataResponse.data, null, 2));
      } else {
        return res.status(404).json({ success: false, message: 'No data found for the provided DID in Akave' });
      }
    } catch (error) {
      console.error('Error retrieving data from Akave:', error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving data from Akave',
        error: error.response?.data || error.message,
      });
    }

    // Check for the claimed disease in retrieved data
    const diseaseToClaim = diseases.find(disease => disease.disease_name === claimDisease);

    let conditionCode;

    if (!diseaseToClaim) {
      conditionCode = 0;
    } else {
      conditionCode = 1;
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
