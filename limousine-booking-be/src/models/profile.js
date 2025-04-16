// models/Profile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email',
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'profile',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Profile;