const { Vehicle } = require('../models/index');

const getVehicleList = async (req, res) => {
    const vehicles = await Vehicle.findAll({ attributes: ['licensePlate', 'capacity'] });
    const formattedVehicles = vehicles.map(vehicle => ({
        licensePlate: vehicle.licensePlate,
        capacity: vehicle.capacity
    }));
    res.json({
        success: true,
        message: 'Vehicle list fetched successfully',
        data: formattedVehicles
    });
};

const createVehicle = async (req, res) => {
    const { licensePlate, capacity } = req.body;
    const vehicle = await Vehicle.findOne({ where: { licensePlate } });
    if (vehicle) {
        return res.status(400).json({
            success: false,
            message: 'Vehicle already exists'
        });
    }
    const newVehicle = await Vehicle.create({ licensePlate, capacity });
    res.json({
        success: true,
        message: 'Vehicle created successfully',
        data: {
            licensePlate: newVehicle.licensePlate,
            capacity: newVehicle.capacity
        }
    });
};

module.exports = {
    getVehicleList,
    createVehicle
};


