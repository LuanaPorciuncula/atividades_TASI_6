const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("chatApp.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const chatAppPkg = grpcObject.ChatApp;

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const server = new grpc.Server();
server.bind(svrAddress + ":" + svrPort,
  grpc.ServerCredentials.createInsecure());

server.addService(chatAppPkg.service,
  {
    "joinChatApp": handleNewUserConnection,
    "provideUsername": addUser,
    "sendMsg": rcvMsg
  });
server.start();

var newUserId = 0;
const users = {};

function handleNewUserConnection(_, callback) {

  const svrRequest = {
    "request": "Digite seu username: ",
    "userCount": Object.keys(users).length,
    "userId": newUserId
  }
  callback(null, svrRequest);
}

function addUser(call, _) {
  const currUserId = newUserId;
  users[currUserId] = call;
  newUserId++;
  console.log(call.request.username + " se juntou ao chat.");
  call.on("end", e => console.log(call.request.username + " desconectou"));

  call.on("cancelled", e => {
    console.log(call.request.username + " desconectou");
    Reflect.deleteProperty(users, currUserId);

    const desconnectionMsg = {
      "username": "Servidor",
      "msg": call.request.username + " desconectou"
    };

    for (var id in users) {
      users[id].write(desconnectionMsg);
    }
  })
}

function rcvMsg(call, _) {
  console.log(call.request.username + ": " + call.request.msg);
  const rvcdChatMsg = {
    "username": call.request.username,
    "msg": call.request.msg
  };

  for (var id in users) {
    if (call.request.userId != id) {
      users[id].write(rvcdChatMsg);
    }
  }
}
