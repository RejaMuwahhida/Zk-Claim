const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000'; // Base URL for Akave API

exports.addUserData = async (req, res) => {
  try {
    const { did, diseases } = req.body;

    // Validate input
    if (!did || !Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({
        message: "Both 'did' and a non-empty 'diseases' array are required.",
      });
    }

    console.log("Received DID:", did);
    console.log("Received diseases array:", diseases);

    let bucketId;

    try {
      // Fetch the existing buckets
      const bucketsResponse = await axios.get(`${API_BASE_URL}/buckets`);
      const buckets = bucketsResponse.data?.data || [];
      const existingBucket = buckets.find(bucket => bucket.Name === did);

      if (existingBucket) {
        bucketId = existingBucket.ID;
        console.log(`Bucket already exists with ID: ${bucketId}`);
      } else {
        console.log('No existing bucket found, creating a new one...');

        const createBucketResponse = await axios.post(
          `${API_BASE_URL}/buckets`,
          { bucketName: did },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log("Response from createBucketResponse:", createBucketResponse?.data);

        if (createBucketResponse?.data?.ID) {
          bucketId = createBucketResponse.data.ID;
          console.log(`Bucket created with ID: ${bucketId}`);
        } else {
          console.error("Failed to extract ID from bucket creation response");
          return res.status(500).json({
            message: 'Failed to create a new bucket',
            error: createBucketResponse?.data,
          });
        }
      }
    } catch (error) {
      console.error('Error checking or creating bucket:', error.response?.data || error.message);
      return res.status(500).json({
        message: 'Error checking or creating bucket',
        error: error.response?.data || error.message,
      });
    }

    console.log("BucketId before adding data to the bucket:", bucketId);

    try {
      const addDataResponse = await axios.post(
        `${API_BASE_URL}/buckets/${bucketId}/data`, // Endpoint to add data to a bucket
        { data: { diseases } }, // Payload with diseases data
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Add Data Response:", addDataResponse?.data);

      return res.status(201).json({
        message: 'User data added successfully to the bucket!',
        akaveData: addDataResponse.data,
      });
    } catch (error) {
      console.error('Error adding data to the bucket:', error.response?.data || error.message);
      return res.status(500).json({
        message: 'Error adding data to the bucket',
        error: error.response?.data || error.message,
      });
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
