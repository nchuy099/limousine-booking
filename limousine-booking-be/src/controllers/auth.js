const { User, Profile } = require('../models/index');
const { generateAccessToken, generateRefreshToken, blacklistAccessToken, decodeRefreshToken } = require('../services/token.service');

const register = async (req, res) => {
    try {
        const { fullName, phoneNumber, email, password } = req.body;

        // Check if user already exists
        const existingProfile = await Profile.findOne({ where: { email } });
        let existingUser = null;
        if (existingProfile) {
            existingUser = await User.findOne({ where: { profileId: existingProfile.id } });
        }
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create profile first
        const profile = await Profile.create({
            fullName,
            phoneNumber,
            email
        });

        // Create user with profile reference
        const user = await User.create({
            password,
            profileId: profile.id
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    fullName: profile.fullName,
                    email: profile.email,
                    phoneNumber: profile.phoneNumber
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email through profile
        const profiles = await Profile.findAll({ where: { email } });
        let userProfile = null;
        let user = null;
        for (const profile of profiles) {
            user = await User.findOne({ where: { profileId: profile.id } });
            if (user) {
                userProfile = profile;
                break;
            }
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    email: userProfile.email,
                    fullName: userProfile.fullName,
                    phoneNumber: userProfile.phoneNumber
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.accessToken;
        if (token) {
            await blacklistAccessToken(token);
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: error.message
        });
    }
};

const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = decodeRefreshToken(refreshToken);
        const accessToken = generateAccessToken(decoded.userId);
        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Error refreshing token',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken
};
