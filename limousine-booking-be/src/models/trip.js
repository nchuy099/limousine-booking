const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'departure_time'
    },
    arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'arrival_time'
    },
    type: {
        type: DataTypes.ENUM('STANDARD', 'VIP'),
        allowNull: false,
        field: 'type'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price'
    },
    status: {
        type: DataTypes.ENUM('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'SCHEDULED',
        field: 'status'
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'vehicle_id'
    },
    originLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'origin_location_id'
    },
    destinationLocationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'destination_location_id'
    }
}, {
    tableName: 'trip',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Trip;