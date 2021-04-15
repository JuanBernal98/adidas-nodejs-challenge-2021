const amqp = require('amqplib/callback_api');

var host = process.env.RABBITMQ_HOST || 'localhost';
var port = process.env.RABBITMQ_PORT || '5672';

// Connect to RabbitMQ
amqp.connect(`amqp://${host}:${port}`, function (error0, connection) {
    if (error0) 
        throw error0;
    // Connect to the channel
    connection.createChannel(function (error1, channel) {
        var queue = 'emails';
        channel.assertQueue(queue); // validate queue
        channel.consume(queue, function(data){
            // We retrieve the message
            var message = data.content;
            // Send mail
            console.log(message);
        });
    });
});