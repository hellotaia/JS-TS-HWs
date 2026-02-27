import { request, chromium } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup() {
    const apiUrl = 'https://practice.expandtesting.com/notes/api/';
    const uiUrl = 'https://practice.expandtesting.com/notes/app';

    const credentials = {
        name: `testuser${Date.now()}`,
        password: 'testpassword',
        email: `email${Date.now()}@gmail.com`
    };
    const api = await request.newContext({ baseURL: apiUrl, });

    //register
    const registerRequest = await api.post(`users/register`, { data: credentials });
    if (!registerRequest.ok()) {
        throw new Error(
            `Register failed: ${registerRequest.status()} ${await registerRequest.text()}`
        );
    }

    //login
    const loginRequest = await api.post(`users/login`, {
        data: {
            email: credentials.email,
            password: credentials.password
        }
    });
    if (!loginRequest.ok()) {
        throw new Error(
            `Login failed: ${loginRequest.status()} ${await loginRequest.text()}`
        );
    }
    console.log('loginRequest', loginRequest);

    //token
    const loginJson = await loginRequest.json();
    const token = loginJson.data.token;
    if (!token) throw new Error(
        `Token not found in login response: ${JSON.stringify(loginJson)}`
    );

    const authContext = await request.newContext({
        baseURL: apiUrl,
        extraHTTPHeaders: {
            'x-auth-token': token,
            accept: 'application/json',
        },
    });

    // api creation note 
    const noteTitle = `Note ${Date.now()}`;
    const noteDescription = `Description ${Date.now()}`;

    const noteRequest = await authContext.post(`notes`, {
        data: {
            title: noteTitle,
            description: noteDescription,
            category: 'Home',
            completed: false
        }
    });
    if (!noteRequest.ok()) {
        throw new Error(
            `Note creation failed: ${noteRequest.status()} ${await noteRequest.text()}`
        );
    }

    const noteJson = await noteRequest.json();
    const noteId = noteJson.data.id;
    if (!noteId) throw new Error(
        `Note ID not found in note response: ${JSON.stringify(noteJson)}`
    );

    console.log('noteId', noteId);

    //test-data creation
    const testData = {
        credentials,
        token,
        noteId,
        noteTitle,
        noteDescription
    };
    fs.writeFileSync('./tests/AdvancePractice/test-data.json', JSON.stringify(testData));

    //storage state
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(uiUrl, { waitUntil: 'domcontentloaded' });
    await context.storageState({ path: './tests/AdvancePractice/storageState.json' });

    await browser.close();
    await api.dispose();
    await authContext.dispose();

}

export default globalSetup;

