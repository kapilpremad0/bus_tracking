const mongoose = require("mongoose");

const pauseDateSchema = new mongoose.Schema(
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

pauseDateSchema.index({ user_id: 1, date: 1 }, { unique: true });



module.exports = mongoose.model("PauseDate", pauseDateSchema);