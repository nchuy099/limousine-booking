const { Location } = require('../models');
const { validate, locationSchemas } = require('../middleware/validation');

const addLocation = async (req, res) => {
    try {
        const { name, code } = req.body;
        const location = await Location.create({ name, code });
        res.status(201).json({
            success: true,
            message: 'Location created successfully',
            data: {
                name: location.name,
                code: location.code
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating location',
            error: error.message
        });
    }
};

const getLocationByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const location = await Location.findOne({ where: { code } });
        res.status(200).json({
            success: true,
            message: 'Location retrieved successfully',
            data: {
                name: location.name,
                code: location.code
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving location',
            error: error.message
        });
    }
}

const getLocations = async (req, res) => {
    try {
        const locations = await Location.findAll();

        res.status(200).json({
            success: true,
            message: 'Locations retrieved successfully',
            data: locations.map(location => ({
                name: location.name,
                code: location.code
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving locations',
            error: error.message
        });
    }
};

module.exports = {
    addLocation,
    getLocationByCode,
    getLocations
};



