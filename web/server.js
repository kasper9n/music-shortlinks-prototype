"use strict";
const express = require("express");
const path = require("path");
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
    const file = require("./"+filePath);
    let route = filePath.replace(/^(node\/routes)/, "");
    route = route.replace(/(\.js)$/, "");
    route = route.replace(/(index)$/, "");
    for (const method in file) {
        app[method](route, file[method]);
    }
});

const PORT_WEB = process.env.PORT_WEB;
app.listen(PORT_WEB, () => {
    if (process.env.APP_ENV == "production") {
        console.log(`Express server listening at port ${PORT_WEB}`);
    }
});
