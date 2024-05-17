const express = require('express');
const router = express.Router();
const asignacionGatewaysAreasController = require('../controllers/asignacionGatewaysAreasController');

router.get('/', asignacionGatewaysAreasController.getAll);
router.post('/', asignacionGatewaysAreasController.create);
router.put('/:id', asignacionGatewaysAreasController.update);
router.delete('/:id', asignacionGatewaysAreasController.delete);

module.exports = router;
