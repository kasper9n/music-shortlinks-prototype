global.Error.stackTraceLimit = 50;
"use strict";
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
