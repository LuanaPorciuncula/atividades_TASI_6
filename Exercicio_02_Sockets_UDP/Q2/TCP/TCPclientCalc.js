const net = require('net');
const readline = require('readline');

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
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

const client = new net.Socket();
client.connect(svrPort, svrAddress, () => {
  console.log("Conexão estabelecida com o servidor!");
  console.log("operações disponíveis :");
  console.log(" - adição: [+]");
  console.log(" - subtração: [-]");
  console.log(" - multiplicação: [*]");
  console.log(" - divisão: [/]");
  console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");

  rl.addListener('line', line => {
    if (msgIsValid(line)) {
      client.write(line);
      console.log("Aguardando resultado...");
    } else {
      console.log("Formato inválido");
      console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");
    }
  });

  client.on('data', data => {
    console.log(data.toString())
  });
  
  client.on('error', (err) => {
    console.error(err.stack);
  });
});