$(document).ready(function () {
    fetch("/getChats").then((res) => {
        return res.json();
    }).then((data) => {
        let chats = data.chats;

        fetch("/whoami").then((res) => {
            return res.json();
        }).then((whoami) => {
            let sides = "";
            let speech_sides = "";

            for (let i = 0; i < chats.length; i++) {
                sides = whoami.user._id == chats[i].userId ? "right" : "left";
                speech_sides = whoami.user._id == chats[i].userId ? "speech-right" : ""

                    $('.list-unstyled.media-block').append($('<li>.mar-btm').html(
                        `<div class="media-${sides}">
                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture">
                        </div>
                        <div class="media-body pad-hor ${speech_sides}">
                            <div class="speech">
                                <a href="#" class="media-heading">${chats[i].sender}</a>
                                <p>${chats[i].message}</p>
                                <p class="speech-time">
                                    <i class="fa fa-clock-o fa-fw"></i>${chats[i].time}
                                    <i class="fa fa-calender-o fa-fw"></i>${chats[i].date}
                                </p>
                            </div>
                        </div>`
                    ));
            }
        });
    });
});