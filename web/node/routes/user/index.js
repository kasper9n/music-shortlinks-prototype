module.exports = (app) => {
    app.get("/user", (req, res) => {
        if (!res.locals.loggedIn) return res.redirect("/login");
        app.renderPage(res, "user");
    });
}
