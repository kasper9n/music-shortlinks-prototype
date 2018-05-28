module.exports = (app) => {

    app.use("/user", (req, res, next) => {
        if (req.method == "GET") {
            if (!res.locals.loggedIn) return res.redirect("/login");
            next();
        }
    });

    app.get("/user", (req, res) => {
        app.renderPage(res, "user");
    });
}
