const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = requireLocal("mongoose-models");
const keys = requireLocal("keys");

module.exports = (app) => {
    app.get("/login", (req, res) => {
        if (res.locals.loggedIn) return res.redirect("/user");
        app.renderPage(res, "login");
    });

    app.post("/login", (req, res) => {
        passport.authenticate("local", (err, user, info = {}) => {
            if (!user) {
                const msg = info.message;
                let code = info.code;
                if (!code) code = 1014;
                return res.err(code, msg, err);
            }
            req.login(user, err => {
                if (err) return res.err(2012, err);
                res.suc();
            });
        })(req, res);
    });
}
