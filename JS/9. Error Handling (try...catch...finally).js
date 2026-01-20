//9. Error Handling (try...catch...finally)
//Robust User Data Processor

function processUserData(users) {
    for (const user of users) {
        if (typeof user.name !== 'string' || user.name.trim() === '') {
            console.log(`Processing user: [${user.name}]`)
            throw new Error(`Invalid user name. (Name: [${user.name}])`);

        }
        if (typeof user.age !== 'number' || user.age < 0) {
            console.log(`Processing user: [${user.name}]`)
            throw new Error(`Invalid user age. (Age: [${user.age}])`)
        }
        console.log(`[GREAT SUCCSESS] Processing user: [${user.name}]`)
    }
}

const validUsers = [
    { name: 'Vasiliy', age: 5 },
    { name: 'Volodya', age: 19 },
    { name: 'Olha', age: 93 },
    { name: 'Petro Shur', age: 43 }
];
const invalidUsers = [
    { name: 21, age: 20 },
    { name: 'Vova', age: -2 },
    { name: ' ', age: 'one' },
    { name: null, age: 20 }
];

try {
    console.log(`--- Valid users check: `);
    processUserData(validUsers);
}
catch (e) {
    console.error('[ERROR] processing data:', e.message)
}
finally {
    console.log('Valid Users processing cycle complete')
}

try {
    console.log("--- Invalid users check: ");
    processUserData(invalidUsers);
}
catch (e) {
    console.error('[ERROR] processing data: ', e.message)
}
finally {
    console.log('Invalid Users processing cycle complete')
}
