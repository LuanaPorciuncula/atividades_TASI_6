const udp = require('dgram');
const client = udp.createSocket('udp4');
const Marshaller = require('../Marshaller');
const UnMarshaller = require('../UnMarshaller');

function ClientInvokerUDP() {
  this.serverPort = null;
  this.serverAddress = null;
  this.marshaller = null;
  this.unMarshaller = null;
}

ClientInvokerUDP.prototype.init = function (port, adress) {
  this.serverPort = port;
  this.serverAddress = adress;
  this.marshaller = new Marshaller();
  this.unMarshaller = new UnMarshaller();

  client.on('error', (err) => {
    var errMsg = "client error:\n" + err.stack;
    console.error(errMsg);
    client.close();
  });

  client.on('listening', () => {
    var clientAddress = client.address().address;
    var clientPort = client.address().port;
    var listeningMsg = "client listening " + clientAddress + ":" + clientPort;
    console.log(listeningMsg);
  });

  client.on('message', (msg) => {
    var solvedOper = this.unMarshaller.unMarshal(msg);
    var answer = solvedOper.int0 + " " + solvedOper.operator + " " +  solvedOper.int1 + " = " + solvedOper.ans;
    console.log(answer);
  });
};

ClientInvokerUDP.prototype.calculate = function (int0, opr, int1) {
  var data = this.marshaller.marshal(int0, opr, int1);
  
  client.send(data, this.serverPort, this.serverAddress, function (err) {
    if (err) {
      console.error(err.stack);
      client.close();
    }
  });
  console.log("Aguardando resultado...");
}

module.exports = ClientInvokerUDP;