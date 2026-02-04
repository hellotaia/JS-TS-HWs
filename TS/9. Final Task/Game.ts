import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import type { IPlanet, Event, ResourceType } from "./types.js";
import { fuelPrices, getAllPlanets, getRandomEvent } from "./api.js";
import { Player } from "./Player.js";
const resTypes:ResourceType [] = ["sand","water","silver","gold","diamond","alienArtifact"];

export class Game {
  private readline = createInterface({ input, output });
  private planets: IPlanet[] = [];
  private player: Player;


  constructor(player: Player) {
    this.player = player;
  }

  public async start(): Promise<void> {
    const all = await getAllPlanets();
    this.planets = [...all].sort((a, b) => a.position - b.position);

    console.log("\n=== Cosmic Adventure ===\n");
    console.log(`Welcome abroad, Captain ${this.player.name}`)

    while (this.player.fuelLevel > 0) {
      this.printStatus();
      this.printPlanetMenu();

      const choice = await this.askNumber("\nPick a planet number (0 = quit): ");
      if (choice === 0) break;

      const target = this.planets[choice - 1];
      if (!target) {
        console.log("Wrong number\n");
        continue;
      }

      if (target.name === this.player.location.name) {
        console.log("Come on, you're already here..)\n");
        continue;
      }

      await this.tryTravel(target);
    }

    console.log(this.player.fuelLevel <= 0 ? "\nOut of fuel. Game over." : "\nBye.");
    await this.readline.close();
  }

  private printStatus(): void {
    console.log(`\nLocation: ${this.player.location.name} (${this.player.location.position})`);
    console.log(`Fuel: ${this.player.fuelLevel}`);
    console.log(`Inventory: ${this.player.currentInventory()}`);
  }

  private printPlanetMenu(): void {
    console.log("\n---Choose your destination: ");
    for (let i = 0; i < this.planets.length; i++) {
      const p = this.planets[i]!;
      const cost = Math.abs(p.position - this.player.location.position);
      const here = p.name === this.player.location.name ? "  <-- you are here" : "";
      console.log(`${i + 1}) ${p.name} [position = ${p.position}] cost = ${cost}${here}`);
    }
  }

  private async askNumber(text: string): Promise<number> {
    const raw = (await this.readline.question(text)).trim();
    const num = Number(raw);

    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      console.log("It is not integer\n");
      return this.askNumber(text);
    }

    return num;
  }

  private async tryTravel(target: IPlanet): Promise<void> {
    const cost = Math.abs(target.position - this.player.location.position);

    if (cost > this.player.fuelLevel) {
      console.log(`Not enough fuel. We need ${cost}, but have only ${this.player.fuelLevel}.\n`);
      return;
    }

    console.log(`Traveling to ${target.name} (cost ${cost})...`);
    this.player.destinationTarget(target);
    console.log(`Arrived at ${target.name}.`);

    const evnt = await getRandomEvent(target.name);
    await this.applyEvent(evnt);
    console.log("");
  }

  private async applyEvent(evnt: Event): Promise<void> {
    if (evnt.kind === "nothing") {
      console.log("\n[EVENT]: Nothing happened");
      return;
    }

    if (evnt.kind === "malfunction") {
      console.log(`\n[EVENT]: Malfunction! Fuel leak: -${evnt.leak}`);
      this.player.fuelLeak(evnt.leak);
      return;
    }

    if (evnt.kind === "resources") {
      console.log("\n[EVENT] You found resources:");
      for (const d of evnt.drop) {
        this.player.addResource(d.type, d.amount);
        console.log(`- ${d.amount} ${d.type} (value: ${fuelPrices[d.type]} fuel each)`);
      }
      return;
    }

    console.log("WOW! Its friendly alien trader! Trade resources for fuel.");
    await this.traderMenu();
  }

  private async traderMenu(): Promise<void> {
    while (true) {
      console.log(`\nFuel: ${this.player.fuelLevel}`);
      console.log(`Inventory: ${this.player.currentInventory()}`);
      console.log(
        `Prices: 
        sand=${fuelPrices.sand}, 
        water=${fuelPrices.water}, 
        silver=${fuelPrices.silver},
        gold=${fuelPrices.gold},
        diamond=${fuelPrices.diamond},
        alienArtifact=${fuelPrices.alienArtifact}`
      );

      console.log("\nTrader menu:");
      console.log("1) Sell specific resource");
      console.log("2) Sell all");
      console.log("0) Leave");

      const choice = await this.askNumber("Choose: ");

      if (choice === 0) return;
      if (choice === 2) {
        const gained = this.sellAll();
        console.log(gained > 0 ? `Sold all for +${gained} fuel.` : "Nothing valuable to sell.");
        continue;
      }
      if (choice === 1) {
        await this.sellSpecific();
        continue;
      }

      console.log("Wrong. wrong. wrong. Try again");
    }
  }

  private async sellSpecific(): Promise<void> {
    console.log("\nPick resource type:");
    
    for (let i = 0; i < resTypes.length; i++) {
      const t = resTypes[i]!;
      console.log(`${i + 1}) ${t} (price ${fuelPrices[t]})`);
    }
    console.log("0) Back");

    const pick = await this.askNumber("Type number: ");
    if (pick === 0) return;

    const type = resTypes[pick - 1];
    if (!type) {
      console.log("Wrong. Wrong. wrong. \n");
      return;
    }

    const have = this.player.inventory[type];
    console.log(`You have: ${have} ${type}`);

    const amount = await this.askNumber("How many to sell? ");
    if (amount <= 0) {
      console.log("Amount must be > 0.");
      return;
    }
    if (amount > have) {
      console.log("Not enough resources.");
      return;
    }

    this.player.removeResource(type, amount);
    const gainedFuel = amount * fuelPrices[type];
    this.player.addFuel(gainedFuel);

    console.log(`Sold ${amount} ${type} for +${gainedFuel} fuel.`);
  }

  private sellAll(): number {
    let gained = 0;

    for (const t of resTypes) {
      const have = this.player.inventory[t];
      if (have <= 0) continue;

      this.player.removeResource(t, have);
      gained += have * fuelPrices[t];
    }

    this.player.addFuel(gained);
    return gained;
  }
}
