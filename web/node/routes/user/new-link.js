const db = requireLocal("mongoose-models");
const validator = require("validator");
module.exports = (app) => {
    app.get("/user/new-link", (req, res) => {
        app.renderPage(res, "new-link");
    });

    app.post("/new-link", (req, res) => {
        if (!req.body.title)        return res.err(3010, "No title provided");
        if (!req.body.artist)       return res.err(3011, "No artist provided");
        if (!req.body.coverURL)     return res.err(3012, "No coverURL provided");
        if (!req.body.sourceURL)    return res.err(3013, "No sourceURL provided");
        if (!req.body.linkDomain)   return res.err(3014, "No linkDomain provided");
        if (!req.body.linkPath)     return res.err(3015, "No linkPath provided");
        if (!req.body.urls)         return res.err(3016, "No urls provided");

        if (typeof req.body.title != "string") {
            return res.err(3000, "invalid title");
        }
        if (typeof req.body.artist != "string") {
            return res.err(3000, "invalid artist");
        }
        if (!validator.isURL(req.body.coverURL)) {
            return res.err(3001, "No cover URL provided");
        }
        if (!validator.isURL(req.body.sourceURL)) {
            return res.err(3002, "No source URL provided");
        }
        if (req.body.linkDomain != "sacr.cf") {
            return res.err(3003, "Invalid link domain");
        }
        if (req.body.linkPath.match(/[^a-zA-Z0-9_-]/g)) {
            return res.err(3004, "Invalid link path");
        }
        if (Array.isArray(req.body.urls)) {
            return res.err(3005, "Invalid urls array");
        }
        for (let i = 0; i < req.body.urls.length; i++) {
            if (typeof req.body.urls[i] != "object") {
                return res.err(3006, "Invalid object in urls array", req.body.urls);
            }
            if (typeof req.body.urls[i].service != "string") {
                return res.err(3006, "Invalid service in object in urls array", req.body.urls);
            }
            if (validator.isURL(req.body.urls[i].url)) {
                return res.err(3006, "Invalid url in object in urls array", req.body.urls);
            }
        }
        const newLink = new db.Link(req.body);
        newLink.save(err => {
            if (err) return logErr(1032, "Error creating link");
            console.log("Success creating link with id "+newLink._id);
            res.suc({
                linkId: newLink._id,
            });
        });
    });
}
