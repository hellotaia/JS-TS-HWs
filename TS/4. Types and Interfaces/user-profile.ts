type UserID = string | number;

interface AccountDetails {
    readonly id: UserID;
    email?: string;
}
interface UserProfile extends AccountDetails {
    username: string;
    creationDate: Date;
}

function summarizeUserProfile(userProfile: UserProfile) {
    if (userProfile.email) {
        return `[USER WITH EMAIL]
    User Profile Info:
    User ${userProfile.username}
    ID: ${userProfile.id}
    Email: ${userProfile.email} 
    Created: ${userProfile.creationDate.toDateString()}`;
    }
    return `[USER WITHOUT EMAIL]
    User Profile Info:
    User ${userProfile.username}
    ID: ${userProfile.id}
    Email: [NO EMAIL IS ON FILE]
    Created: ${userProfile.creationDate.toDateString()}`;
}
const userWithEmail: UserProfile = {
    id: 101,
    username: "john_doe",
    email: "john.doe@example.com",
    creationDate: new Date("2022-01-15")
};
const userWithoutEmail: UserProfile = {
    id: "user_202",
    username: "jane_doe",
    creationDate: new Date("2023-03-22")
};
console.log(summarizeUserProfile(userWithEmail));
console.log("--------------------------------------------------");
console.log(summarizeUserProfile(userWithoutEmail));