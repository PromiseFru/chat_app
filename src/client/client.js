const url = 'http://localhost:3000'
const client = require('socket.io-client')(url);

client.on('connect', () => {
    console.log('connected to server');
});

client.on('disconnect', () => {
    client.emit('disconnect');
});

