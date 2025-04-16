const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title'
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'thumbnail'
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category'
    },
    shortDesc: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shortDesc'
    },
    detailDesc: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'detailDesc'
    }
}, {
    tableName: 'post',
    timestamps: true, // Thêm created_at và updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Post;