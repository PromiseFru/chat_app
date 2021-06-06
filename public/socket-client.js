$(document).ready(function () {
    // Form submittion with new message in field with id 'm'
    $('#send').click(function () {
        var messageToSend = $('#m').val();
        socket.emit('chat message', messageToSend);
        $('#m').val('');
        return false; // prevent form submit from refreshing page
    });

    let socket = io();
    socket.on('user', data => {
        $('#num-users').text(data.currentUsers < 2 ? data.currentUsers + ' user is' : data.currentUsers + ' users are');
        let message =
            data.nickname +
            (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').html('<b>' + message + '</b>'));
    });

    socket.on('chat message', (data) => {
        $('#messages').append($('<li>').text(`${data.nickname}: ${data.message}`));
    });
});