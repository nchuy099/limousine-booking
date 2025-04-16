const express = require('express');
const router = express.Router();
const { getVehicleList, createVehicle } = require('../controllers/vehicle');
const { validate, vehicleSchemas } = require('../middleware/validation');

router.get('/', getVehicleList);

router.post('/', validate(vehicleSchemas.create), createVehicle);

module.exports = router;


