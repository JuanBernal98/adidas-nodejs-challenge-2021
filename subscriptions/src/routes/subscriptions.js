const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const amqlib = require('amqplib/callback_api');
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
        enqueueSubscription(object, res);
        res.send(object.id);
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

/* RabbitMQ
-------------------------------- */
const queue = 'emails';
const rabbitmqConnection = 'rabbitmq';

/**
 * Connects to RabbitMQ and sends subscription
 */
function enqueueSubscription(subscription, res) {
    amqlib.connect(`amqp://${rabbitmqConnection}`, function (err, conn) {
        if (err != null) handleError(err);
        conn.createChannel((err, ch) => {
            if (err != null) enqueueFailed(err, res);
            ch.assertQueue(queue);
            ch.sendToQueue(queue, Buffer.from(JSON.stringify(subscription)));
        });
    });
}

function enqueueFailed(err, res) {
    res.send(err);
}

module.exports = router;