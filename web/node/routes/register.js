const bcrypt = require("bcryptjs");
const db = requireLocal("mongoose-models");

function generateHash(password, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return callback(1003);
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) return callback(1004);
            else callback(null, hashedPassword);
        });
    });
}

function register(user) {

    generateHash(user.password, (err, hashedPassword) => {
        if (err) return logErr(err, "Failed hashing password");
        user.password = hashedPassword;
        new db.User(user).save(err => {
            if (err) logErr(1002, "Error creating user");
            console.log("Success creating user "+user.username);
        });
    });

}
// register({
//     username: "kh",
//     displayname: "KH",
//     password: "123biscuit",
//     email: "kh@kasp.io",
// });

module.exports = (app) => {

}
