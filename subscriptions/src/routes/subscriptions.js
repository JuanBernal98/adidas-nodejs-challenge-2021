const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const amqlib = require('amqplib/callback_api');
const Subscription = require('../models/subscription');
const { findById } = require('../models/subscription');

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
        if (err) return handleError(err, res); // ERROR
        res.send(subscriptions);
    });
});

/**
 * View detail
 */
router.get('/subscription/:id', function (req, res) {
    var id = req.params.id;
    Subscription.findById(id, (err, subscription) => {
        if (err) return handleError(err, res); // ERROR
        res.send(subscription);
    });
});

/**
 * Create subscription
 */
router.post('/subscription', function (req, res) {
    Subscription.findOne({ newsletter: req.body.newsletter, email: req.body.email }, (err, subscription) => {
        if (err) return handleError(err, res); // ERROR
        if (subscription !== null) return res.status(409).send('Subscription already exists');
        Subscription.create(req.body, function (err, object) {
            if (err) return handleError(err, res); // ERROR
            enqueueSubscription(object, res);
            res.send(object.id);
        });
    });
});

/**
 * Delete subscription
 */
router.delete('/subscription/:id', function (req, res) {
    Subscription.findByIdAndDelete(req.params.id, (err, subscription) => {
        if (err || !subscription) return handleError(err, res);
        res.status(200).send();
    });
});

/**
 * Error handling
 */
function handleError(err, res) {
    try {
        switch (err.name) {
            case 'DocumentNotFoundError':
                res.status(404).send("Subscription not found.");
                break;
            case 'CastError':
                res.status(404).send("Subscription not found.");
                break;
            case 'ValidationError':
                let errors = {};
                Object.keys(err.errors).forEach((key) => {
                    if (err.errors[key].name === 'CastError')
                        errors[key] = `Invalid ${key}`;
                    else
                        errors[key] = err.errors[key].message;
                });
                res.status(400).send(errors);
                break;
            default:
                res.status(500).send('An unknown error occurred.');
                break;
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

/* RabbitMQ
-------------------------------- */
const queue = 'emails';
const rabbitmqConnection = 'rabbitmq';

/**
 * Connects to RabbitMQ and sends subscription
 */
function enqueueSubscription(subscription, res) {
    amqlib.connect(`amqp://${rabbitmqConnection}`, function (err, conn) {
        if (err != null) return enqueueFailed(subscription, err, res);
        conn.createChannel((err, ch) => {
            if (err != null) return enqueueFailed(subscription, err, res);
            ch.assertQueue(queue);
            ch.sendToQueue(queue, Buffer.from(JSON.stringify(subscription)));
        });
    });
}

function enqueueFailed(subscription, err, res) {
    // Manage enqueue failed, might delete our subscription and send an return error status.
    res.status(500).send(err);
}

module.exports = router;