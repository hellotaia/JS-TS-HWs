import { test, expect } from '@playwright/test';
import { NotesPage } from './NotesPage';
import * as fs from 'fs';
import * as path from 'path';

test('should create a new note', async ({ page }) => {
    const raw = fs.readFileSync(path.resolve('./tests/AdvancePractice/test-data.json'), 'utf-8');
    const testData = JSON.parse(raw) as { noteTitle: string; noteDescription: string; noteId: string };

    const notesPage = new NotesPage(page);
    await notesPage.goto();

    const noteCard = await notesPage.getNoteByTitle(testData.noteTitle);
    await expect(noteCard).toBeVisible();
    await notesPage.assertNoteDetails(noteCard, { description: testData.noteDescription });

    await noteCard.click();
});