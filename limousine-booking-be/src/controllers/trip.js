const { Trip, Vehicle, Seat, Location, SubLocation } = require('../models/index');
const { Op } = require('sequelize');

const getTripList = async (req, res) => {
    try {
        const { count, rows: trips } = await Trip.findAndCountAll({
            include: [
                {
                    model: Location,
                    as: 'origin',
                    attributes: ['name']
                },
                {
                    model: Location,
                    as: 'destination',
                    attributes: ['name']
                },
            ],
            order: [['departureTime', 'ASC']]
        });

        const seats = await Seat.findAll({ where: { tripId: trips.map(trip => trip.id) } });

        const formattedTrips = trips.map(trip => {
            const bookedSeatsCount = seats.filter(seat => seat.tripId === trip.id).length;
            const totalSeats = trip.type === 'STANDARD' ? 36 : trip.type === 'VIP' ? 20 : 0;
            const availableSeatsCount = totalSeats - bookedSeatsCount;

            return {
                id: trip.id,
                departureTime: trip.departureTime,
                arrivalTime: trip.arrivalTime,
                origin: trip.origin.name,
                destination: trip.destination.name,
                type: trip.type,
                price: trip.price,
                availableSeats: availableSeatsCount
            };
        });

        res.json({
            success: true,
            data: formattedTrips,
            pagination: {
                total: count,
                totalPages: 1
            }
        });

    } catch (error) {
        console.error('Error in getTripList:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const searchTrips = async (req, res) => {
    try {
        const { departureTime, origin, destination, type, limit = 5, offset = 0 } = req.query;
        const where = {};
        const nowPlus1Hour = new Date(Date.now() + 60 * 60 * 1000);

        // Filter theo thời gian khởi hành
        if (departureTime) {
            const inputDate = new Date(departureTime);
            const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

            where.departureTime = {
                [Op.and]: [
                    { [Op.gte]: nowPlus1Hour },      // Sau thời điểm hiện tại + 1h
                    { [Op.gte]: startOfDay },
                    { [Op.lte]: endOfDay }
                ]
            };
        } else {
            where.departureTime = {
                [Op.gte]: nowPlus1Hour
            };
        }

        // Tìm danh sách location ID cho origin
        let originLocationIds = [];
        if (origin) {
            const originLocations = await Location.findAll({
                where: { name: { [Op.like]: `%${origin}%` } },
                attributes: ['id']
            });
            originLocationIds = originLocations.map(loc => loc.id);
        }

        // Tìm danh sách location ID cho destination
        let destinationLocationIds = [];
        if (destination) {
            const destinationLocations = await Location.findAll({
                where: { name: { [Op.like]: `%${destination}%` } },
                attributes: ['id']
            });
            destinationLocationIds = destinationLocations.map(loc => loc.id);
        }
        console.log(destinationLocationIds);

        where[Op.and] = [];
        if (origin && originLocationIds.length == 0) {
            where[Op.and].push({ originLocationId: { [Op.in]: [-1] } });
        }
        if (destination && destinationLocationIds.length == 0) {
            where[Op.and].push({ destinationLocationId: { [Op.in]: [-1] } });
        }
        if (originLocationIds.length > 0) {
            where[Op.and].push({ originLocationId: { [Op.in]: originLocationIds } });
        }
        if (destinationLocationIds.length > 0) {
            where[Op.and].push({ destinationLocationId: { [Op.in]: destinationLocationIds } });
        }




        if (type) {
            where.type = type.toUpperCase();
        }

        const { count, rows: trips } = await Trip.findAndCountAll({
            where, include: [
                {
                    model: Location,
                    as: 'origin',
                    attributes: ['name']
                },
                {
                    model: Location,
                    as: 'destination',
                    attributes: ['name']
                },

            ],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['departureTime', 'ASC']]
        });

        const seats = await Seat.findAll({ where: { tripId: trips.map(trip => trip.id) } });

        const availableSeats = seats.map(seat => seat.seatNumber);

        const formattedTrips = trips.map(trip => {
            const bookedSeatsCount = seats.filter(seat => seat.tripId === trip.id).length;
            const totalSeats = trip.type === 'STANDARD' ? 36 : trip.type === 'VIP' ? 20 : 0; // Adjust total seats based on type
            const availableSeatsCount = totalSeats - bookedSeatsCount; // Calculate available seats

            return {
                id: trip.id,
                departureTime: trip.departureTime,
                arrivalTime: trip.arrivalTime,
                origin: trip.origin.name,
                destination: trip.destination.name,
                type: trip.type,
                price: trip.price,
                availableSeats: availableSeatsCount // Add available seats to the response
            };
        });

        res.json({
            success: true,
            message: "Search trip successfully",
            data: {
                trips: formattedTrips,
                pagination: {
                    total: count,
                    limit: parseInt(limit, 10),
                    offset: parseInt(offset, 10),
                }
            }

        });

    } catch (error) {
        console.error('Error in searchTrip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const createTrip = async (req, res) => {
    const { departureTime, arrivalTime, originLocationCode, destinationLocationCode, status, type, price, vehicleLicensePlate } = req.body;
    const originLocation = await Location.findOne({ where: { code: originLocationCode } });
    const destinationLocation = await Location.findOne({ where: { code: destinationLocationCode } });
    const vehicle = await Vehicle.findOne({ where: { licensePlate: vehicleLicensePlate } });
    const trip = await Trip.create({ departureTime, arrivalTime, originLocationId: originLocation.id, destinationLocationId: destinationLocation.id, status, type, price, vehicleId: vehicle.id });
    res.json({
        success: true,
        message: 'Trip created successfully',
        trip: trip
    });
};

const bookedSeats = async (req, res) => {
    const { id } = req.params;
    const seats = await Seat.findAll({ where: { tripId: id }, attributes: ['seatNumber'] });
    res.json({
        success: true,
        message: 'Booked seats fetched successfully',
        data: seats.map(seat => seat.seatNumber)
    });
};

const getSubLocation = async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByPk(id, { include: [{ model: Location, as: 'origin' }, { model: Location, as: 'destination' }] });
    const origin = trip.origin;
    const subOrigin = await SubLocation.findAll({ where: { locationId: origin.id } });
    const destination = trip.destination;
    const subDestination = await SubLocation.findAll({ where: { locationId: destination.id } });

    const formattedSubLocation = {
        tripId: id,
        subOrigin: subOrigin.map(sub => ({
            id: sub.id,
            name: sub.name,
            address: sub.address,
            subDepartureTime: new Date(Date.parse(trip.departureTime) - sub.durationFromLocation * 60 * 1000).toISOString()
        })),
        subDestination: subDestination.map(sub => ({
            id: sub.id,
            name: sub.name,
            address: sub.address,
            subArrivalTime: new Date(Date.parse(trip.arrivalTime) + sub.durationFromLocation * 60 * 1000).toISOString()
        }))
    }
    res.json({
        success: true,
        message: 'Sub location fetched successfully',
        data: formattedSubLocation
    });
};

const createDailyTrip = async (req, res) => {
    try {
        const { departureTime, arrivalTime, originLocationCode, destinationLocationCode, status, type, price, vehicleLicensePlate, startDate, endDate } = req.body;

        const originLocation = await Location.findOne({ where: { code: originLocationCode } });
        const destinationLocation = await Location.findOne({ where: { code: destinationLocationCode } });
        const vehicle = await Vehicle.findOne({ where: { licensePlate: vehicleLicensePlate } });

        if (!originLocation || !destinationLocation || !vehicle) {
            return res.status(400).json({
                success: false,
                message: 'Invalid location or vehicle information'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const departureDateTime = new Date(departureTime);
        const arrivalDateTime = new Date(arrivalTime);
        const timeDiff = arrivalDateTime - departureDateTime;

        const trips = [];
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            const dailyDepartureTime = new Date(date);
            dailyDepartureTime.setHours(departureDateTime.getHours(), departureDateTime.getMinutes());

            const dailyArrivalTime = new Date(dailyDepartureTime.getTime() + timeDiff);

            const trip = await Trip.create({
                departureTime: dailyDepartureTime,
                arrivalTime: dailyArrivalTime,
                originLocationId: originLocation.id,
                destinationLocationId: destinationLocation.id,
                status,
                type,
                price,
                vehicleId: vehicle.id
            });

            trips.push(trip);
        }

        res.json({
            success: true,
            message: 'Daily trips created successfully',
            trips: trips
        });
    } catch (error) {
        console.error('Error in createDailyTrip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = { getTripList, searchTrips, createTrip, createDailyTrip, bookedSeats, getSubLocation };
