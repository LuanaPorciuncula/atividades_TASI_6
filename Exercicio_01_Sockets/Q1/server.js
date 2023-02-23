const net = require('net')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const handleConnection = socket => {
    console.log("Conexão com cliente")
    socket.on('end', () => {
        console.log("Desconectou")
    })

    socket.on('data', data => {
        console.log(data.toString())
    })

    rl.addListener('line', line => {
        socket.write(line)
    })
}

const server = net.createServer(handleConnection)

server.listen(4000, '127.0.0.1')