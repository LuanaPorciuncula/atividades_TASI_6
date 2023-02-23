const net = require('net');
const Marshaller = require('../Marshaller');
const UnMarshaller = require('../UnMarshaller');

function ServerInvokerTCP() {
  this.serverPort = null;
  this.serverAddress = null;
  this.calculator = null;
  this.handleConnection = null;
  this.marshaller = null;
  this.unMarshaller = null;
}

ServerInvokerTCP.prototype.init = function (port, adress, calculator) {
  this.serverPort = port;
  this.serverAddress = adress;
  this.calculator = calculator;
  this.marshaller = new Marshaller();
  this.unMarshaller = new UnMarshaller();

  this.handleConnection = socket => {
    console.log("Conexão com cliente");
    socket.on('end', () => {
      console.log("Desconectou");
    });
  
    socket.on('error', (err) => {
      console.error(err.stack);
    });
  
    socket.on('data', data => {
      var operation = this.unMarshaller.unMarshal(data);
      console.log(operation.int0, operation.operator, operation.int1);
      var ans = this.calculator(operation.int0, operation.operator, operation.int1);
      console.log(ans);
      var reply = this.marshaller.marshal(operation.int0, operation.operator, operation.int1, ans);
      socket.write(reply);
    });
  };
};

ServerInvokerTCP.prototype.calculate = function () {
  const server = net.createServer(this.handleConnection);
  
  server.listen(this.serverPort, this.serverAddress);
}

module.exports = ServerInvokerTCP;
