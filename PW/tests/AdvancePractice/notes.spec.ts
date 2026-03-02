import { test, expect } from '@playwright/test';
import { NotesPage } from './NotesPage';
import * as fs from 'fs';
import * as path from 'path';
test.use({ storageState: './tests/AdvancePractice/storageState.json' });
let notesPage: NotesPage;
let testData: { noteTitle: string; noteDescription: string; noteId: string };

test.beforeEach(async ({ page }) => {
    const raw = fs.readFileSync(path.resolve('./tests/AdvancePractice/test-data.json'), 'utf-8');
    testData = JSON.parse(raw) as { noteTitle: string; noteDescription: string; noteId: string };
    notesPage = new NotesPage(page);
    await notesPage.goto();
});

test('should display the API-created note on the page', async () => {
    await expect(notesPage.page).toHaveURL(notesPage.uiUrl);
    await notesPage.getNoteByTitle(testData.noteTitle);
    await notesPage.assertNoteDetails(notesPage.noteViewBtn, { description: testData.noteDescription });
    await expect(notesPage.page).toHaveURL(`${notesPage.uiUrl}/notes/${testData.noteId}`);

});