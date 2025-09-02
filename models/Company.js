const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true // allows multiple null values
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    latitude: {
        type: Number, // example: 28.7041
        required: false
    },
    longitude: {
        type: Number, // example: 77.1025
        required: false
    },
    logo_url: {
        type: String
    },
    status: {
        type: Number,
        default: 1 // 1 = Active, 0 = Inactive
    }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
