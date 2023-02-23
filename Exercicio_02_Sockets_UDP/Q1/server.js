const udp = require('dgram');
const server = udp.createSocket('udp4');

const svrPort = 4000;
const svrAddress = '127.0.0.1';
const clientPort = 4001;
const clientAddress = '127.0.0.1';

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.addListener('line', line => {
  var data = Buffer.from(line);
  server.send(data, clientPort, clientAddress, function (err) {
    if (err) {
      console.error(err.stack);
      server.close();
    }
  });
});

server.on('error', (err) => {
  var errMsg = "server error:\n" + err.stack;
  console.error(errMsg);
  server.close();
});

server.on('message', (msg) => {
  console.log("Cliente: " + msg.toString());
});

server.on('listening', () => {
  const address = server.address();
  var port = address.port;
  var listeningMsg = "server listening " + address.address + ":" + port;
  console.log(listeningMsg);
});

server.bind(svrPort, svrAddress);