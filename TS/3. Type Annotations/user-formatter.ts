function formatUser(user: { name: string; age: number; occupation?: string }): string {
  // This line will cause a runtime error if 'user.occupation' is undefined.
  let summary: string;
  if (!user.occupation) {
    summary = `${user.name} (${user.age}) is currently unemployed.`;
  }
    else {
  const occupationUpper = user.occupation!.toUpperCase();
  summary = `${user.name} (${user.age}) works as a ${occupationUpper}.`;
  }
  return summary;
}

const userWithOccupation = { name: "Alice", age: 30, occupation: "Engineer" };
const userWithoutOccupation = { name: "Bob", age: 25 };

console.log(formatUser(userWithOccupation));
console.log(formatUser(userWithoutOccupation));