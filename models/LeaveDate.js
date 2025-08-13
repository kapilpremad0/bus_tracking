const mongoose = require("mongoose");

const LeaveDateSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

LeaveDateSchema.index({ user_id: 1, date: 1 }, { unique: true });



module.exports = mongoose.model("LeaveDate", LeaveDateSchema);