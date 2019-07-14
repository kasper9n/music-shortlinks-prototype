/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);
__webpack_require__(2)("focus-within");
__webpack_require__(3);

__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.xhr = function (reqContent, url) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments[3];

    if (typeof options == "function") callback = options;
    if (typeof options == "function") options = {};
    if (options.type == undefined) options.type = "POST";
    if (options.contentType == undefined) options.contentType = "json";
    var xhr = new XMLHttpRequest();
    xhr.open(options.type, url, true);
    if (options.type == "GET") {
        xhr.send();
    } else if (options.contentType == "form") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("data=" + JSON.stringify(reqContent));
    } else if (options.contentType == "json") {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(reqContent));
    } else if (options.contentType == "none") {
        xhr.send(reqContent);
        // for file uploads (multipart/form-data)
    } else if (options.contentType) {
        xhr.setRequestHeader("Content-type", options.contentType);
        xhr.send(reqContent);
    }
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            var err = null;
            if (!String(this.status).startsWith("2")) {
                console.error("HTTP error " + this.status);
                err = this.status;
            }
            callback(res, err);
        }
    };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (className) {
    if (!className) className = "focus-within";
    var focusedElements = [];
    function update() {
        var focusedElement;
        while (focusedElement = focusedElements.pop()) {
            focusedElement.classList.remove(className);
        }

        // add .focus-within if document has focus,
        var activeElement = document.activeElement;
        while (document.hasFocus() && activeElement.nodeName != "#document") {
            activeElement.classList.add(className);
            focusedElements.push(activeElement);
            activeElement = activeElement.parentNode;
        }
    }

    document.addEventListener("focus", update, true);
    document.addEventListener("blur", update, true);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var timeout = void 0,
    timedOut = void 0,
    mouseUppedYet = void 0,
    buttonEl = void 0;
document.addEventListener("mousedown", function (e) {
    if (e.target.nodeName == "BUTTON") {
        clearTimeout(timeout);
        buttonEl = e.target;
        buttonEl.classList.add("button-click");
        mouseUppedYet = false;
        timedOut = false;
        timeout = setTimeout(function () {
            if (mouseUppedYet) {
                buttonEl.classList.remove("button-click");
            } else {
                timedOut = true;
            }
        }, 280);
    }
});
document.addEventListener("mouseup", function (e) {
    mouseUppedYet = true;
    if (buttonEl && timedOut) buttonEl.classList.remove("button-click");
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// login
function login() {
    var usernameOrEmail = document.querySelector("input.username-or-email").value;
    var password = document.querySelector("input.password").value;
    var req = {
        usernameOrEmail: usernameOrEmail,
        password: password
    };
    xhr(req, "/login", function (res) {
        if (res.err) {
            console.log(res);
        } else {
            window.location = "/user";
        }
    });
}
// login button click
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("login")) {
        login();
    }
});
// login page enter
document.addEventListener("keypress", function (e) {
    if (page == "login") {
        if (e.which == 13) {
            // enter
            login();
        }
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener("click", function (e) {
    if (e.target.classList.contains("list-link")) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// select result link text on click
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("result-link")) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});

document.addEventListener("input", function (e) {
    // link path regex
    if (e.target.nodeName == "INPUT" && e.target.classList.contains("link-path")) {
        var pathInput = document.querySelector("input.link-path");
        var path = pathInput.value;
        var newPath = path.replace(/[^a-zA-Z0-9_-]/g, "");
        if (newPath != path) pathInput.value = newPath;
    }
    // update result link
    if (e.target.nodeName == "SELECT" && e.target.classList.contains("select-domain") || e.target.nodeName == "INPUT" && e.target.classList.contains("link-path")) {
        var resultLink = document.querySelector(".result-link");
        var domain = document.querySelector("select.select-domain").value;
        var _path = document.querySelector("input.link-path").value;
        resultLink.innerHTML = "https://" + domain + "/" + _path;
    }
});

// fetch from SoundCloud


// save
function save() {
    var req = {
        title: document.querySelector(".fetched-data-container .title"),
        artist: document.querySelector(".fetched-data-container .artist"),
        coverURL: document.querySelector(".fetched-data-container .cover").getAttribute("src"),
        sourceURL: document.querySelector("input.source-url").value,
        linkDomain: document.querySelector("select.select-domain").value,
        linkPath: document.querySelector("input.link-path").value,
        urls: []
    };
    var urls = document.querySelectorAll("input[data-service]");
    for (var i = 0; i < urls.length; i++) {
        req.urls[i] = {
            service: urls[i].dataset.service,
            url: urls[i].value
        };
    }
    console.log(req);
    xhr(req, "/new-link", function (res) {
        if (res.err) {
            console.log(res);
        } else {
            // window.location = "/links";
        }
    });
}
// login button click
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("new-link-save")) {
        save();
    }
});

/***/ })
/******/ ]);