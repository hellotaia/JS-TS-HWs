function formatUser(user) {
    // This line will cause a runtime error if 'user.occupation' is undefined.
    var summary;
    if (!user.occupation) {
        summary = "".concat(user.name, " (").concat(user.age, ") is currently unemployed.");
    }
    else {
        var occupationUpper = user.occupation.toUpperCase();
        summary = "".concat(user.name, " (").concat(user.age, ") works as a ").concat(occupationUpper, ".");
    }
    return summary;
}
var userWithOccupation = { name: "Alice", age: 30, occupation: "Engineer" };
var userWithoutOccupation = { name: "Bob", age: 25 };
console.log(formatUser(userWithOccupation));
console.log(formatUser(userWithoutOccupation));
