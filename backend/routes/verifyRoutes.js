const express = require("express");
const router = express.Router();
const {checkEligibility} = require("../controllers/proofController");

// Define the route for verifying proofs
router.post("/verify-proof", checkEligibility);

module.exports = router;
