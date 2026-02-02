class UIComponent {
    protected locator: string;
    constructor(locator: string) {
        this.locator = locator;
    }s

     public click(): void {
        console.log(`Clicked on component with locator: ${this.locator}`);   
    }
}

class Button extends UIComponent {}

class Input extends UIComponent {
    private currentValue : string = "";
    public setValue(text: string){
        this.currentValue = text;
        return this;
    }
    public getValue(): string {
        return this.currentValue;
    }
}


const submitButton = new Button("#submit-btn");
const usernameInput = new Input("#username-input");

submitButton.click();
usernameInput.setValue("test_user").click();

console.log(`[INPUT VALUE]: ${usernameInput.getValue()}`);
