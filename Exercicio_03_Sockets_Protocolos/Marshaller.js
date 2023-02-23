function Marshaller() {
}

Marshaller.prototype.marshal = function (int0, opr, int1) {
  const operation = new Uint16Array(4);

  operation[0] = int0;
  operation[1] = opr.charCodeAt(0);
  operation[2] = int1;

  return Buffer.from(operation);
}

Marshaller.prototype.marshal = function (int0, opr, int1, ans) {
  const solvedOperation = new Uint16Array(4);

  solvedOperation[0] = int0;
  solvedOperation[1] = opr.charCodeAt(0);
  solvedOperation[2] = int1;
  solvedOperation[3] = ans;

  return Buffer.from(solvedOperation);
}

module.exports = Marshaller;