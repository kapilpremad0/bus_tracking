const mongoose = require('mongoose');

const PunchSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    punch_in: {
        type: Date,
        required: true,
    },
    punch_out: {
        type: Date,
        default: null,
    },
    date: {
        type: Date, // Store as 'YYYY-MM-DD' for uniqueness & easy queries
        required: true,
        index: true,
    },
}, { timestamps: true });

PunchSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Punch = mongoose.model('Punch', PunchSchema);

module.exports = Punch;
