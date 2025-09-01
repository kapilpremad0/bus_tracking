const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        enum: ['customer', 'driver', 'admin'],
        default: 'customer'
    },
    otp_verify: {
        type: Boolean,
        default: false   // false = not verified, true = verified
    },
    terms_conditions: {
        type: Boolean,
        default: false   // false = not verified, true = verified
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    email: { type: String, default: null }, // Gmail address
    gender: {
        type: String,
        enum: ['male', 'female', 'other', null],
        default: null
    },
    dob: { type: Date, default: null }, // Date of birth
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String, // store filename or relative path (e.g. "uploads/profile-images/abc.jpg")
        default: ''
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    defaultAddress: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        country: { type: String, default: null },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },
    secondaryAddress: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        pincode: { type: String, default: null },
        country: { type: String, default: null },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null }
    },


    ssn: { type: String, default: null },
    emergencyContact: { type: String, default: null },
    homeAddress: { type: String, default: null },


    // NEW: Driver Credentials (only for drivers)
    driverCredentials: {
        licenseNumber: { type: String, default: null },
        licenseIssueDate: { type: Date, default: null },
        licenseExpiryDate: { type: Date, default: null }
    },

    // NEW: Driver / Address Documents
    documents: {
        licenseFront: { type: String, default: null },
        licenseBack: { type: String, default: null },
        addressFront: { type: String, default: null },
        addressBack: { type: String, default: null }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to generate full profile image URL
UserSchema.virtual('profile_url').get(function () {
    // if (!this.profile) return null;

    // Use env BASE_URL or fallback to localhost
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    if (!this.profile) {
        const id = this._id ? this._id.toString().slice(-1) : 1; // last digit for variation
        const gender = this.gender;

        if (gender === 'female') {
            const avatarNumber = (id % 5) + 1; // Results in 1 to 5
            return `${baseUrl}/avatars/avatar-f${avatarNumber}.png`;
        } else if (gender === 'other') {
            return `${baseUrl}/avatars/gender-symbol.png`;
        } else {
            const avatarNumber = (id % 5) + 1; // Results in 1 to 5
            return `${baseUrl}/avatars/avatar${avatarNumber}.png`;
        }
    }

    // If already full URL, return as is
    if (this.profile.startsWith('http')) return this.profile;

    // Otherwise build the full URL
    const uploadPath = `/uploads/${this.profile}`;

    return `${baseUrl}${uploadPath}`;
});

UserSchema.virtual('document_urls').get(function () {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Convert to plain object to remove mongoose prototype methods
    const docsRaw = this.documents ? this.documents.toObject() : {};
    const docs = {};

    for (let key in docsRaw) {
        const val = docsRaw[key];

        if (typeof val === 'string' && val.trim() !== '') {
            docs[key] = val.startsWith('http')
                ? val
                : `${baseUrl}/uploads/${val}`;
        } else {
            docs[key] = null;
        }
    }

    return docs;
});

module.exports = mongoose.model('User', UserSchema);
