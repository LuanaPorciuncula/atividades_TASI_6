const net = require('net');
const Marshaller = require('../Marshaller');
const UnMarshaller = require('../UnMarshaller');

function ClientInvokerTCP() {
  this.serverPort = null;
  this.serverAddress = null;
  this.client = null;
  this.marshaller = null;
  this.unMarshaller = null;
}

ClientInvokerTCP.prototype.init = function (port, adress) {
  this.serverPort = port;
  this.serverAddress = adress;
  this.client = new net.Socket();
  this.marshaller = new Marshaller();
  this.unMarshaller = new UnMarshaller();
  
  this.client.connect(this.serverPort, this.serverAddress, () => {
    this.client.on('data', data => {
      var solvedOper = this.unMarshaller.unMarshal(data);
      var answer = solvedOper.int0 + " " + solvedOper.operator + " " +  solvedOper.int1 + " = " + solvedOper.ans;
      console.log(answer);
    });
    
    this.client.on('error', (err) => {
      console.error(err.stack);
    });
  });
};

ClientInvokerTCP.prototype.calculate = function (int0, opr, int1) {
  var data = this.marshaller.marshal(int0, opr, int1);
  this.client.write(data);
}

module.exports = ClientInvokerTCP;