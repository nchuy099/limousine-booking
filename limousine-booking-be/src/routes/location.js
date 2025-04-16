const express = require('express');
const router = express.Router();
const { addLocation, getLocationByCode, getLocations } = require('../controllers/location');
const { validate, locationSchemas } = require('../middleware/validation');

router.post('/', validate(locationSchemas.create), addLocation);

router.get('/:code', getLocationByCode);

router.get('/', getLocations);

module.exports = router; 