const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    newsletter: { type: Number, required: true },
    email: { type: String, required: true },
    name: String,
    gender: { type: String, enum: ['F', 'M'] },
    birth: { type: Date, required: true },
    consent: { type: Boolean, required: true },
});

module.exports = mongoose.model('subscription', SubscriptionSchema);