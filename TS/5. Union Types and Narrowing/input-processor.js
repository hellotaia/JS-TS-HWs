"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processInput(input) {
    if (typeof input === 'string') {
        return input.toUpperCase();
    }
    if (input instanceof Date) {
        return input.toISOString();
    }
    else {
        return input.reduce(function (sum, num) { return sum + num; }, 0);
    }
}
var text = "hello world";
var date = new Date("2026-02-02");
var numbers = [1, 2, 3, 4, 5];
console.log(processInput(text));
console.log(processInput(date));
console.log(processInput(numbers));
