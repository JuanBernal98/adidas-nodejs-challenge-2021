const queue = 'emails';

// Consume messages
var open = require('amqplib').connect('amqp://rabbitmq');
open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, function (msg) {
            if (msg !== null) {
                // check newsletter id and send predefined template
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);