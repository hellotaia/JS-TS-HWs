import { APIRequestContext, Page, Locator } from "@playwright/test";
import { time } from "node:console";

export class TodoPage {
    readonly page: Page;
    readonly inputField: Locator;
    readonly activeItemCount: Locator;
    readonly todoItems: Locator;
    readonly apiUrl = "https://csharp-todo-backend.azurewebsites.net/api/v1/todo";
    readonly baseUrl = "https://todobackend.com/client/index.html?https://csharp-todo-backend.azurewebsites.net/api/v1/todo";

    constructor(page: Page, private request: APIRequestContext) {
        this.page = page;
        this.inputField = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.locator('#todo-list li');
        this.activeItemCount = page.locator('#todo-count strong');
    }

    async goto() {
        await this.page.goto(this.baseUrl);
    }

    async clearTodos() {
        const getResponse = await this.request.get(this.apiUrl);
        const body = await getResponse.json();
        if (!Array.isArray(body) || body.length === 0) return;
        for (const todo of body) {
            await this.request.delete(`${this.apiUrl}/${todo.id}`);
        }
    }


    async addTodo(text: string) {
        // const before = await this.todoItems.count();
        await this.inputField.click();
        await this.inputField.fill(text);
        await this.page.waitForTimeout(500);
        await this.inputField.press('Enter');
        // await expect(this.todoItems).toHaveCount(before + 1);
    }

    async markAsComplete(todoText: string): Promise<void> {
        await this.page.locator(`#todo-list li:has-text("${todoText}") .toggle`)
            .click();
    }

    async filterBy(status: 'Active' | 'Completed') {
        await this.page.getByRole('link', { name: status }).click();

    }

    async setupMockTodos() {
        await this.page.route(this.apiUrl, route => {
            route.fulfill({
                status: 200,
                json: [
                    { id: "1", title: 'Mocked Task 1', completed: false },
                    { id: "2", title: 'Mocked Task 2', completed: true }
                ]
            })
        });
    }

    async serverMockError() {
        await this.page.route(this.apiUrl, route => {
            const request = route.request();
            if (request.method() === 'POST') {

                return route.fulfill({
                    status: 500,
                    body: 'Server Error'
                })
            }
            route.continue();
        });
    }

}
