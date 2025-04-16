const express = require('express');
const router = express.Router();
const { makeBookings, cancelBooking, getBookingByTicketNumber, getBookingListByUser, searchBookings } = require('../controllers/booking');
const { validate, bookingSchemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/booking/:
 *   post:
 *     summary: Create a new booking for multiple seats
 *     description: Allows users to book multiple seats for a specific trip.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Booking information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *               example: "John Doe"
 *               description: "Full name of the passenger."
 *             phoneNumber:
 *               type: string
 *               example: "+1234567890"
 *               description: "Phone number of the passenger."
 *             email:
 *               type: string
 *               example: "john.doe@example.com"
 *               description: "Email address of the passenger."
 *             note:
 *               type: string
 *               example: "Window seat preferred"
 *               description: "Any additional notes for the booking."
 *             seatNumbers:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "1A"
 *               description: "List of seat numbers to be booked."
 *             tripId:
 *               type: integer
 *               example: 123
 *               description: "ID of the trip for which seats are being booked."
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: "Bookings created successfully"
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticketNumber:
 *                     type: string
 *                     example: "TICKET123456"
 *                   seat:
 *                     type: object
 *                     properties:
 *                       seatNumber:
 *                         type: string
 *                         example: "1A"
 *                       trip:
 *                         type: object
 *                         properties:
 *                           departureTime:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-10-01T10:00:00Z"
 *                           arrivalTime:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-10-01T12:00:00Z"
 *                           type:
 *                             type: string
 *                             example: "STANDARD"
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 50.00
 *                   profile:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+1234567890"
 *       400:
 *         description: Bad request, seat already booked
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "Seat 1A already booked"
 *       404:
 *         description: Trip not found
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "Trip not found"
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "Error creating booking"
 *             error:
 *               type: string
 *               example: "Detailed error message"
 */
router.post('/', validate(bookingSchemas.create), makeBookings);

router.get('/search', searchBookings)
router.get('/list', authenticateToken, getBookingListByUser);

router.patch('/:ticketNumber([A-Z0-9]+)', cancelBooking);

router.get('/:ticketNumber([A-Z0-9]+)', getBookingByTicketNumber);





module.exports = router;


