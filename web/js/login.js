// login
function login() {
    const usernameOrEmail = document.querySelector("input.username-or-email").value;
    const password = document.querySelector("input.password").value;
    const req = {
        usernameOrEmail: usernameOrEmail,
        password: password,
    };
    xhr(req, "/login", (res) => {
        if (res.err) {
            console.log(res);
        } else {
            window.location = "/user";
        }
    });
}
// login button click
document.addEventListener("click", e => {
    if (e.target.classList.contains("login")) {
        login();
    }
});
// login page enter
document.addEventListener("keypress", e => {
    if (page == "login") {
        if (e.which == 13) { // enter
            login();
        }
    }
})
