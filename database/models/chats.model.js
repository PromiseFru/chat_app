const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chat = new Schema({
    message: String,
    sender: String,
    userId: String,
    date: String,
    time: String
});

const Chat = mongoose.model("Chat", chat);

module.exports = Chat;