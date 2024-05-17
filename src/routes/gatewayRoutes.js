const express = require('express');
const router = express.Router();
const { getAllGatewaysMac } = require('../controllers/gatewayController');

router.get('/', getAllGatewaysMac);

module.exports = router;
