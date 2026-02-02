"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_page_1 = require("./login-page");
var loginElements = {
    usernameInput: "#username",
    passwordInput: "#password",
    submitButton: "#submit-btn"
};
var loginPage = new login_page_1.default(loginElements);
loginPage.performLogin("test_user", "secure_password");
