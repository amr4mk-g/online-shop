"use strict";
const URL = "http://localhost:500/api/";

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const login = document.getElementById("login-btn");
const signup = document.getElementById("signup-btn");

signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

login.addEventListener('click', event =>{
    event.preventDefault();
    let email = document.getElementById('login-email').value.trim();
    let pass = document.getElementById('login-pass').value.trim();
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
        alert("This email is invalid!");
        return;
    } else if (pass.length < 5) {
        alert("Password must be at least 5 characters!");
        return;
    } 

    login.disabled = true;
    let data = {"email": email, "password": pass}; 
    let options = {
        method: 'POST', body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    };
    fetch(URL+"users/login", options)
        .then(res => res.json())
        .then(res => { 
            saveData(res);
            login.disabled = false;
        }).catch(err => { alert("Wrong password, please try again"); });
});

signup.addEventListener('click', event =>{
    event.preventDefault();
    let fname = document.getElementById('signup-fname').value.trim();
    let lname = document.getElementById('signup-lname').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let pass = document.getElementById('signup-pass').value.trim();
    if (fname.length == 0) {
        alert("You must enter your first name!");
        return;
    } else if (lname.length == 0) {
        alert("You must enter your last name!");
        return;
    } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
        alert("This email is invalid!");
        return;
    } else if (pass.length < 5) {
        alert("Password must be at least 5 characters!");
        return;
    }

    signup.disabled = true;
    let data = {"first_name": fname, "last_name": lname, "email": email, "password": pass}; 
    let options = {
        method: 'POST', body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    };
    fetch(URL+"users/register", options)
        .then(res => res.json())
        .then(res => { 
            saveData(res);
            signup.disabled = false;
        }).catch(err => { alert("Wrong password, please try again"); });
});

function saveData(data) {
    if (!data.token) {
        alert("Something went wrong, please try again");
    } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data._id);
        window.location.href = 'checkout.html';
    }
}
