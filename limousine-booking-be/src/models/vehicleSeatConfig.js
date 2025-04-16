const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VehicleSeatConfig = sequelize.define('VehicleSeatConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    numSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'num_seats'
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'vehicle_id'
    }
}, {
    tableName: 'vehicle_seat_config',
    timestamps: true, // Thêm created_at và updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


module.exports = VehicleSeatConfig;