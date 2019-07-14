// select result link text on click
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("result-link")) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});

document.addEventListener("input", (e) => {
    // link path regex
    if (e.target.nodeName == "INPUT" && e.target.classList.contains("link-path")) {
        const pathInput = document.querySelector("input.link-path");
        const path = pathInput.value;
        const newPath = path.replace(/[^a-zA-Z0-9_-]/g, "");
        if (newPath != path) pathInput.value = newPath;
    }
    // update result link
    if (
        (e.target.nodeName == "SELECT" && e.target.classList.contains("select-domain"))
        ||
        (e.target.nodeName == "INPUT" && e.target.classList.contains("link-path"))
    ) {
        const resultLink = document.querySelector(".result-link");
        const domain = document.querySelector("select.select-domain").value;
        const path = document.querySelector("input.link-path").value;
        resultLink.innerHTML = "https://"+domain+"/"+path;
    }
});

// fetch from SoundCloud


// save
function save() {
    const req = {
        title: document.querySelector(".fetched-data-container .title"),
        artist: document.querySelector(".fetched-data-container .artist"),
        coverURL: document.querySelector(".fetched-data-container .cover").getAttribute("src"),
        sourceURL: document.querySelector("input.source-url").value,
        linkDomain: document.querySelector("select.select-domain").value,
        linkPath: document.querySelector("input.link-path").value,
        urls: [],
    }
    const urls = document.querySelectorAll("input[data-service]");
    for (let i = 0; i < urls.length; i++) {
        req.urls[i] = {
            service: urls[i].dataset.service,
            url: urls[i].value,
        }
    }
    console.log(req);
    xhr(req, "/new-link", (res) => {
        if (res.err) {
            console.log(res);
        } else {
            // window.location = "/links";
        }
    });
}
// login button click
document.addEventListener("click", e => {
    if (e.target.classList.contains("new-link-save")) {
        save();
    }
});
