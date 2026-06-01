import { APIRequestContext, Page, Locator } from "@playwright/test";

export class TodoPage {
    readonly page: Page;
    readonly inputField: Locator;
    readonly activeItemCount: Locator;
    readonly todoItems: Locator;

    constructor(page: Page, private request: APIRequestContext) {
        this.page = page;
        //this.inputField = page.getByPlaceholder('What needs to be done?');
        this.inputField = page.locator('#new-todo');//для практики селектори по плейсхолдеру можеш юзать, але в реальних проектах часто плейсхолдери міняються, тому краще юзати більш стабільні селектори (id - це прям ідеально; клас, дата-атрибути - добре, пот тексту - якщо інших варіантів немає)
        this.todoItems = page.locator('#todo-list li');
        this.activeItemCount = page.locator('#todo-count strong');
    }
    //перенесла сюди, загалом константи тримають або в .env файлах, або в окремих файлах з константами, але для практики можна і так залишити
    readonly apiUrl = "https://csharp-todo-backend.azurewebsites.net/api/v1/todo";
    readonly baseUrl = "https://todobackend.com/client/index.html?https://csharp-todo-backend.azurewebsites.net/api/v1/todo";

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
        //все що не використовується в тестах треба прибрати(або не пушити)
        //всі висячі рядки, два пробіли, закоментований код - це все треба прибрати, щоб не захаращувати код
        await this.inputField.click();
        await this.inputField.fill(text);
        await this.page.waitForTimeout(500);
        await this.inputField.press('Enter');
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
                    //хоча це імітація, але краще щоб структура даних була максимально наближена до реальної
                    //підкажи як ти будувала модель мока для цього тесту?
                    // Чи дивилась ти реальну відповідь від сервера, щоб зрозуміти яку структуру даних потрібно замокати?
                    //якщо дивилась - зроби як реальна відповідь, якщо ні - напиши мені, покажу як це зробити
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