//api.js
const users = [
    { name: 'Omelco', age: 66, email: 'omelco@example.com', isActive: false },
    { name: 'Marusya', age: 67, email: 'marusya@example.com', isActive: true },
    { name: 'Karpo', age: 30, email: 'karpo@example.com', isActive: true },
    { name: 'Lavrin', age: 28, email: 'lavrin@example.com', isActive: true },
    { name: 'Melashka', age: 16, email: 'melashka@example.com', isActive: true },
    { name: 'Motrya', age: 22, email: 'motrya@example.com', isActive: false },
    { name: 'ADMIN', age: 99, email: 'admin@example.com', isActive: true }
];

export async function fetchUsers() {
    const randomError = Math.random() > 0.7;
    console.log('Waiting 2 seconds...')
    await new Promise((resolve) => {
        setTimeout(() => resolve(), 2000);
    })
    if (randomError) {
        throw new Error('Error: Could not fetch user data.');
    };
    return users;
}