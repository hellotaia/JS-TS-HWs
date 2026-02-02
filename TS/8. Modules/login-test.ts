import LoginPage from "./login-page";
const loginElements = {
    usernameInput: "#username",
    passwordInput: "#password",
    submitButton: "#submit-btn"
};
const loginPage = new LoginPage(loginElements);
loginPage.performLogin("test_user", "secure_password");