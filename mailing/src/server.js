const amqp = require('amqplib/callback_api');

var host = process.env.RABBITMQ_HOST || 'rabbitmq';
var port = process.env.RABBITMQ_PORT || '5672';

// Connect to RabbitMQ
amqp.connect(`amqp://${host}:${port}`, function (err, conn) {
    // check err
    if (err) {
        throw err;
    }

    conn.on("error", function (err) {
        if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
        }
    });

    conn.on("close", function () {
        console.error("[AMQP] reconnecting");
    });

    // Connect to the channel
    conn.createChannel(function (err, ch) {
        var queue = 'emails';
        ch.assertQueue(queue, { durable: true }, function (err, _ok) {
            if(err)
                throw err;
            ch.consume(queue, processMsg, { noAck: false });
        });
    });
});

/**
 * 
 * @param {amqp.Message} msg 
 */
function processMsg(msg) {
    // parse json & send email
    console.log('msg sent');
}