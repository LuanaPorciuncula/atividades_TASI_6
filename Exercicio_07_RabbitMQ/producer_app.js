var amqp = require('amqplib/callback_api');

function checkForError(err) {
    if (err) {
        throw err;
    }
}

amqp.connect('amqp://localhost', function (error0, connection) {
    checkForError(error0);
    startPublisher(connection);
});

function startPublisher(connection) {
    connection.createChannel(function (error1, channel) {
        checkForError(error1);

        var queue = 'requests';
        var msg = '{Request: ' + new Date() + "}";

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
}