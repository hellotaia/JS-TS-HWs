import { expect, Locator, Page } from "@playwright/test";

export class NotesPage {
    readonly page: Page;
    readonly uiUrl = 'https://practice.expandtesting.com/notes/app';
    readonly noteCard: Locator;
    readonly noteTitle: Locator;
    readonly noteDescription: Locator;

    readonly noteViewBtn: Locator;


    constructor(page: Page) {
        this.page = page;
        this.noteCard = this.page.getByTestId('note-card');
        this.noteTitle = this.page.getByTestId('note-card-title');
        this.noteDescription = this.page.getByTestId('note-card-description');

        this.noteViewBtn = this.page.getByTestId('note-view');

    }

    async goto() {
        await this.page.goto(this.uiUrl,
            { waitUntil: 'domcontentloaded' });
    }


    async getNoteByTitle(title: string): Promise<Locator> {
        return this.noteCard.filter({
            has: this.noteTitle.filter({ hasText: title })
        });
    }


    async assertNoteDetails(noteLocator: Locator, expectedDetails: { description: string }) {
        await noteLocator.click();
        await expect(this.noteDescription).toBeVisible();
        await expect(this.noteDescription)
            .toHaveText(expectedDetails.description);

    }
}