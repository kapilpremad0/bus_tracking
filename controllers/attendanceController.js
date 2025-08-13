const express = require('express');
const router = express.Router();
const Punch = require('../models/Punch');
const moment = require('moment');

exports.punchIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = moment().format('YYYY-MM-DD');

        // Check if punch record exists for today
        const existingPunch = await Punch.findOne({ user_id: userId, date: today });
        if (existingPunch) {
            return res.status(400).json({ message: 'Already punched in today' });
        }

        // Create punch in record
        const punch = new Punch({
            user_id: userId,
            punch_in: new Date(),
            date: today,
        });

        await punch.save();

        return res.json({ message: 'Punch in successful', punch });
    } catch (error) {
        console.error('Punch In error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Punch out
exports.punchOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = moment().format('YYYY-MM-DD');

        // Find today's punch record
        const punch = await Punch.findOne({ user_id: userId, date: today });
        if (!punch) {
            return res.status(400).json({ message: 'Please punch in first before punching out' });
        }

        if (punch.punch_out) {
            return res.status(400).json({ message: 'Already punched out today' });
        }

        // Update punch out time
        punch.punch_out = new Date();
        await punch.save();

        return res.json({ message: 'Punch out successful', punch });
    } catch (error) {
        console.error('Punch Out error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get attendance history with working hours
exports.getAttendanceHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const punches = await Punch.find({ user_id: userId }).sort({ date: -1 });

        const attendance = punches.map(punch => {
            let workingHours = null;
            if (punch.punch_in && punch.punch_out) {
                workingHours = (punch.punch_out - punch.punch_in) / (1000 * 60 * 60); // ms to hours
            }
            return {
                date: punch.date,
                punch_in: punch.punch_in,
                punch_out: punch.punch_out,
                working_hours: workingHours !== null ? workingHours.toFixed(2) : null,
            };
        });

        return res.json({ attendance });
    } catch (error) {
        console.error('Get attendance error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};