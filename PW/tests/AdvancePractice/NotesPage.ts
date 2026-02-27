import { expect, Locator, Page } from "@playwright/test";

export class NotesPage {
    readonly page: Page;
    readonly uiUrl = 'https://practice.expandtesting.com/notes/app';

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(this.uiUrl,
            { waitUntil: 'domcontentloaded' });
    }

    async getNoteByTitle(title: string): Promise<Locator> {
        const noteCard = this.page.getByText(title);
        return noteCard;
    }

    async assertNoteDetails(noteLocator: Locator, expectedDetails: { description: string }) {
        await expect(noteLocator).toContainText(expectedDetails.description);
    }
}