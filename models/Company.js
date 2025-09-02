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
    logo: {
        type: String
    },
    status: {
        type: Number,
        default: 1 // 1 = Active, 0 = Inactive
    }
}, { timestamps: true });


companySchema.virtual('logo_url').get(function () {
    if (!this.logo) return null;

    // Use env BASE_URL or fallback to localhost
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    

    // If already full URL, return as is
    if (this.logo.startsWith('http')) return this.logo;

    // Otherwise build the full URL
    const uploadPath = `/uploads/${this.logo}`;

    return `${baseUrl}${uploadPath}`;
});

module.exports = mongoose.model("Company", companySchema);
