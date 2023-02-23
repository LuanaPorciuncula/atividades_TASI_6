const net = require('net')

const handleConnection = socket => {
    clientConns.push(socket)
    var clientID
    var numMsgs = 0

    console.log("Conexão com cliente")
    socket.write("Message from server: Qual o seu nome?")

    socket.on('end', () => {
        console.log("Desconectou")
    })

    socket.on('data', data => {
        numMsgs++

        if (numMsgs == 1) {
            clientID = data.toString()
            clientIDs.push(clientID) 
        } else {
            rcvdMsg = clientID + ": " + data.toString()
            console.log(rcvdMsg)
    
            clientConns.forEach(clientConn => 
                {
                    if (clientConn != socket) {
                        clientConn.write(rcvdMsg)
                    }
                }
            );
        }       
    })
}

clientIDs = []
clientConns = []
const server = net.createServer(handleConnection)
server.listen(4000, '127.0.0.1')