import type { IPlanet, Inventory, ResourceType } from "./types.js";
import { planets } from "./api.js";

export class Player {
    public name: string;
    public location: IPlanet;
    public fuelLevel: number;
    public inventory: Inventory;
    public fuelCapacity: number;

    constructor(name: string, fuelLevel: number, location: IPlanet) {
        this.name = name;
        this.location = location;
        this.fuelLevel = fuelLevel;
        this.fuelCapacity = 100;
        this.inventory = { sand: 0, water: 0, silver: 0, gold: 0, diamond: 0, alienArtifact: 0 };
    }

    public getTravelCost(destination: IPlanet): number {
        const distance = Math.abs(destination.position - this.location.position);
        return distance;
    }

    public destinationTarget(destination: IPlanet): void {
        const price = this.getTravelCost(destination);

        if (price > this.fuelLevel) {
            console.log("Not enough fuel to travel to " + destination.name);
            return;
        }
        this.fuelLevel -= price;
        this.location = destination;
        console.log(`Arrived to ${destination.name}. Remaining fuel: ${this.fuelLevel}`);
    }
    public addFuel(amount: number): void {
        this.fuelLevel += amount;
    }

    public fuelLeak(amount: number): void {
        this.fuelLevel -= amount;
        if (this.fuelLevel < 0) this.fuelLevel = 0;
    }

    public addResource(type: ResourceType, amount: number): void {
        this.inventory[type] += amount;
    }

    public removeResource(type: ResourceType, amount: number): boolean {
        if (this.inventory[type] < amount) {
            return false;
        }
        this.inventory[type] -= amount;
        return true;
    }

    public currentInventory(): string {
        return `${this.inventory.sand} sand, ${this.inventory.water} water, ${this.inventory.silver} silver, ${this.inventory.gold} gold, ${this.inventory.diamond} diamond, ${this.inventory.alienArtifact} alien artifacts.`;
    }
}