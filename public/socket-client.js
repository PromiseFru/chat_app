$(document).ready(function () {
    // Form submittion with new message in field with id 'm'
    $('#msgForm').submit(function (e) {
        e.preventDefault();
        var messageToSend = $('#m').val();
        socket.emit('chat message', messageToSend);
        $('#m').val('');
    });

    let socket = io();
    socket.on('user', data => {
        let chats = data.chats
        $('#num-users').text(data.currentUsers < 2 ? data.currentUsers + ' user is' : data.currentUsers + ' users are');
        let message =
            data.nickname +
            (data.connected ? ' has joined the chat.' : ' has left the chat.');
        $('#messages').append($('<li>').html('<b>' + message + '</b>'));

        chats.forEach(element => {
            $('.list-unstyled.media-block').append($('<li>.mar-btm').html(
                `<div class="media-left">
                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture">
                </div>
                <div class="media-body pad-hor">
                    <div class="speech">
                        <a href="#" class="media-heading">${element.sender}</a>
                        <p>${element.message}</p>
                        <p class="speech-time">
                            <i class="fa fa-clock-o fa-fw"></i>${element.time}
                        </p>
                    </div>
                </div>`
            ));
        });
    });

    socket.on('chat message', (data) => {
        console.log(data);
        $('#messages').append($('<li>').text(`${data.sender}: ${data.message}`));
    });
});