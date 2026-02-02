import { LoginElements } from "./page-types";  
export default class LoginPage {
    private readonly elements: LoginElements;

    constructor(elements: LoginElements) {
        this.elements = elements;
    }
    public performLogin(username: string, password: string): void {
        console.log(`Filling in username: ${username} into ${this.elements.usernameInput}`);
        console.log(`Filling in password: ${password} into ${this.elements.passwordInput}`);
        console.log(`Clicking on submit button: ${this.elements.submitButton}`);
    }
}