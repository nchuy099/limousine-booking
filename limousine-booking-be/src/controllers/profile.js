const { User, Profile } = require('../models/index');

const getProfile = async (req, res) => {
    const { userId } = req.user;
    const user = await User.findByPk(userId);
    const profile = await Profile.findByPk(user.profileId);
    res.json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile
    });
};

const updateProfile = async (req, res) => {
    const { userId } = req.user;
    const { fullName, phoneNumber, email } = req.body;
    const user = await User.findByPk(userId);
    const profile = await Profile.findByPk(user.profileId);
    if (!profile) {
        return res.status(404).json({
            success: false,
            message: 'Profile not found'
        });
    }
    profile.fullName = fullName;
    profile.phoneNumber = phoneNumber;
    profile.email = email;
    await profile.save();
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: profile
    });
};

module.exports = { getProfile, updateProfile };

