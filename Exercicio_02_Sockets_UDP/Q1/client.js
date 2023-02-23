const udp = require('dgram');
const client = udp.createSocket('udp4');

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
  client.send(data, svrPort, svrAddress, function (err) {
    if (err) {
      console.error(err.stack);
      client.close();
    }
  });
});

client.on('error', (err) => {
  var errMsg = "client error:\n" + err.stack;
  console.error(errMsg);
  client.close();
});

client.on('message', (msg) => {
  console.log("Servidor: " + msg.toString());
});

client.on('listening', () => {
  const address = client.address();
  var port = address.port;
  var listeningMsg = "client listening " + address.address + ":" + port;
  console.log(listeningMsg);
});

client.bind(clientPort, clientAddress);