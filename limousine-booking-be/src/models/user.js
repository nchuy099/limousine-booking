const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHERS'),
        field: 'gender'
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        field: 'date_of_birth'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password',
        set(value) {
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashedPassword);
        }
    },
    profileId: {
        type: DataTypes.INTEGER,
        field: 'profile_id'
    }
}, {
    tableName: 'user',
    timestamps: true, // Thêm created_at và updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hàm so sánh mật khẩu
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;