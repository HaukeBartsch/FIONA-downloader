//import { remote, ipcRenderer } from 'electron/main'

const submitFormButton = document.querySelector("#submit-login-form");
const username = document.querySelector("#fionaUsername");
const password = document.querySelector("#fionaPassword");

submitFormButton.addEventListener("click", function(event) {
    var un = username.value;
    var pw = password.value;
    console.log(window.myAPI.desktop);
    window.myAPI.gotCredentials(un, pw); // send them to main.js
    //ipcRenderer.send("form-submission", un, pw);
    //window.electron.getLoginCredentials(un, pw);
    // close this window?
});

const closeButton = document.querySelector("button.btn-close");
closeButton.addEventListener("click", function() {
    // close this window
    window.myAPI.closeDialog();
});

window.myAPI.setBootstrapTheme((event, value) => {
    // set-bootstrap-theme
    document.documentElement.setAttribute('data-bs-theme',value);
    // change the close button and remove white etc..
    console.log("got a myAPI set bootstrap theme with " + JSON.stringify(value));
    // switch the button class
    if (value == "dark") {
        closeButton.classList.add("btn-close-white");
    } else {
        closeButton.classList.remove("btn-close-white");
    }
})