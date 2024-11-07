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