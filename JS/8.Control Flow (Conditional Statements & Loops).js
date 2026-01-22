//8. Control Flow (Conditional Statements & Loops)
//8. User Data Processor
const users = [
    { name: 'Omelco', age: 66, isActive: false },
    { name: 'Marusya', age: 67, isActive: true },
    { name: 'Karpo', age: 30, isActive: true },
    { name: 'Lavrin', age: 28, isActive: true },
    { name: 'Melashka', age: 16, isActive: true },
    { name: 'Motrya', age: 22, isActive: false },
    { name: 'ADMIN', age: 99, isActive: true }
]
function processUserData(users) {
    const kaydashy = [];// for all users exept 'ADMIN'
    const actives = []; // only for isActive = true
    for (const user of users) {
        if (user.name === "ADMIN") {
            break;
        }
        else if (user.isActive === false) {
            kaydashy.push(user.name);
            continue;
        }
        else {
            actives.push(user.name);
            kaydashy.push(user.name);
            if (user.age < 18) {
                console.log(`[${user.name}] is a minor.`);
            } else if (user.age >= 18 && user.age <= 65) {
                console.log(`[${user.name}] is an adult.`);
            } else {
                console.log(`[${user.name}] is a senior.`);
            }
        }
    }
    return [actives, kaydashy];
}
const [actives, kaydashy] = processUserData(users);
console.log(`Active members: `, actives);
console.log(`Whole Kaydash's family: `, kaydashy);

