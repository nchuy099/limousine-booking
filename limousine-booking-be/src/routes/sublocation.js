const express = require('express');
const router = express.Router();
const { addSubLocation, getSubLocations } = require('../controllers/sublocation');
const { validate, subLocationSchemas } = require('../middleware/validation');

router.post('/', validate(subLocationSchemas.create), addSubLocation);

router.get('/', getSubLocations);

module.exports = router; 