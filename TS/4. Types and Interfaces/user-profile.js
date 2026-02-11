function summarizeUserProfile(userProfile) {
    if (userProfile.email) {
        return "[USER WITH EMAIL]\n    User Profile Info:\n    User ".concat(userProfile.username, "\n    ID: ").concat(userProfile.id, "\n    Email: ").concat(userProfile.email, " \n    Created: ").concat(userProfile.creationDate.toDateString());
    }
    return "[USER WITHOUT EMAIL]\n    User Profile Info:\n    User ".concat(userProfile.username, "\n    ID: ").concat(userProfile.id, "\n    Email: [NO EMAIL IS ON FILE]\n    Created: ").concat(userProfile.creationDate.toDateString());
}
var userWithEmail = {
    id: 101,
    username: "john_doe",
    email: "john.doe@example.com",
    creationDate: new Date("2022-01-15")
};
var userWithoutEmail = {
    id: "user_202",
    username: "jane_doe",
    creationDate: new Date("2023-03-22")
};
console.log(summarizeUserProfile(userWithEmail));
console.log("--------------------------------------------------");
console.log(summarizeUserProfile(userWithoutEmail));
function logInfo(data) {
    console.log(data);
}
