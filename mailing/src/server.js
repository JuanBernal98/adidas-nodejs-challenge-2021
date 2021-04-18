const queue = 'emails';

// Consume messages
var open = require('amqplib').connect('amqp://rabbitmq');
open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, function (msg) {
            if (msg !== null) {
                var subscription = JSON.parse(msg.content.toString());
                console.log(subscription);
                processSubscription(subscription);
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);

function processSubscription(subscription) {
    console.log(`Sending template assigned to newsletter #${subscription.newsletter} to ${subscription.email}`);
    // const template = retrieveTemplate(subscription.newsletter);
    // sendTemplate(template, subscription.email);
}

/**
 * Retrieves the template assigned to the subsriptions
 */
function restriveTemplate(newsletter) {
    // retrieve template .html 
}

function sendTemplate(template, email) {
    // send
}