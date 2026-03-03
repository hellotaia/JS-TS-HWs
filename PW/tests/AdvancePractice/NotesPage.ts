import { expect, Locator, Page } from "@playwright/test";

export class NotesPage {
    readonly page: Page;
    readonly uiUrl = 'https://practice.expandtesting.com/notes/app';

    readonly noteCards: Locator;
    readonly noteGrid: Locator;
    readonly noteTitle: Locator;
    readonly noteDescription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.noteCards = this.page.getByTestId('note-card');
        this.noteGrid = this.page.getByTestId('notes-list');
        this.noteTitle = this.page.getByTestId('note-card-title');
        this.noteDescription = this.page.getByTestId('note-card-description');
    }

    async goto() {
        await this.page.goto(this.uiUrl,
            { waitUntil: 'domcontentloaded' });
        await expect(this.noteGrid).toBeVisible();
    }


    async getNoteByTitle(title: string): Promise<Locator> {
        return this.noteCards.filter({
            has: this.noteTitle.filter({ hasText: title })
        });
    }


    async assertNoteDetails(noteLocator: Locator, expectedDetails: { description: string }) {
        await expect(noteLocator).toBeVisible();

        await noteLocator.getByTestId('note-view').click();

        await expect(this.page).toHaveURL(/\/notes\/\w+$/);
        await expect(this.noteDescription.filter({ hasText: expectedDetails.description })).toBeVisible();
    }
}