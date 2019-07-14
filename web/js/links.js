document.addEventListener("click", (e) => {
    if (e.target.classList.contains("list-link")) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
