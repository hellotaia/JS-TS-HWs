"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoginPage = /** @class */ (function () {
    function LoginPage(elements) {
        this.elements = elements;
    }
    LoginPage.prototype.performLogin = function (username, password) {
        console.log("Filling in username: ".concat(username, " into ").concat(this.elements.usernameInput));
        console.log("Filling in password: ".concat(password, " into ").concat(this.elements.passwordInput));
        console.log("Clicking on submit button: ".concat(this.elements.submitButton));
    };
    return LoginPage;
}());
exports.default = LoginPage;
