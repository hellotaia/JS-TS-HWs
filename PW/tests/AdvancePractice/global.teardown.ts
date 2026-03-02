import { request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const apiUrl = 'https://practice.expandtesting.com/notes/api/';
const tdPath = path.resolve('./tests/AdvancePractice/test-data.json');
const ssPath = path.resolve('./tests/AdvancePractice/storageState.json');
const raw = fs.readFileSync(tdPath, 'utf-8');
const testData = JSON.parse(raw) as TestData;

type TestData = {
    token: string;
    noteId: string;
    creds: {
        password: string;
        email: string;
    }
};

async function globalTeardown() {
    const api = await request.newContext({
        baseURL: apiUrl,
        extraHTTPHeaders: {
            'x-auth-token': testData.token,
            accept: 'application/json',
        },
    });

    const noteDelete = await api.delete(`notes/${testData.noteId}`);
    if (!noteDelete.ok()) {
        throw new Error(
            `Note deletion failed: ${noteDelete.status()} 
            ${await noteDelete.text()}`
        );
    } else {
        console.log('Note deleted successfully');
    }

    await api.dispose();

    //clean up local files 
    fs.unlinkSync(tdPath);
    fs.unlinkSync(ssPath);
}
export default globalTeardown;
