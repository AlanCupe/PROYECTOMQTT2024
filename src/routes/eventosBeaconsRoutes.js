const express = require('express');
const router = express.Router();
const { getEventosBeacons } = require('../controllers/eventosBeaconsController');

router.get('/eventos', getEventosBeacons);

module.exports = router;
