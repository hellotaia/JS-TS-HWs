//9. Error Handling (try...catch...finally)
//Robust User Data Processor

function processUserData(users) {
    try{
    if (!Array.isArray(users)) {
        throw new Error(`Invalid input: expected data is not an array, got ${typeof users}`);
    }

    for (const user of users) {
            console.log(`Processing user: [${user.name}]`);
        if (typeof user.name !== 'string' || user.name.trim() === '') {
            throw new Error(`Invalid user name. (Name: [${user.name}])`);
        }
        if (typeof user.age !== 'number' || user.age < 0) {
            throw new Error(`Invalid user age. (Age: [${user.age}])`)
        }
        console.log(`[GREAT SUCCSESS] Processing user: [${user.name}]`);
    }
    return `All users processed successfully. Total users: ${users.length}`;
}
catch (e) {
    console.error('[ERROR] processing data:', e.message)
}
finally {
    console.log('Valid Users processing cycle complete')
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
    { name: null, age: 20 },
    {}
];


    console.log(`--- Valid users check: `);
    console.log(processUserData(validUsers));

    console.log("--- Invalid users check: ");
    console.log(processUserData(invalidUsers));

    console.log('--- Not an array check: ');
    console.log(processUserData('Not an array'));
    console.log('--- End of user data processing ---');
