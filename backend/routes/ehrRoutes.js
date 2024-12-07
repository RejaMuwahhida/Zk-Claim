const express = require('express');
const router = express.Router();
const {addUserData} = require('../controllers/addDataController');

router.post('/add', addUserData);

module.exports = router;
