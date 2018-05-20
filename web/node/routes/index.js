const randomId = require("random-id");
const formatDate = requireLocal("format-date");
module.exports = (app) => {
    app.get("*", (req, res, next) => {
        res.variables = {};
        next();
    });
    app.post("*", (req, res, next) => {
        res.variables = {};

        res.err = (code, msg, err) => {
            if (!err && typeof msg != "string") err = msg;
            if (code.toString().startsWith(2)) msg = "Unknown error";
            console.log([
                `----- =-=-=-=-=-=-=-=- ERROR -=-=-=-=-=-=-=-= -----`,
                `  referenceId: ${randomId(20, "aA0")}`.cyan,
                `  date: ${formatDate("YYYY MMM D hh:mm:ss.xxxx")}`.cyan,
                `  code: ${code}`.cyan,
                `  msg: ${msg}`.cyan,
                `  stack: ${err || new Error().stack}`.cyan,
                `^^^^^ ================ ERROR ================ ^^^^^`,
            ].join("\n"));
            // console.log(
            //     `----- =-=-=-=-=-=-=-=- ERROR -=-=-=-=-=-=-=-= -----`
            //     +(
            //          `\nreferenceId: ${randomId(20, "aA0")}`
            //         +`\ndate: ${formatDate("YYYY MMM D hh:mm:ss.xxxx")}`
            //         +`\ncode: ${code}`
            //         +`\nmsg: ${msg}`
            //         +`\nstack: ${err || new Error().stack}`
            //     ).cyan
            //     +`\n^^^^^ ================ ERROR ================ ^^^^^`
            // );
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
