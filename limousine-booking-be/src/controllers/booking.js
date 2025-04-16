const { Booking, Trip, Seat, Vehicle, Profile, Location, SubLocation } = require('../models/index');
const { generateTicketNumber } = require('../utils/generateTicketNumber');
const { sequelize } = require('../config/database');

const makeBookings = async (req, res) => {
    // Khởi tạo transaction
    const t = await sequelize.transaction();

    try {
        const { fullName, phoneNumber, email, note, seatNumbers, tripId, subOriginId, subDestinationId } = req.body;

        // Kiểm tra trip tồn tại và lấy thông tin
        const trip = await Trip.findByPk(tripId, { transaction: t });
        if (!trip) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        // Tìm hoặc tạo profile
        let profile = await Profile.findOne({
            where: { email },
            transaction: t
        });

        if (!profile) {
            profile = await Profile.create(
                { fullName, phoneNumber, email },
                { transaction: t }
            );
        }

        const bookings = []; // To store booking details for each seat

        for (const seatNumber of seatNumbers) {
            // Kiểm tra ghế đã được đặt chưa
            const existingSeat = await Seat.findOne({
                where: { tripId, seatNumber },
                transaction: t
            });

            if (existingSeat) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Seat ${seatNumber} already booked`
                });
            }

            // Tạo ghế mới
            const seat = await Seat.create(
                { tripId, seatNumber },
                { transaction: t }
            );

            // Tạo ticket number unique
            let ticketNumber;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 10;

            while (!isUnique && attempts < maxAttempts) {
                ticketNumber = generateTicketNumber();
                const existingBooking = await Booking.findOne({
                    where: { ticketNumber },
                    transaction: t
                });
                if (!existingBooking) {
                    isUnique = true;
                }
                attempts++;
            }

            if (!isUnique) {
                await t.rollback();
                return res.status(500).json({
                    success: false,
                    message: 'Could not generate unique ticket number after maximum attempts'
                });
            }

            // Tạo booking với ticket number đã được tạo
            const booking = await Booking.create({
                ticketNumber,
                seatId: seat.id,
                profileId: profile.id,
                note,
                subOriginId,
                subDestinationId,
                status: 'CONFIRMED'
            }, { transaction: t });

            bookings.push(booking); // Store the booking details
        }


        // Nếu mọi thứ OK, commit transaction
        await t.commit();


        res.status(201).json({
            success: true,
            message: 'Bookings created successfully',
            data: {
                totalTicket: bookings.length
            }
        });
    } catch (error) {
        // Nếu có lỗi, rollback tất cả thay đổi
        await t.rollback();
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({ where: { ticketNumber } });
    await booking.update({ status: 'CANCELLED' });
    res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
            ticketNumber: booking.ticketNumber,
            status: booking.status
        }
    });
};

const getBookingByTicketNumber = async (req, res) => {
    const { ticketNumber } = req.params;
    const booking = await Booking.findOne({
        where: { ticketNumber },
        attributes: ['ticketNumber', 'status', 'bookingTime'], include: [
            {
                model: Seat,
                as: 'seat',
                attributes: ['seatNumber'],
                include: [
                    {
                        model: Trip,
                        as: 'trip',
                        attributes: ['departureTime', 'arrivalTime'],
                        include: [
                            {
                                model: Vehicle,
                                as: 'vehicle',
                                attributes: ['licensePlate']
                            }
                        ]
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subOrigin',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subDestination',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            }
        ]
    });

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }

    const formattedBooking = {
        ticketNumber: booking.ticketNumber,
        seatNumber: booking.seat.seatNumber,
        bookingTime: booking.bookingTime,
        origin: booking.subOrigin?.location?.name || 'Unknown Origin',
        subOrigin: booking.subOrigin.name + ', ' + booking.subOrigin.address,
        destination: booking.subDestination?.location?.name || 'Unknown Destination',
        subDestination: booking.subDestination.name + ', ' + booking.subDestination.address,
        departureTime: booking.seat.trip.departureTime,
        arrivalTime: booking.seat.trip.arrivalTime,
        licensePlate: booking.seat.trip.vehicle?.licensePlate || 'Unknown',
        status: (booking.seat.trip.arrivalTime < new Date()) ? 'COMPLETED' : booking.status,
    };

    res.json({
        success: true,
        message: 'Booking retrieved successfully',
        data: formattedBooking
    });
};

const getBookingListByUser = async (req, res) => {
    const userId = req.user.userId;
    const profile = await Profile.findByPk(userId);
    const bookings = await Booking.findAll({
        where: { profileId: profile.id },
        attributes: ['ticketNumber', 'status', 'bookingTime'],
        include: [
            {
                model: Seat,
                as: 'seat',
                attributes: ['seatNumber'],
                include: [
                    {
                        model: Trip,
                        as: 'trip',
                        attributes: ['departureTime', 'arrivalTime'],
                        include: [
                            {
                                model: Vehicle,
                                as: 'vehicle',
                                attributes: ['licensePlate']
                            }
                        ]
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subOrigin',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subDestination',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            }

        ]
    });

    const formattedBookings = bookings.map(booking => ({
        ticketNumber: booking.ticketNumber,
        seatNumber: booking.seat.seatNumber,
        bookingTime: booking.bookingTime,
        origin: booking.subOrigin?.location?.name || 'Unknown Origin',
        subOrigin: booking.subOrigin.name + ', ' + booking.subOrigin.address,
        destination: booking.subDestination?.location?.name || 'Unknown Destination',
        subDestination: booking.subDestination.name + ', ' + booking.subDestination.address,
        departureTime: booking.seat.trip.departureTime,
        arrivalTime: booking.seat.trip.arrivalTime,
        licensePlate: booking.seat.trip.vehicle?.licensePlate || 'Unknown',
        status: (booking.seat.trip.arrivalTime < new Date()) ? 'COMPLETED' : booking.status,
    }));
    res.json({
        success: true,
        message: 'Booking list retrieved successfully',
        data: formattedBookings
    });
}

const searchBookings = async (req, res) => {
    const { email } = req.query;
    const profiles = await Profile.findAll({ where: { email } });
    const bookings = await Booking.findAll({
        where: { profileId: profiles.map(profile => profile.id) },
        attributes: ['ticketNumber', 'status', 'bookingTime'],
        include: [
            {
                model: Seat,
                as: 'seat',
                attributes: ['seatNumber'],
                include: [
                    {
                        model: Trip,
                        as: 'trip',
                        attributes: ['departureTime', 'arrivalTime'],
                        include: [
                            {
                                model: Vehicle,
                                as: 'vehicle',
                                attributes: ['licensePlate']
                            }
                        ]
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subOrigin',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            },
            {
                model: SubLocation,
                as: 'subDestination',
                attributes: ['name', 'address'],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            }

        ]
    });

    const formattedBookings = bookings.map(booking => ({
        ticketNumber: booking.ticketNumber,
        seatNumber: booking.seat.seatNumber,
        bookingTime: booking.bookingTime,
        origin: booking.subOrigin?.location?.name || 'Unknown Origin',
        subOrigin: booking.subOrigin.name + ', ' + booking.subOrigin.address,
        destination: booking.subDestination?.location?.name || 'Unknown Destination',
        subDestination: booking.subDestination.name + ', ' + booking.subDestination.address,
        departureTime: booking.seat.trip.departureTime,
        arrivalTime: booking.seat.trip.arrivalTime,
        licensePlate: booking.seat.trip.vehicle?.licensePlate || 'Unknown',
        status: (booking.seat.trip.arrivalTime < new Date()) ? 'COMPLETED' : booking.status,
    }));
    res.json({
        success: true,
        message: 'Booking list retrieved successfully',
        data: formattedBookings
    });
}


module.exports = {
    makeBookings,
    cancelBooking,
    getBookingByTicketNumber,
    getBookingListByUser,
    searchBookings
};







