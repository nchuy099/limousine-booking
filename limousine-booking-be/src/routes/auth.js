const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken } = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validate, authSchemas } = require('../middleware/validation');

router.post('/register', validate(authSchemas.register), register);

router.post('/login', validate(authSchemas.login), login);

router.post('/logout', logout);

router.post('/refresh-token', refreshToken);
module.exports = router;
