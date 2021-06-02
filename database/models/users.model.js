const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    username: String,
    nickname: String,
    password: String
});

const User = mongoose.model("User", user);

module.exports = User;