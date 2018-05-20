const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const keys = requireLocal("keys");
const db = requireLocal("mongoose-models");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    db.User.findById(id).then((resultUser) => {
        done(null, resultUser);
    });
});

passport.use(new LocalStrategy({
    usernameField: "usernameOrEmail",
    passwordField: "password",
}, (usernameOrEmail, password, done) => {
    db.User.findOne({
        $or: [
            {email: usernameOrEmail},
            {username: usernameOrEmail.toLowerCase()},
        ],
    }, (err, resultUser) => {
        // done(user, code, msg, err)
        if (err) return done(null, 2010, null, err);
        if (!resultUser) return done(null, 1010, "No user has that username or email");
        bcrypt.compare(password, resultUser.password, (err, isMatch) => {
            if (err) return done(null, 2011, err);
            if (!isMatch) return done(null, 1011, "Incorrect password");
            done(resultUser);
        });
        // if (err) return done(2001, err);
        // if (!resultUser) return done(1010, "No user has that username or email");
        // bcrypt.compare(password, resultUser.password, (err, isMatch) => {
        //     if (err) return done(2010, err);
        //     if (isMatch) return done(null, resultUser);
        //     if (!isMatch) return done(null, false, "Incorrect password");
        // });



    });

    // User.findOne({ username: username }, function(err, resultUser) {
    //     if (err) return done(err);
    //     if (!resultUser) return done(null, false, "Incorrect email");
    //     // match password
    //     bcrypt.compare(password, resultUser.password, (err, isMatch) => {
    //         if (err) return done(err, false, "Unknown error");
    //         if (isMatch) return done(null, resultUser);
    //         if (!isMatch) return done(null, false, "Incorrect password");
    //     });
    // });
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
