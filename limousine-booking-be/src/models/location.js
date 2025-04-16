// models/Location.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Location = sequelize.define('Location', {
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
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'code'
    }
}, {
    tableName: 'location',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Location;