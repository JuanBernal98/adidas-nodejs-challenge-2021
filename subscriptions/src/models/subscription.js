const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    newsletter: {
        type: Number,
        trim: true,
        required: [true, 'Newsletter ID is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
    },
    name: {
        type: String,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['f', 'm'],
        lowercase: true,
        trim: true
    },
    birth: { type: Date, required: [true, 'Date of birth is required'] },
    consent: { type: Boolean, required: [true, 'Consent is required'] },
});

module.exports = mongoose.model('subscription', SubscriptionSchema);