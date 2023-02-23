const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var ServerInvoker = require('./UDP/serverInvokerUDP');

rl.question("Digite [1] para UDP e [2] para TCP\n", (answer) => {
  switch (answer) {
    case "1":
      ServerInvoker = require('./UDP/serverInvokerUDP');
      console.log("UDP selecionado!");
      break;
    case "2":
      ServerInvoker = require('./TCP/serverInvokerTCP');
      console.log("TCP selecionado!");
      break;
    default:
      console.log("Resposta inválida. Utilizando padrão: UDP");
      break;
  }
  startCalcService();
});

function startCalcService () {
  const svrPort = 4000;
  const svrAddress = '127.0.0.1';
  
  let serverInvoker = new ServerInvoker();
  serverInvoker.init(svrPort, svrAddress, calculator);
  serverInvoker.calculate();
  
  function calculator(int0, opr, int1) {
    var ans;
    switch (opr) {
      case '+':
        ans = int0 + int1;
        break;
      case '-':
        ans = int0 - int1;
        break;
      case '*':
        ans = int0 * int1;
        break;
      case '/':
        ans = int0 / int1;
        break;
      default:
        break;
    }
    return ans;
  }  
}