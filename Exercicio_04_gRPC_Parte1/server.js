const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("calculator.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const calcPkg = grpcObject.Calculator;

const svrPort = 4000;
const svrAddress = '127.0.0.1';

const server = new grpc.Server();
server.bind(svrAddress + ":" + svrPort,
  grpc.ServerCredentials.createInsecure());

server.addService(calcPkg.service,
  {
    "calculate": calculate
  });
server.start();

function calculate(call, callback) {
  var int0 = call.request.int0;
  var int1 = call.request.int1;
  var opr = call.request.operator;
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
  console.log(int0 + " " + opr + " " + int1 + " = " + ans);

  const solvedOperation = {
    "int0": int0,
    "int1": int1,
    "operator": opr,
    "result": ans
  }

  callback(null, solvedOperation);
}
