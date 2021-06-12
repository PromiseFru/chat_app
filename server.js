"use strict";
require('dotenv').config()
const express = require("express");
var routes = require('./routes/routes.js');
var passport = require('./passport.js');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const URI = process.env.DB_URL;
const store = new MongoStore({
    url: URI,
    dbName: process.env.DB_NAME
});

let MongoDB = require("./database").MongoDB;
const db = new MongoDB();
const User = db.models.users;
const Chat = db.models.chats;

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/", express.static(process.cwd() + "/views/html"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
// app.set('view engine', 'pug');

io.use(
    passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        store: store,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    })
);

passport(app);

routes(app);

app.use((req, res, next) => {
    res.status(404)
        .type('text')
        .send('Not Found')
})

let currentUsers = 0;

io.on('connection', async (socket) => {
    console.log('A user has connected');
    ++currentUsers;

    socket.broadcast.emit('user', {
        nickname: socket.request.user.nickname,
        currentUsers,
        connected: true
    });

    socket.on('chat message', async (message) => {
        let newChat = await Chat.create({
            message: message,
            sender: socket.request.user.nickname,
            userId: socket.request.user.id,
            date: new Date().toDateString(),
            time: formatAMPM(new Date())
        }).catch(err => {
            next(err);
        });

        io.emit('chat message', {
            message: newChat.message,
            sender: newChat.sender,
            userId: newChat.userId,
            date: newChat.date,
            time: newChat.time
        });
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected');
        --currentUsers;
        io.emit('user', {
            nickname: socket.request.user.nickname,
            currentUsers,
            connected: false
        });
    });
});


function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
}

http.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + process.env.PORT);
});