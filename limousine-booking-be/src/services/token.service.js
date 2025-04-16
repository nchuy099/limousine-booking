const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '1h'//'1h';
const REFRESH_TOKEN_EXPIRY = '7d'//'7d';

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

const decodeAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw error;
    }
};

const decodeRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        throw error;
    }
};

const blacklistAccessToken = async (token) => {
    try {
        const decoded = decodeAccessToken(token);
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
        await redis.set(`blacklist:${token}`, '1', 'EX', expiryTime);
    } catch (error) {
        throw error;
    }
};

const isAccessTokenBlacklisted = async (token) => {
    try {
        const exists = await redis.exists(`blacklist:${token}`);
        return exists === 1;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    decodeAccessToken,
    decodeRefreshToken,
    blacklistAccessToken,
    isAccessTokenBlacklisted
}; 