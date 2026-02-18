import { Page, Locator } from "@playwright/test";

export class TodoPage {
    readonly page: Page;
    readonly inputField: Locator;
    readonly itemCount: Locator;
    readonly todoItems: Locator;
    readonly completedFilter: Locator;
    readonly activeFilter: Locator;
    readonly clearCompleted: Locator;
    readonly toggleAll: Locator;
    readonly mockDataUrl = "**/api/todos";
    readonly baseUrl = "https://todobackend.com/client/index.html?https://csharp-todo-backend.azurewebsites.net/api/v1/todo";

    constructor(page: Page) {
        this.page = page;
        this.inputField = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.locator('#todo-list li');
        this.completedFilter = page.locator('#filters li a:has-text("Completed")');
        this.activeFilter = page.locator('#filters li a:has-text("Active")');
        this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
        this.itemCount = page.locator('#todo-count strong');
        this.toggleAll = page.locator('#toggle-all');

    }

    async goto() {
        await this.page.goto(this.baseUrl);
    }

    async addTodo(text: string) {
        await this.inputField.click();
        await this.inputField.fill(text);
        await this.inputField.press('Enter');
    }
    async markAsComplete(todoText: string): Promise<void> {
        await this.page.locator(`#todo-list li:has-text("${todoText}") .toggle`).check();
    }
    async filterBy(status: 'Active' | 'Completed') {
        await this.page.locator(`#filters li a:has-text("${status}")`).click();
    }
    async route() {
        await this.page.route(this.mockDataUrl, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    "todos": [
                        {
                            id: 1,
                            title: 'Mocked Task 1',
                            completed: false
                        },
                        {
                            id: 2,
                            title: 'Mocked Task 2',
                            completed: true
                        }
                    ]
                })
            })


        })

    }


    async setupMockTodos() {
        const mockData = {
            "todos": [
                {
                    id: 1,
                    title: 'Mocked Task 1',
                    completed: false
                },
                {
                    id: 2,
                    title: 'Mocked Task 2',
                    completed: true
                }
            ]
        };

        await this.page.route(this.mockDataUrl, route => {
            route.fulfill({
                json: mockData,
                status: 200,
                contentType: 'application/json'
            })


        })

    }

}
