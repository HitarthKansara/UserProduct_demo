const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: { type: String },
    userType: {
        type: String,
        enum: ['supplier', 'buyer'],
        required: true,
    },
    auth_token: { type: String },
    refresh_token: { type: String }
    // Add other fields for user profile
});

module.exports = mongoose.model('User', userSchema);
