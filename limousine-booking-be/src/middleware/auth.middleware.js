const { decodeAccessToken, isAccessTokenBlacklisted } = require('../services/token.service');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || await isAccessTokenBlacklisted(token)) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    try {
        const user = await decodeAccessToken(token);
        req.user = user;
        req.accessToken = token;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };