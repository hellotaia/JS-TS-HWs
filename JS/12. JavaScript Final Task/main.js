//main.js
import { fetchUsers } from './api.js';

try {
    const users = await fetchUsers();
    const activeUsers = users.filter(user => user.isActive === true);
    const mappedUsers = activeUsers.map(user => `Name: ${user.name}, Email: ${user.email}`);
    mappedUsers.forEach(kaydash => {
        console.log('Fetched user:', kaydash);
    });
}
catch (error) {
    console.error('Error: Could not fetch user data.');
}