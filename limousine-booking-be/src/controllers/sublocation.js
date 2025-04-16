const { SubLocation, Location } = require('../models');
const { validate, subLocationSchemas } = require('../middleware/validation');

const addSubLocation = async (req, res) => {
    try {
        const { name, locationCode, durationFromLocation, address } = req.body;
        const location = await Location.findOne({ where: { code: locationCode } });
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        const subLocation = await SubLocation.create({ name, locationId: location.id, address, durationFromLocation });
        res.status(201).json({
            success: true,
            message: 'Sub location created successfully',
            data: {
                name: subLocation.name,
                locationCode: subLocation.locationCode,
                address: subLocation.address,
                durationFromLocation: subLocation.durationFromLocation
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating sub location',
            error: error.message
        });
    }
}

const getSubLocations = async (req, res) => {
    try {
        const subLocations = await SubLocation.findAll({
            include: [{
                model: Location,
                as: 'location',
                attributes: ['code']
            }],
            attributes: ['name', 'durationFromLocation', 'address']
        });

        const formattedSubLocations = subLocations.map(subLocation => ({
            name: subLocation.name,
            locationCode: subLocation.location.code,
            address: subLocation.address,
            durationFromLocation: subLocation.durationFromLocation
        }));
        res.status(200).json({
            success: true,
            message: 'Sub locations retrieved successfully',
            data: formattedSubLocations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving sub locations',
            error: error.message
        });
    }
}

module.exports = {
    addSubLocation,
    getSubLocations
};
