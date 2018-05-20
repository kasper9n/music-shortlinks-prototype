const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = requireLocal("mongoose-models");
const keys = requireLocal("keys");

module.exports = (app) => {
    app.get("/login", (req, res) => {
        app.renderPage(res, "login");
    });

    app.post("/login", (req, res) => {
        const usernameOrEmail = req.body.usernameOrEmail;
        const password = req.body.password;
        db.User.findOne({
            $or: [
                {email: usernameOrEmail},
                {username: usernameOrEmail.toLowerCase()},
            ],
        }, (err, resultUser) => {
            if (err) {
                res.err(2001, err);
            } else if (!resultUser) {
                res.err(1006, "No user has that username or email");
            } else if (resultUser) {

                bcrypt.compare(password, resultUser.password, (err, isMatch) => {
                    if (err) res.err(2002, err);
                    if (!isMatch) res.err(1008, "Incorrect password");
                    if (isMatch) {
                        passport.authenticate("local", (err, user, info) => {
                            if (err) return res.err(2003, err);
                            if (!user) res.err(2004, info);
                            if (!user) console.log("infooooooo:");
                            if (!user) console.log(info);
                            if (user) {
                                req.login(user, err => {
                                    if (err) return res.err(2004, err);
                                    res.suc();
                                });
                            }
                        });
                        // jwt.sign({
                        //     userId: resultUser._id,
                        // }, keys.jsonWebTokenSecret, {
                        //     expiresIn: "1y",
                        // }, (err, token) => {
                        //     if (err) return res.err(1009, "Unknown error");
                        //     res.suc({token:token});
                        // });
                    }
                });
            }
        });
    });
}
