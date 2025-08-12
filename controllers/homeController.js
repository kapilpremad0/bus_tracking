const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const PauseDate = require('../models/PauseDate');
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
        const { dates } = req.body || {};

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            // return res.status(400).json({ message: "Array of dates is required" });
            Object.assign(errors, formatError('dates', 'Array of dates is required'));
        }


        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Validation Error', errors });
        }

        const pauseDatesToInsert = dates.map(dateStr => ({
            user_id: userId,
            date: new Date(dateStr),
        }));

        // Insert all at once
        const inserted = await PauseDate.insertMany(pauseDatesToInsert);
        res.json({ message: "Pause dates added", inserted });
    } catch (err) {
        console.error('Update Profile:', err.message);
        return res.status(500).json({ message: 'Server Error ' + err.message });
    }
}

