const User = require('../models/User');

exports.addUserData = async (req, res) => {
  try {

    const { did, diseases } = req.body;
    console.log(did, diseases);

    if (!did || !Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({
        message: "Both 'uuid' and a non-empty 'diseases' array are required."
      });
    }

    const newUser = new User({
      did,
      diseases
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User data added successfully!',
      user: newUser
    });
  } catch (error) {
    console.error("Error adding user data:", error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

