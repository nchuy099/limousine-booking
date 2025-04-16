const express = require('express');
const router = express.Router();
const { getTripList, searchTrips, createTrip, bookedSeats, getSubLocation, createDailyTrip } = require('../controllers/trip');
const { validate, tripSchemas } = require('../middleware/validation');


router.post('/', validate(tripSchemas.create), createTrip);
router.post('/daily', validate(tripSchemas.createDaily), createDailyTrip);


router.get('/', getTripList);

router.get('/search', validate(tripSchemas.search), searchTrips);

router.get('/:id/booked-seats', bookedSeats);

router.get('/:id/sub-locations', getSubLocation);

module.exports = router;


