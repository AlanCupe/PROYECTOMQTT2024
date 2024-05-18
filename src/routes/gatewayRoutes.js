const express = require('express');
const router = express.Router();
const { getAllGatewaysMac, getGateways, createGateway, updateGateway, deleteGateway } = require('../controllers/gatewayController');

// Rutas para obtener todas las direcciones MAC de los Gateways
router.get('/', getAllGatewaysMac);

// Rutas para Gateways
router.get('/all', getGateways);
router.post('/', createGateway);
router.put('/:id', updateGateway);
router.delete('/:id', deleteGateway);

module.exports = router;
