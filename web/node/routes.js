const fs = require("fs");
const randomId = require("random-id");
const formatDate = requireLocal("format-date");
module.exports = (app) => {
    app.renderPage = (res, file) => {
        const variables = res.locals;
        variables.page = file;
        variables.random = Math.ceil(Math.random()*1000);
        app.render(file, variables, (err, html) => {
            if (err) return;
            variables.pageHTML = html;
            res.render("template", variables);
        });
    };

    app.use("/", (req, res, next) => {
        if (req.user) res.locals.loggedIn = true;
        else res.locals.loggedIn = false;

        if (req.method == "GET") {
            res.variables = {};
        } else if (req.method == "POST") {
            res.variables = {};

            res.err = (code, msg, err) => {
                if (!err && typeof msg != "string") err = msg;
                if (code.toString().startsWith(2)) msg = "Unknown error";

                console.log(
                    "-------------------- ".bold+"ERROR".bold.red+" --------------------\n".bold+
                    [
                        "referenceId: "+randomId(20, "aA0"),
                        "date: "+formatDate("YYYY MM D hh:mm:ss.xxxx"),
                        "code: "+code,
                        "msg: "+msg,
                        "err: "+(err || new Error().stack),
                    ].join("\n").bold.red+
                    "\n^^^^^^^^^^^^^^^^^^^^ ".bold+"ERROR".bold.red+" ^^^^^^^^^^^^^^^^^^^^".bold,
                );

                res.json({
                    err: true,
                    referenceId: "",
                    code: code,
                    msg: msg,
                });
            }

            res.suc = (data = {}) => {
                data.err = false;
                res.json(data);
            }

        }

        next();
    });

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
    recursiveReaddir(dir("node/routes"), (filePath) => {
        require(filePath)(app);
    });
}
