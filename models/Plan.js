const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "plan name is required"],
      trim: true,
    },
    duration: {
      type: String,
      enum: ["weekly", "bi-weekly", "monthly"],
      required: [true, "Duration is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "paused"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Plan", planSchema);
