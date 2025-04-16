const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seat = sequelize.define('Seat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'seat_number'
    },
    tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'trip_id'
    }
}, {
    tableName: 'seat',
    timestamps: true, // Thêm created_at và updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Seat;