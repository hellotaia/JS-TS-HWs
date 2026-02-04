"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(name, fuelLevel, location) {
        this.name = name;
        this.location = location;
        this.fuelLevel = fuelLevel;
        this.fuelCapacity = 100; // Assuming a default capacity
        this.inventory = { sand: 0, water: 0, silver: 0, gold: 0, diamond: 0, alienArtifact: 0 };
    }
    Player.prototype.getTravelCost = function (destination) {
        var distance = Math.abs(destination.position - this.location.position);
        return distance;
    };
    Player.prototype.destinationTarget = function (destination) {
        var price = this.getTravelCost(destination);
        if (price > this.fuelLevel) {
            console.log("Not enough fuel to travel to " + destination.name);
            return;
        }
        this.fuelLevel -= price;
        this.location = destination;
        console.log("Traveled to ".concat(destination.name, ". Remaining fuel: ").concat(this.fuelLevel));
    };
    Player.prototype.addFuel = function (amount) {
        this.fuelLevel += amount;
    };
    Player.prototype.fuelLeak = function (amount) {
        this.fuelLevel -= amount;
        if (this.fuelLevel < 0)
            this.fuelLevel = 0;
    };
    Player.prototype.addResource = function (type, amount) {
        this.inventory[type] += amount;
    };
    Player.prototype.removeResource = function (type, amount) {
        if (this.inventory[type] < amount) {
            return false;
        }
        this.inventory[type] -= amount;
        return true;
    };
    Player.prototype.currentInventory = function () {
        return "Inventory: ".concat(this.inventory.sand, " sand, ").concat(this.inventory.water, " water, ").concat(this.inventory.silver, " silver, ").concat(this.inventory.gold, " gold, ").concat(this.inventory.diamond, " diamond, ").concat(this.inventory.alienArtifact, " alien artifacts.");
    };
    return Player;
}());
exports.Player = Player;
