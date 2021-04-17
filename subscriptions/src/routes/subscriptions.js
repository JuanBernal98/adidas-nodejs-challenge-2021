const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = require('../models/subscription');

// moongodb connection
mongoose.connect('mongodb://mongo:27017/subscriptions', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((error) => {
        console.error(`Can't connect to mongodb`);
        process.exit(1);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongodb connected');
});

/**
 * All subscriptions
 */
router.get('/subscriptions', function (req, res) {
    Subscription.find(function (err, subscriptions) {
        if (err) handleError(err, res); // ERROR
        res.send(subscriptions);
    });
});

/**
 * View detail
 */
router.get('/subscription/:id', function (req, res) {
    var id = req.params.id;
    Subscription.findById(id, (err, subscription) => {
        if (err) handleError(err, res); // ERROR
        res.send(subscription);
    });
});

/**
 * Create subscription
 */
router.post('/subscription', function (req, res) {
    Subscription.create(req.body, function (err, object) {
        if (err) handleError(err, res); // ERROR
        res.send(object.id);
    });
});

/**
 * Update subscription
 */
router.put('/subscription', function (req, res) {
    // Update by _id find
    const subscription = Subscription.findOneAndUpdate({ id: req.body.id }, req.body, {
        new: true
    });
});

/**
 * Delete subscription
 */
router.delete('/subscription/:id', function (req, res) {
    Subscription.findByIdAndDelete(req.params.id, (err, subscription) => {
        if (err || !subscription) return handleError(err);
        res.status(200).send(`${subscription.id}`);
    });
});

function handleError(err, res) {
    res.send(err + 'error');
}

module.exports = router;