const express = require('express');
const router = express.Router();
const beaconController = require('../controllers/beaconController');

router.get('/', beaconController.getBeacons);

module.exports = router;
