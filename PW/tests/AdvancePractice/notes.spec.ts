import { test, expect } from '@playwright/test';
import { NotesPage } from './NotesPage';
import * as fs from 'fs';
import * as path from 'path';

let notesPage: NotesPage;
let testData: { noteTitle: string; noteDescription: string; noteId: string };

test.beforeEach(async ({ page }) => {
    const raw = fs.readFileSync(path.resolve('./tests/AdvancePractice/test-data.json'), 'utf-8');
    testData = JSON.parse(raw) as { noteTitle: string; noteDescription: string; noteId: string };
    notesPage = new NotesPage(page);
    await notesPage.goto();
});

test('should display the API-created note on the page', async () => {
    //Navigate directly to the notes page
    await expect(notesPage.page).toHaveURL(notesPage.uiUrl);

    //Use your NotesPage methods to find the note with the title "API Test Note"
    const title = testData.noteTitle;
    const note = await notesPage.getNoteByTitle(title);

    //Assertion: Assert that the note is visible.
    await expect(note).toBeVisible();


    //Assertion: Use your page object to click the note and verify its description matches what you sent in the API call.
    await notesPage.assertNoteDetails(
        note, { description: testData.noteDescription }
    );

    //Assertion: the URL now includes the note ID
    await expect(notesPage.page).toHaveURL(`${notesPage.uiUrl}/notes/${testData.noteId}`);

});