var amqp = require('amqplib/callback_api');
var WebSocket = require('ws')
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({ port: 8080, path: '/requests_list' });

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

function checkForError(err) {
    if (err) {
        throw err;
    }
}

var unAuthRequests = [];

amqp.connect('amqp://localhost', function (error0, connection) {
    checkForError(error0);
    var ch = startConsumer(connection);

    ch.consume('requests', function (msg) {
        console.log(" Novo pedido recebido: %s", msg.content.toString());
        var reqId = JSON.parse(msg.content.toString()).RequestId;
        unAuthRequests.push(reqId);

        broadcast2Authorizers("add_" + reqId);

        emitter.on(reqId, () => {
            unAuthRequests = unAuthRequests.filter(function(e) { return e !== reqId});
            ch.ack(msg);
            broadcast2Authorizers("rm_" + reqId);
            console.log(" Pedido autorizado: "+ reqId );
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

        console.log(" [*] Esperando pedidos na fila %s.", queue);
    });
    return channel;
}

function handleUserConnection(ws) {
    unAuthRequests.forEach(function each(req) {
        ws.send("add_" + req);
    })

    ws.on('message', function (message) {
        console.log(" Solicitação de autorização recebida: " + message.toString());
        
        emitter.emit(message.toString());
    });
}

function broadcast2Authorizers(msg){
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}