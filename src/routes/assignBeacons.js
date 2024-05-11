const express = require('express');
const router = express.Router();
const assignBeaconsController = require('../controllers/assignBeaconsController');

router.get('/', assignBeaconsController.assignBeacon);
router.post('/', assignBeaconsController.assignBeacon);

module.exports = router;
