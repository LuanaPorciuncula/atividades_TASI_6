const readline = require('readline')
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("chatAppP2P.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatAppPkg = grpcObject.ChatAppP2P;

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const server = new grpc.Server();
server.bind(svrAddress + ":" + svrPort,
    grpc.ServerCredentials.createInsecure());

server.addService(chatAppPkg.service,
    {
        "join": connectToClient,
        "sendMsg": rcvMsg
    });

server.start();

var client;
function connectToClient(call, _) {
    client = call;
    console.log("cliente conectou!")
}

function rcvMsg(call, _) {
    const rvcdChatMsg = {
        "msg": call.request.msg
    };
    console.log("Cliente: " + rvcdChatMsg.msg);
}


rl.addListener('line', line => {
    if (client != null) {
        const chatMsg = {
            "msg": line
        };
        client.write(chatMsg);
    }
})