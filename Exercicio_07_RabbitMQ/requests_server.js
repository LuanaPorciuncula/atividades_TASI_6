var amqp = require('amqplib/callback_api');
var WebSocket = require('ws')
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({ port: 8080, path: '/requests_list' });

function checkForError(err) {
    if (err) {
        throw err;
    }
}

var unAuthRequests = [];

amqp.connect('amqp://localhost', function (error0, connection) {
    checkForError(error0);


    var ch = startConsumer(connection);
    console.log("Consumindo no mainChannel");
    ch.consume('requests', function (msg) {
        console.log(" [x] Received %s", msg.content.toString());
        var reqInfo = {
            "Channel": ch,
            "msg": msg
        }
        unAuthRequests.push(reqInfo);

        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.content.toString());
            }
        });

    }, {
        noAck: false
    });


    wss.on('connection', function (ws) {
        console.log('Nova conexão');
        handleUserConnection(ws);
    });
});

function startConsumer(connection) {
    var channel = connection.createChannel(function (error1, channel) {
        checkForError(error1);

        var queue = 'requests';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    });
    return channel;
}

/* wss.on('connection', function (ws) {
    console.log('Nova conexão');
    handleUserConnection(ws);
}); */

function handleUserConnection(ws) {
    unAuthRequests.forEach(function each(req) {
        ws.send(req.msg.content.toString());
    })

    ws.on('message', function (message) {
        console.log(message);
    });
}

function broadcastRequest(chatMsg) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(chatMsg);
        }
    });
}