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

const client = new chatAppPkg(svrAddress + ":" + svrPort,
    grpc.credentials.createInsecure());

const call = client.join();
call.on("data", rcvdMsg => {
    console.log("Server: " + rcvdMsg.msg)
})
call.on("end", e => console.log("server done!"))
call.on("error", e => console.error(e))

rl.addListener('line', line => {
    const chatMsg = {
        "msg": line
    }

    client.sendMsg(chatMsg, (err, _) => { });
})