//6 Arrays. Log File Processor
// 1 Setup: Start with the provided logMessages array in your code.
const logMessages = [
    "[INFO] User logged in",
    "[WARNING] Low disk space",
    "[ERROR] Database connection failed",
    "[INFO] Data fetched successfully",
    "[ERROR] API endpoint not found",
];

// 2 addLog(logs, newMessage):
const addLog = (logs, newMessage) => {
    const x = [...logs, newMessage];
    return x;
};

// 3 getErrorMessages(logs):
const getErrorMessages = (logs) => {
    const errorMessages = logs.filter(msg => msg.startsWith("[ERROR]"));
    return errorMessages;
};

// 4 formatLogMessages(logs):
const formatLogMessages = (logs) => {
    const formattedLogs = logs.map(msg => msg
        .replace("[", "")
        .replace("]", ": "))
    return formattedLogs;
};

// 5 countErrorLogs(logs):
const countErrorLogs = (logs) => {
    const count = logs.reduce((num, msg) => {
        if (msg.startsWith('[ERROR]')) {
            return num + 1;
        }
        return num;
    }, 0);
    return count;
};

// 6 Demonstration: After implementing the functions, write a sequence of calls to demonstrate they work correctly. 
console.log('1. Initial array: ', logMessages);
console.log('2. addLog array: ', addLog(logMessages, "[ERROR] Add New Error"));
console.log('3. getErrorMessages array (Errors only): ', getErrorMessages(logMessages));
console.log('4. formatLogMessages array: ', formatLogMessages(logMessages));
console.log('5. countErrorLogs Error logs defined: ', countErrorLogs(logMessages));
