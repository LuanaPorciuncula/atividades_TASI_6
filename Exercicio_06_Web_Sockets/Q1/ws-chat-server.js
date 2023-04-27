var WebSocket = require('ws')
var WebSocketServer = WebSocket.Server;
var wss = new WebSocketServer({ port: 8080, path: '/chatapp' });

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