const udp = require('dgram');
const server = udp.createSocket('udp4');
const Marshaller = require('../Marshaller');
const UnMarshaller = require('../UnMarshaller');

function ServerInvokerUDP() {
  this.serverPort = null;
  this.serverAddress = null;
  this.calculator = null;
  this.marshaller = null;
  this.unMarshaller = null;
}

ServerInvokerUDP.prototype.init = function (port, adress, calculator) {
  this.serverPort = port;
  this.serverAddress = adress;
  this.calculator = calculator;
  this.marshaller = new Marshaller();
  this.unMarshaller = new UnMarshaller();

  server.on('error', (err) => {
    var errMsg = "server error:\n" + err.stack;
    console.error(errMsg);
    server.close();
  });

  server.on('listening', () => {
    var address = server.address();
    var port = address.port;
    var listeningMsg = "server listening " + address.address + ":" + port;
    console.log(listeningMsg);
  });

  server.bind(this.serverPort, this.serverAddress);
};

ServerInvokerUDP.prototype.calculate = function () {
  server.on('message', (data, rinfo) => {
    var clientAddress = rinfo.address;
    var clientPort = rinfo.port;

    var operation = this.unMarshaller.unMarshal(data);
    console.log(operation.int0, operation.operator, operation.int1);
    var ans = this.calculator(operation.int0, operation.operator, operation.int1);
    console.log(ans);
    var data = this.marshaller.marshal(operation.int0, operation.operator, operation.int1, ans);
    server.send(data, clientPort, clientAddress, function (err) {
      if (err) {
        console.error(err.stack);
        server.close();
      }
    });
  });
}

module.exports = ServerInvokerUDP;
