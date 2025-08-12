const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Helper: Format validation error
const formatError = (field, message) => ({ [field]: message });

exports.updateAddress = async (req, res) => {
    try {
        const { mobile, type, address } = req.body || {};
        const errors = {};

        const userId = req.user.id;
        // Validate inputs

        if (!type || !['default', 'secondary'].includes(type)) {
            Object.assign(errors, formatError('type', 'Type must be "default" or "secondary".'));
        }
        if (!address || typeof address !== 'object') {
            Object.assign(errors, formatError('address', 'Address must be provided as an object.'));
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Validation Error', errors });
        }


        // Find user
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Merge new address fields into existing one
        if (type === 'default') {
            user.defaultAddress = { ...user.defaultAddress.toObject(), ...address };
        } else {
            user.secondaryAddress = { ...user.secondaryAddress.toObject(), ...address };
        }

        await user.save();

        return res.json({
            message: `${type} address updated successfully.`,
            success: true,
            user
        });

    } catch (err) {
        console.error("Update Address Error:", err.message);
        return res.status(500).json({
            message: 'Server Error',
            success: false
        });
    }
};


exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, gender, gmail, dob, ssn, emergencyContact, homeAddress ,driverCredentials } = req.body || {};
     const errors = {};


    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!driverCredentials || typeof driverCredentials !== 'object') {
            Object.assign(errors, formatError('driverCredentials', 'Driver Credentials must be provided as an object.'));
        }


        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Validation Error', errors });
        }

        // Update fields
        if (name) user.name = name;
        if (gmail) user.gmail = gmail;
        if (gender) user.gender = gender;
        if (dob) user.dob = dob;
        if (ssn) user.ssn = ssn;
        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (homeAddress) user.homeAddress = homeAddress;

        if (req.files?.profile) {
            user.profile = req.files.profile[0].filename;
        }
        if (req.files?.licenseFront) {
            user.documents.licenseFront = req.files.licenseFront[0].filename;
        }
        if (req.files?.licenseBack) {
            user.documents.licenseBack = req.files.licenseBack[0].filename;
        }
        if (req.files?.addressFront) {
            user.documents.addressFront = req.files.addressFront[0].filename;
        }
        if (req.files?.addressBack) {
            user.documents.addressBack = req.files.addressBack[0].filename;
        }
        



        await user.save();

        return res.json({
            message: 'Profile updated successfully',
            user: user
        });
    } catch (err) {
        console.error('Update Profile:', err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};


exports.getProfile = async (req, res) => {
    const userId = req.user.id; // assuming authentication middleware sets req.user

    try {
        const user = await User.findById(userId).select('-password'); // exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        return res.json({
            message: "Profile data fetch successfully",
            user
        });
    } catch (err) {
        console.error('Get Profile Data:', err.message);
        return res.status(500).json({
            message: 'Server Error',
            success: false
        });
    }
}



