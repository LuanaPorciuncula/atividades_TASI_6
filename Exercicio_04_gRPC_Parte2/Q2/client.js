const readline = require('readline')
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("chatApp.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatAppPkg = grpcObject.ChatApp;

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const client = new chatAppPkg(svrAddress + ":" + svrPort,
    grpc.credentials.createInsecure());

var username;
var userId;

client.joinChatApp(null, (err, response) => {
    console.log("Número de outros usuários conectados no momento: " + response.userCount)
    userId = response.userId;
    rl.question(response.request, (answer) => {
        username = answer;
        joinChat();
    });
});


function joinChat() {
    const client = new chatAppPkg(svrAddress + ":" + svrPort,
        grpc.credentials.createInsecure());

    const id = { "username": username }

    const call = client.provideUsername(id, (err, _) => { });

    call.on("data", rcvdMsg => {
        console.log(rcvdMsg.username + ": " + rcvdMsg.msg);
    })
    call.on("error", e => console.error(e))
    

    rl.addListener('line', line => {
        const chatMsg = {
            "username": username,
            "msg": line,
            "userId": userId
        }

        client.sendMsg(chatMsg, (err, _) => { });
    })
}
