"use strict";
global.Error.stackTraceLimit = 50;

function addColor(name, start, end = "\x1b[0m") {
    global.String.prototype.__defineGetter__(name, function() {
        let str = this;
        str.replace("\n", end+start);
        if (this.endsWith(end)) str= start+this;
        else str = start+this+end;
        return str;
    });
}
addColor("red", "\x1b[41m");
addColor("cyan", "\x1b[36m");
addColor("bright", "\x1b[1m");
console.log("hey".bright.cyan);

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
//
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
//
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"

const express = require("express");
const path = require("path");
global.requireLocal = (filePath) => {
    return require(path.resolve(__dirname, "node", filePath));
}
const keys = requireLocal("keys");
global.dir = (...paths) => {
    return path.resolve(__dirname, ...paths);
}
global.combineDir = (...paths) => {
    return path.resolve(...paths);
}
global.logErr = require("./node/log-err.js");

const app = express();

// load view engine
app.set("views", dir("pug"));
app.set("view engine", "pug");

// static content
app.use("/", express.static(dir("static"), { redirect: false }));
// app.use("/i/", express.static(dir("images"), { redirect: false }));
// app.use("/pp/", express.static(dir("profile-pictures"), { redirect: false }));
// app.use("/", express.static(dir("static/favicon"), { redirect: false }));

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ type: "application/json" }));

// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://db/sacral");
const db = mongoose.connection;
const dbSuc = "\x1b[42m[Mongoose]\x1b[0m ";
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(dbSuc+"connected to MongoDB");
});
// console.log(mongoose);

// passport
require("./node/passport.js")(app, mongoose);

// jwt auth
app.use((req, res, next) => {
    const token = req.headers.authentication;
    if (token) {
        jwt.verify(token, keys.jsonWebTokenSecret, (err, jwtData) => {
            if (err) {
                req.userId = null;
                req.loggedIn = false;
            } else {
                req.userId = jwtData.userId;
                req.loggedIn = true;
            }
            next();
        });
    } else {
        next();
    }
});

app.renderPage = (res, file) => {
    console.log(file);
    app.render(file, res.variables, (err, html) => {
        if (err) return;
        res.variables.pageHTML = html;
        res.render("template", res.variables);
    });
};
const fs = require("fs");
function recursiveReaddir(folder, callback) {
    fs.readdir(folder, (err, items) => {
        if (err) return logErr(101, "Error reading routes folder");
        for (let i = 0; i < items.length; i++) {
            if (items[i].endsWith(".js")) {
                callback(`${folder}/${items[i]}`);
            } else {
                recursiveReaddir(`${folder}/${items[i]}`, callback);
            }
        }
    });
}
recursiveReaddir("node/routes", (filePath) => {
    require("./"+filePath)(app);
});

const PORT_WEB = process.env.PORT_WEB;
app.listen(PORT_WEB, () => {
    if (process.env.APP_ENV == "production") {
        console.log(`Express server listening at port ${PORT_WEB}`);
    }
});
