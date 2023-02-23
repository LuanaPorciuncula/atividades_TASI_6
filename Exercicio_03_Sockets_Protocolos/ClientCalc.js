const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var ClientInvoker = require('./UDP/clientInvokerUDP');

rl.question("Digite [1] para UDP e [2] para TCP\n", (answer) => {
  switch (answer) {
    case "1":
      ClientInvoker = require('./UDP/clientInvokerUDP');
      console.log("UDP selecionado!");
      break;
    case "2":
      ClientInvoker = require('./TCP/clientInvokerTCP');
      console.log("TCP selecionado!");
      break;
    default:
      console.log("Resposta inválida. Utilizando padrão: UDP");
      break;
  }
  startCalc();
});

function startCalc() {
  const svrPort = 4000;
  const svrAddress = '127.0.0.1';
  
  console.log("operações disponíveis :");
  console.log(" - adição: [+]");
  console.log(" - subtração: [-]");
  console.log(" - multiplicação: [*]");
  console.log(" - divisão: [/]");
  console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");
  
  let clientInvoker = new ClientInvoker();
  clientInvoker.init(svrPort,svrAddress);
  rl.addListener('line', line => {
    if (msgIsValid(line)) {
      var operation = line.split(' ');
      var int0 = parseInt(operation[0]);
      var opr = operation[1]
      var int1 = parseInt(operation[2]);
      
      clientInvoker.calculate(int0, opr, int1);
    } else {
      console.log("Formato inválido");
      console.log("Digite a operação a ser feita no formato \"[inteiro] [operação] [inteiro]\"");
    }
  });

}

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