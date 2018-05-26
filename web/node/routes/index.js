const randomId = require("random-id");
const formatDate = requireLocal("format-date");
module.exports = (app) => {
    app.renderPage = (res, file) => {
        const variables = res.locals;
        variables.page = file;
        app.render(file, variables, (err, html) => {
            if (err) return;
            variables.pageHTML = html;
            res.render("template", variables);
        });
    };

    app.all("*", (req, res, next) => {
        if (req.user) {
            res.locals.loggedIn = true;
        } else {
            res.locals.loggedIn = false;
        }
        next();
    });

    app.get("*", (req, res, next) => {
        res.variables = {};
        next();
    });

    app.post("*", (req, res, next) => {
        res.variables = {};

        res.err = (code, msg, err) => {
            if (!err && typeof msg != "string") err = msg;
            if (code.toString().startsWith(2)) msg = "Unknown error";
            // const errorMessage =
            //     `referenceId: ${randomId(20, "aA0")}`+
            //     `\ndate: ${formatDate("YYYY MMM D hh:mm:ss.xxxx")}`+
            //     `\ncode: ${code}`+
            //     `\nmsg: ${msg}`+
            //     `\nerr: ${err || new Error().stack}`;
            // console.log(
            //     "-------------------- ".bold+"ERROR".errColor+" --------------------".bold+
            //     "\n"+errorMessage.errColor+
            //     "\n^^^^^^^^^^^^^^^^^^^^ ".bold+"ERROR".errColor+" ^^^^^^^^^^^^^^^^^^^^".bold
            // );

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

        next();
    });
}
