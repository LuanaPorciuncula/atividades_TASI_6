const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("calculator.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const calcPkg = grpcObject.Calculator;

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const client = new calcPkg(svrAddress + ":" + svrPort,
  grpc.credentials.createInsecure());

console.log("operações disponíveis :");
console.log(" - adição: [+]");
console.log(" - subtração: [-]");
console.log(" - multiplicação: [*]");
console.log(" - divisão: [/]");
console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");

rl.addListener('line', line => {
  if (msgIsValid(line)) {
    var operation = line.split(' ');
    var int0 = parseInt(operation[0]);
    var opr = operation[1]
    var int1 = parseInt(operation[2]);

    const operationMsg = {
      "int0": int0,
      "int1": int1,
      "operator": opr
    }

    client.calculate(operationMsg, (err, response) => {
      console.log(response.int0 + " " + response.operator + " " + response.int1 + " = " + response.result);
      console.log("Received from server " + JSON.stringify(response))
    })

  } else {
    console.log("Formato inválido");
    console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");
  }
});

function msgIsValid(msg) {
  var operation = msg.split(' ');
  if (operation.length != 3) {
    return false;
  }

  if (isNaN(operation[0]) || isNaN(operation[2])) {
    return false;
  }

  switch (operation[1]) {
    case '+':
      return true;
    case '-':
      return true;
    case '*':
      return true;
    case '/':
      return true;
    default:
      return false;
  }
}