const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

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

        if (createBucketResponse?.data?.data?.ID) {
          bucketId = createBucketResponse.data.data.ID;
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

    // Generate the JSON file
    const filePath = path.join(__dirname, 'files', 'output.json');

    try {
      const jsonData = {
        did,
        diseases,
        timestamp: new Date().toISOString(),
      };

      // Ensure the directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write JSON data to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log('JSON file created successfully:', filePath);
    } catch (fileError) {
      console.error('Error creating JSON file:', fileError.message);
      return res.status(500).json({
        message: 'Error creating JSON file',
        error: fileError.message,
      });
    }

    // Upload the file
    async function uploadFile(did, filePath) {
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        throw new Error('File not found');
      }

      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      try {
        const response = await axios.post(`${API_BASE_URL}/buckets/${did}/files`, form, {
          headers: form.getHeaders(),
        });
        console.log('File uploaded successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to upload file:', error.response?.data || error.message);
        throw error;
      }
    }

    try {
      await uploadFile(did, filePath);
      return res.status(200).json({
        message: 'File uploaded successfully to the bucket.',
      });
    } catch (uploadError) {
      return res.status(500).json({
        message: 'File upload failed',
        error: uploadError.message,
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
