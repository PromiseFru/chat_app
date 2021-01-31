const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('cleint connected');
});

io.on('disconnect', (socket) => {
    console.log('client disconnected');
});

server.listen(3000, console.log(`waiting for clients ...`));