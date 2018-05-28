module.exports = (app) => {
    app.get("/user/links", (req, res) => {
        app.renderPage(res, "links");
    });
}
