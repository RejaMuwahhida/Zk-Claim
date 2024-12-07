const express = require('express');
const { receiveEHR } = require('../controllers/reclaimController');
const router = express.Router();

router.get('/receive-ehr/:did', receiveEHR);

module.exports = router;
