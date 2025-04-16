// models/SubLocation.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SubLocation = sequelize.define('SubLocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'location_id'
    },
    durationFromLocation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duration_from_location'
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'address'
    }
}, {
    tableName: 'sub_location',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SubLocation;