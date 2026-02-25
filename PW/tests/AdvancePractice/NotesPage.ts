import { Page } from "playwright-core";

export class NotesPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        //await this.page.goto('https://practice.expandtesting.com/notes/app');
    }

    async createNote(title: string, description: string) {
        await this.page.getByRole('button', { name: 'New Note' }).click();
    }
}