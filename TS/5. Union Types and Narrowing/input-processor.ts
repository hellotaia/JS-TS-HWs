type ProcessableInput = string | Date | number[];

function processInput(input: ProcessableInput): string | number {

    if (typeof input === 'string') {
        return input.toUpperCase();
    }
    if (input instanceof Date) {
        return input.toISOString();
    }
    else {
        return input.reduce((sum, num) => sum + num, 0);
    }
}

const text = "Hello World!";
const date = new Date("2026-02-02");
const numbers = [1, 2, 3, 4, 5];


console.log(processInput(text)); 
console.log(processInput(date)); 
console.log(processInput(numbers)); 
