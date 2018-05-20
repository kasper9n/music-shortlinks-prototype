const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const keys = requireLocal("keys");
const User = requireLocal("mongoose-models").User;

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((resultUser) => {
        done(null, resultUser);
    });
});

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, (username, password, done) => {
    User.findOne({ username: username }, function(err, resultUser) {
        if (err) return done(err);
        if (!resultUser) return done(null, false, "incorrect email");
        // match password
        bcrypt.compare(password, resultUser.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) return done(null, resultUser);
            if (!isMatch) return done(null, false, "incorrect password");
        });

    });
}));

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

module.exports = (app) => {
    app.use(session({
        secret: keys.passportSessionStoreSecret,
        store: new MongoStore({
            mongooseConnection: require("mongoose").connection,
            ttl: 60*60*24*365,
            touchAfter: 60*60*24
        }),
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}
