// models/Booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    ticketNumber: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
        field: 'ticket_number'
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
        field: 'status'
    },
    bookingTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'booking_time'
    },
    note: {
        type: DataTypes.STRING,
        field: 'note'
    },
    seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'seat_id'
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'profile_id'
    },
    subOriginId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sub_origin_id'
    },
    subDestinationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sub_destination_id'
    },

}, {
    tableName: 'booking',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Booking;