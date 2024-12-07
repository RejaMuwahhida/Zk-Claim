const User = require('../models/User');
const { generateProof } = require('../services/zkProofService');

exports.receiveEHR = async (req, res) => {
  try {
    const { did } = req.params;
    const { claimDisease } = req.body;

    console.log(did,claimDisease);

    if (!did || !claimDisease) {
      return res.status(400).json({ success: false, message: "'did' and 'claimDisease' are required." });
    }
    const user = await User.findOne({ did });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const diseases = user.diseases;

    const diseaseToClaim = diseases.find(disease => disease.disease_name === claimDisease);

    var conditionCode;

    if (!diseaseToClaim) {
      conditionCode = 0;
    }
    else{
       conditionCode = 1
    }


    const inputData = {
      did,
      conditionCode
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
