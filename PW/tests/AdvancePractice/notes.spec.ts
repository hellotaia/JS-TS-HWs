import { test, expect } from '@playwright/test';
import { NotesPage } from './NotesPage';

test('should create a new note', async ({ page }) => {
    const notesPage = new NotesPage(page);
    await notesPage.goto();
});