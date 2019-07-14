const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: String,
    displayname: String,
    username: {
        type: String,
        lowercase: true
    },
    email: String,
    dateCreated: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
});
const linkSchema = new Schema({
    coverURL: String,
    artist: String,
    title: String,
    sourceURL: String,
    linkDomain: String,
    linkPath: String,
    urls: [{
        service: String,
        url: String,
    }],
    dateCreated: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
});

module.exports = {
    User: mongoose.model("User", userSchema),
    Link: mongoose.model("Link", linkSchema),
};
