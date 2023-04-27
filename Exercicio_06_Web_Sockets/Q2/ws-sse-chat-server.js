var http = require("http");
var WebSocket = require('ws')
var WebSocketServer = WebSocket.Server;
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var wss = new WebSocketServer({ port: 8080, path: '/chatapp' });

var chatServer = http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream"
        , "Cache-Control": "no-cache"
        , "Connection": "keep-alive"
        , "Access-Control-Allow-Origin": "*"
    });

    emitter.on('msgEvent', msg => {
            res.write("data: " + msg + "\n\n");
        });
});
chatServer.listen(9090);

wss.on('connection', function (ws) {
    console.log('Nova conexão');
    handleUserConnection(ws);
});

function handleUserConnection(ws) {
    var username = null;
    ws.on('message', function (message) {
        if (username) {
            var chatMsg = username + ": " + message;
            console.log(chatMsg);
            broadcastChatMsg(chatMsg);
            emitter.emit('msgEvent', chatMsg);
        } else {
            username = message;
            console.log('Usuário inseriu o username: %s', username);
        }
    });
}

function broadcastChatMsg(chatMsg) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(chatMsg);
        }
    });
}
