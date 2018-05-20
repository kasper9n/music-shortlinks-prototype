let timeout, timedOut, mouseUppedYet, buttonEl;
document.addEventListener("mousedown", (e) => {
    if (e.target.nodeName == "BUTTON") {
        clearTimeout(timeout);
        buttonEl = e.target;
        buttonEl.classList.add("button-click");
        mouseUppedYet = false;
        timedOut = false;
        timeout = setTimeout(() => {
            if (mouseUppedYet) {
                buttonEl.classList.remove("button-click");
            } else {
                timedOut = true;
            }
        }, 280);
    }
});
document.addEventListener("mouseup", (e) => {
    mouseUppedYet = true;
    if (buttonEl && timedOut) buttonEl.classList.remove("button-click");
});
