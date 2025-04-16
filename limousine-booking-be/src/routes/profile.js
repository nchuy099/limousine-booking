const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile');
const { validate, userSchemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, validate(userSchemas.update), updateProfile);

module.exports = router;


