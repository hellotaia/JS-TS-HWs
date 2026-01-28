 const user = {
  name: "Daniel",
  age: 26,
  getGreeting: function() {
    return `Hello, my name is ${this.name}.`;
  }
};

//bug 2 Fix: add email type definition
//function processUser(userObject) {
function processUser(userObject:
    { name: string; age: number; getGreeting: () => string; email?: string }
){
  // Bug 1: Typo in a standard method name.
  const announcement = "Processing user data...";
  // console.log(announcement.toLocalLowerCase());
  // Fix: typo from toLocalLowerCase to toLocaleLowerCase
  console.log(announcement.toLocaleLowerCase());

  // Bug 2: Trying to access a property that doesn't exist
  // Fix: add type definition and optional check for email?: to function parameter
  console.log(`User's email: ${userObject.email}`);

  // Bug 3: Forgetting to call a function/method

  // const greeting = userObject.getGreeting;
  // if (greeting) {
  // console.log("Greeting function exists.");}
  
  // Fix: Call the function, removed unnecessary check
     console.log(userObject.getGreeting());
}
processUser(user);