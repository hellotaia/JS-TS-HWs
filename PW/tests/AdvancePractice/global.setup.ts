import { request, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
    const apiUrl = 'https://practice.expandtesting.com/notes/api/';
    const uiUrl = 'https://practice.expandtesting.com/notes/app';
    const ssPath = path.resolve('./tests/AdvancePractice/storageState.json');
    const tdPath = path.resolve('./tests/AdvancePractice/test-data.json');


    const creds = {
        name: `testuser${Date.now()}`,
        password: 'testpassword',
        email: `email${Date.now()}@gmail.com`
    };


    // api register
    const api = await request.newContext({ baseURL: apiUrl });
    const reg = await api.post(`users/register`, { data: creds });
    if (!reg.ok()) {
        throw new Error(
            `Register failed: ${reg.status()} ${await reg.text()}`
        );
    }


    //api login
    const login = await api.post(`users/login`, {
        data: {
            email: creds.email,
            password: creds.password
        }
    });
    if (!login.ok()) {
        throw new Error(
            `Login failed: ${login.status()} ${await login.text()}`
        );
    }

    //token
    const loginJson = await login.json();
    const token = loginJson.data.token;
    if (!token) throw new Error(
        `Token not found in login response: ${JSON.stringify(loginJson)}`
    );

    // api creation note 
    const authContext = await request.newContext({
        baseURL: apiUrl,
        extraHTTPHeaders: {
            'x-auth-token': token,
            accept: 'application/json',
        },
    });

    const noteTitle = `API Test Note - ${Date.now()}`;
    const noteDescription = `This note was created by an API -  ${Date.now()}`;
    const noteCreate = await authContext.post(`notes`, {
        data: {
            title: noteTitle,
            description: noteDescription,
            category: 'Home',
            completed: false
        }
    });
    if (!noteCreate.ok()) {
        throw new Error(
            `Note creation failed: ${noteCreate.status()} 
            ${await noteCreate.text()}`
        );
    }

    const noteJson = await noteCreate.json();
    const noteId = noteJson.data.id;
    if (!noteId) throw new Error(
        `Note ID not found: ${JSON.stringify(noteJson)}`
    );

    //test-data creation
    const testData = {
        creds,
        token,
        noteId,
        noteTitle,
        noteDescription
    };
    fs.writeFileSync(tdPath, JSON.stringify(testData));

    //UI login
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(uiUrl, { waitUntil: 'domcontentloaded' });

    await page.getByText('Login').click();
    await page.getByTestId('login-email').fill(creds.email);
    await page.getByTestId('login-password').fill(creds.password);
    await page.getByTestId('login-submit').click();
    await page.getByText('Logout').waitFor({
        state: 'visible', timeout: 15000
    });

    //storage state
    await context.storageState({
        path: ssPath
    });

    await browser.close();
    await api.dispose();
    await authContext.dispose();

}

export default globalSetup;

