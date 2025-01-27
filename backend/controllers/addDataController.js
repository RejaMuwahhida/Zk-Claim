const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000'; // Base URL for Akave API

exports.addUserData = async (req, res) => {
  try {
    const { did, diseases } = req.body;


    if (!did || !Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'did' and a non-empty array of 'diseases' are required.",
      });
    }

    let bucketId;
    let bucketMessage;

    try {
      // Fetch existing buckets
      const bucketsResponse = await axios.get(`${API_BASE_URL}/buckets`);
      const buckets = bucketsResponse.data?.data || [];
      const existingBucket = buckets.find(bucket => bucket.Name === did);

      // If bucket already exists, respond with its details
      if (existingBucket) {
        bucketId = existingBucket.ID;
        bucketMessage = `Bucket already exists for the provided DID (${did}). Bucket ID: ${bucketId}`;
        console.log(bucketMessage);
        return res.status(200).json({
          success: true,
          message: bucketMessage,
          bucketId,
        });
      }

      console.log('No existing bucket found. Creating a new one...');
      const createBucketResponse = await axios.post(
        `${API_BASE_URL}/buckets`,
        { bucketName: did },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (createBucketResponse.data?.success === true && createBucketResponse.data?.data?.ID) {
        bucketId = createBucketResponse.data.data.ID;
        bucketMessage = `A new bucket was successfully created for DID (${did}). Bucket ID: ${bucketId}`;
        console.log(bucketMessage);

        return res.status(201).json({
          success: true,
          message: bucketMessage,
          bucketId,
        });
      } else {
        console.error("Unexpected response during bucket creation:", createBucketResponse?.data);
        return res.status(500).json({
          success: false,
          message: 'Bucket creation failed. Please try again later.',
          error: createBucketResponse?.data,
        });
      }
    } catch (error) {
      console.error('Error checking or creating bucket:', error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve or create the bucket. Please contact support if the issue persists.',
        error: error.response?.data || error.message,
      });
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please contact support if the issue persists.',
      error: error.message,
    });
  }
};
