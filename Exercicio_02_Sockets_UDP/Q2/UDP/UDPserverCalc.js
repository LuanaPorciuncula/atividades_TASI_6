const udp = require('dgram');
const server = udp.createSocket('udp4');

const svrPort = 4000;
const svrAddress = '127.0.0.1';

server.on('error', (err) => {
  var errMsg = "server error:\n" + err.stack;
  console.error(errMsg);
  server.close();
});

server.on('message', (data, rinfo) => {
  var clientAddress = rinfo.address;
  var clientPort = rinfo.port;

  var msg = data.toString();
  console.log(msg);
  var operation = msg.split(' ');
  var ans = calculator(parseInt(operation[0]),operation[1], parseInt(operation[2]));
  var msgAns = msg + " = " + ans;

  server.send(msgAns, clientPort, clientAddress, function (err) {
    if (err) {
      console.error(err.stack);
      server.close();
    }
  });
});

server.on('listening', () => {
  var address = server.address();
  var port = address.port;
  var listeningMsg = "server listening " + address.address + ":" + port;
  console.log(listeningMsg);
});

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

server.bind(svrPort, svrAddress);