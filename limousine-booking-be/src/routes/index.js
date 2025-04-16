const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const bookingRoutes = require('./booking');
const tripRoutes = require('./trip');
const vehicleRoutes = require('./vehicle');
const locationRoutes = require('./location');
const subLocationRoutes = require('./sublocation');
const profileRoutes = require('./profile');

router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/trip', tripRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/location', locationRoutes);
router.use('/sublocation', subLocationRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
