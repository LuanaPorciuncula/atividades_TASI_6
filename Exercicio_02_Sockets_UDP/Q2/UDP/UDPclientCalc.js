const udp = require('dgram');
const client = udp.createSocket('udp4');

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("operações disponíveis :");
console.log(" - adição: [+]");
console.log(" - subtração: [-]");
console.log(" - multiplicação: [*]");
console.log(" - divisão: [/]");
console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");

rl.addListener('line', line => {
  if (msgIsValid(line)) {
    var data = Buffer.from(line);
    client.send(data, svrPort, svrAddress, function (err) {
      if (err) {
        console.error(err.stack);
        client.close();
      }
    });
  } else {
    console.log("Formato inválido");
    console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");
  }
});

client.on('error', (err) => {
  var errMsg = "client error:\n" + err.stack;
  console.error(errMsg);
  client.close();
});

client.on('message', (msg) => {
  console.log(msg.toString());
});

client.on('listening', () => {
  var clientAddress = client.address().address;
  var clientPort = client.address().port;
  var listeningMsg = "client listening " + clientAddress + ":" + clientPort;
  console.log(listeningMsg);
});

const msgIsValid = msg => {
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