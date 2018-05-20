document.addEventListener("click", e => {
    if (e.target.classList.contains("login")) {
        const usernameOrEmail = document.querySelector("input.username-or-email").value;
        const password = document.querySelector("input.password").value;
        const req = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };
        xhr(req, "/login", (res) => {
            console.log(res);
        });
    }
});
