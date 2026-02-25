import { request, expect } from '@playwright/test';


async function globalSetup() {
    const apiUrl = 'https://practice.expandtesting.com/notes/api/';

    const credentials = {
        name: `testuser${Date.now()}`,
        password: 'testpassword',
        email: `email${Date.now()}@gmail.com`
    };
    const api = await request.newContext({
        baseURL: apiUrl,
    });

    const registerRequest = await api.post(`users/register`, {
        form: { name: credentials.name, email: credentials.email, password: credentials.password }
    });
    console.log('register status', registerRequest.status())
    console.log(await registerRequest.text())
    expect(registerRequest.status()).toBe(201);

    const loginRequest = await api.post(`users/login`, {
        form: { email: credentials.email, password: credentials.password }
    });
    console.log('login status', loginRequest.status())
    console.log(await loginRequest.text());
    console.log('email', credentials.email);
    console.log('password', credentials.password);

    expect(loginRequest.status()).toBe(200);


    const loginJson = await loginRequest.json();
    console.log(loginJson);
}

export default globalSetup;

