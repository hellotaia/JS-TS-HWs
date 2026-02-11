function formatUser(user) {
    // This line will cause a runtime error if 'user.occupation' is undefined.
    //   let summary: string;
    //   if (!user.occupation) {
    //     summary = `${user.name} (${user.age}) is currently unemployed.`;
    //   }
    //     else {
    //   const occupationUpper = user.occupation!.toUpperCase();
    //   summary = `${user.name} (${user.age}) works as a ${occupationUpper}.`;
    //   }
    //   return summary;
    // }
    var summary = (!user.occupation) ?
        "".concat(user.name, " (").concat(user.age, ") is currently unemployed.") :
        "".concat(user.name, " (").concat(user.age, ") works as a ").concat(user.occupation.toUpperCase(), ".");
    return summary;
}
var userWithOccupation = { name: "Alice", age: 30, occupation: "Engineer" };
var userWithoutOccupation = { name: "Bob", age: 25 };
console.log(formatUser(userWithOccupation));
console.log(formatUser(userWithoutOccupation));
