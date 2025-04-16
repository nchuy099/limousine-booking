const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'license_plate'
    },
    capacity: {
        type: DataTypes.ENUM('Standard-34', 'VIP-20'),
        allowNull: false,
        field: 'capacity'
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
        field: 'status'
    }
}, {
    tableName: 'vehicle',
    timestamps: true, // Thêm created_at và updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Vehicle;