const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chat = new Schema({
    message: String,
    sender: String
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", chat);

module.exports = Chat;