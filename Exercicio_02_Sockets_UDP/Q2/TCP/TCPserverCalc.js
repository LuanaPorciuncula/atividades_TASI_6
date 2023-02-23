const net = require('net');

const svrPort = 4000;
const svrAddress = '127.0.0.1';


const handleConnection = socket => {
  console.log("Conexão com cliente");
  socket.on('end', () => {
    console.log("Desconectou");
  });

  socket.on('error', (err) => {
    console.error(err.stack);
  });

  socket.on('data', data => {
    var msg = data.toString();
    console.log(msg);
    var operation = msg.split(' ');
    var ans = calculator(parseInt(operation[0]),operation[1], parseInt(operation[2]));
    socket.write(msg + " = " + ans);
  });
};

const calculator = (int0, opr, int1) => {
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

const server = net.createServer(handleConnection);

server.listen(svrPort, svrAddress);