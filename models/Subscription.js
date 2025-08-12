// models/Purchase.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    plan_name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      enum: ["weekly", "bi-weekly", "monthly"],
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
      required: true,
    },
    user_id: {                  // If you want to link to a user who bought the plan
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    days: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
