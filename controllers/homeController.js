const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Punch = require('../models/Punch');
const Subscription = require('../models/Subscription');
const PauseDate = require('../models/PauseDate');
const LeaveDate = require('../models/LeaveDate');
const path = require('path');
const Company = require('../models/Company');


const formatError = (field, message) => ({ [field]: message });


function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


exports.plans = async (req, res) => {
    try {
        const plans = await Plan.find();
        return res.json(plans);
    } catch (err) {
        console.error('Update Profile:', err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}


exports.transactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = await Subscription.find({ user_id: userId }).sort({ createdAt: -1 });
        return res.json(subscriptions);
    } catch (err) {
        console.error('Update Profile:', err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}



exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ status: 1 }).sort({ createdAt: -1 });
        return res.json(companies);
    } catch (err) {
        console.error('Get Companies:', err.message);
        return res.status(500).json({ message: 'Server Error' });
    }
}

exports.purchaseSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        const { plan_id } = req.body || {};

        const plan = await Plan.findById(plan_id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        let daysToAdd = 0;
        if (plan.duration === "weekly") daysToAdd = 7;
        else if (plan.duration === "bi-weekly") daysToAdd = 14;
        else if (plan.duration === "monthly") daysToAdd = 30;

        const startDate = new Date();
        const endDate = addDays(startDate, daysToAdd);

        const purchase = new Subscription({
            user_id: userId,
            plan_id: plan._id,
            plan_name: plan.name,
            duration: plan.duration,
            start_date: startDate,
            end_date: endDate,
            days: daysToAdd,
            amount: plan.amount,
            status: "active",
        });

        // EXPIRE all existing active plans for this user
        await Subscription.updateMany(
            { user_id: userId, status: "active" },
            { $set: { status: "expired" } }
        );

        await purchase.save();
        return res.json(purchase);
    } catch (err) {
        console.error('Update Profile:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}


exports.addPauseDate = async (req, res) => {
    const userId = req.user.id;
    const errors = {};
    try {
        const { dates, reason, description } = req.body || {};

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            Object.assign(errors, { dates: 'Array of dates is required' });
        }

        if (!reason) {
            Object.assign(errors, formatError('reason', 'The reason field is required.'));
        }

        if (!description) {
            Object.assign(errors, formatError('description', 'The description field is required.'));
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Validation Error', errors });
        }

        // Normalize dates to ISO string to compare easily
        const normalizedDates = dates.map(d => new Date(d).toISOString());

        // Find existing dates for this user among the dates requested
        const existingPauseDates = await PauseDate.find({
            user_id: userId,
            date: { $in: normalizedDates },
        }).select('date');

        const existingDatesSet = new Set(existingPauseDates.map(d => d.date.toISOString()));

        // Filter out dates which already exist
        const datesToInsert = normalizedDates
            .filter(d => !existingDatesSet.has(d))
            .map(d => ({
                user_id: userId,
                date: new Date(d),
                reason: reason,
                description: description
            }));

        if (datesToInsert.length === 0) {
            return res.status(200).json({ message: 'No new dates to add, all dates already exist.' });
        }

        // Insert only new dates
        const inserted = await PauseDate.insertMany(datesToInsert);
        res.json({ message: "Pause dates added", inserted });
    } catch (err) {
        console.error('Add Pause Dates:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
};


exports.getPauseDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const getPauseDate = await PauseDate.find({ user_id: userId }).sort({ date: -1 });
        return res.json(getPauseDate);
    } catch (err) {
        console.error('Add Pause Dates:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}


exports.addLeaveDate = async (req, res) => {
    const userId = req.user.id;
    const errors = {};
    try {
        const { dates, reason, description } = req.body || {};

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            Object.assign(errors, { dates: 'Array of dates is required' });
        }

        if (!reason) {
            Object.assign(errors, formatError('reason', 'The reason field is required.'));
        }

        if (!description) {
            Object.assign(errors, formatError('description', 'The description field is required.'));
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Validation Error', errors });
        }

        // Normalize dates to ISO string to compare easily
        const normalizedDates = dates.map(d => new Date(d).toISOString());

        // Find existing dates for this user among the dates requested
        const existingLeaveDates = await LeaveDate.find({
            user_id: userId,
            date: { $in: normalizedDates },
        }).select('date');

        const existingDatesSet = new Set(existingLeaveDates.map(d => d.date.toISOString()));

        // Filter out dates which already exist
        const datesToInsert = normalizedDates
            .filter(d => !existingDatesSet.has(d))
            .map(d => ({
                user_id: userId,
                date: new Date(d),
                reason: reason,
                description: description
            }));

        if (datesToInsert.length === 0) {
            return res.status(200).json({ message: 'No new dates to add, all dates already exist.' });
        }

        // Insert only new dates
        const inserted = await LeaveDate.insertMany(datesToInsert);
        res.json({ message: "Leave dates added", inserted });
    } catch (err) {
        console.error('Add Leave Dates:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
};


exports.getLeaveDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const getPauseDate = await LeaveDate.find({ user_id: userId }).sort({ date: -1 });
        return res.json(getPauseDate);
    } catch (err) {
        console.error('get Leave Dates:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}


exports.homeDriver = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // find today's punch
        const punch = await Punch.findOne({
            user_id: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 }); // in case multiple entries

        var attendance = {};

        // return res.json(punch);

        if (punch) {
            let workingHours = null;

            if (punch.punch_in) {
                // If punch_out exists, calculate normally
                if (punch.punch_out) {
                    workingHours = (punch.punch_out - punch.punch_in) / (1000 * 60 * 60);
                } else {
                    // If no punch_out, calculate till now
                    const now = new Date();
                    workingHours = (now - punch.punch_in) / (1000 * 60 * 60);
                }
            }

            attendance = {
                date: punch.date,
                punch_in: punch.punch_in,
                punch_out: punch.punch_out || null,
                working_hours: workingHours !== null ? workingHours.toFixed(2) : null,
            };
        }

        return res.json({
            today_attendance: attendance
        });

    } catch (err) {
        console.error('get Leave Dates:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}


exports.termsPage = (req, res) => {
    const filePath = path.join(__dirname, '../public/frontend/terms.html');
    res.sendFile(filePath);
};


exports.generalSettings = async (req, res) => {
    try {
        const leaveReasons = [
            "Personal reasons",
            "Medical or health issues",
            "Family emergency",
            "Vacation or holiday",
            "Maternity/Paternity leave",
            "Bereavement leave",
            "Marriage leave",
            "Relocation",
            "Official work or training",
            "Other"
        ];
        const passengerReasons = [
            "Need to attend to a quick errand",
            "Waiting for someone to arrive",
            "Change of destination",
            "Taking a short break",
            "Phone call or emergency",
            "Vehicle issue reported",
            "Feeling unwell",
            "Other"
        ];

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const termsUrl = `${baseUrl}/api/terms`; // or `${baseUrl}/static/terms/bus-tracking-terms.html`

        return res.json({
            pause_ride_reason: passengerReasons,
            leave_request_reasons: leaveReasons,
            terms_url: termsUrl
        });
    } catch (err) {
        console.error('get general settings:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}

