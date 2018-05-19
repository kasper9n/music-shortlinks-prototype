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

// const imageSchema = new Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     imageId: String,
//     filename: String,
//     title: String,
//     description: String,
//     tags: [String],
//     date: {
//         type: Date,
//         default: () => {
//             return Date.now();
//         },
//     },
//     views: {
//         type: Number,
//         default: 0,
//     },
//     downloads: {
//         type: Number,
//         default: 0,
//     },
//     likes: {
//         type: Number,
//         default: 0,
//     },
// });

// const likeSchema = new Schema({
//     imageId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Image",
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     date: {
//         type: Date,
//         default: () => {
//             return Date.now();
//         },
//     },
//     endDate: {
//         type: Date,
//         default: () => {
//             return Date.now();
//         },
//     },
// });

module.exports = {
    User: mongoose.model("User", userSchema),
    // Image: mongoose.model("Image", imageSchema),
    // Like: mongoose.model("Like", likeSchema),
    // Download: mongoose.model("Download", downloadSchema),
    // View: mongoose.model("View", viewSchema),
    // Follow: mongoose.model("Follow", followSchema),
};
