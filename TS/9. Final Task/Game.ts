import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";

import type { IPlanet, Event, ResourceType } from "./types.js";
import { fuelPrices, getAllPlanets, getRandomEvent, pickRandom, phrases } from "./api.js";
import { Player } from "./Player.js";

const resTypes: ResourceType[] = ["sand", "water", "silver", "gold", "diamond", "alienArtifact"];

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


    console.log(`
░█▄█░█▀█░█▀▀░█▀▀░░░█▀▀░█▀▀░█▀▀░█▀▀░█▀▀░▀█▀░░░░░░░░░█▀▀
░█░█░█▀█░▀▀█░▀▀█░░░█▀▀░█▀▀░█▀▀░█▀▀░█░░░░█░░░░▄▄▄░░░▀▀▄
░▀░▀░▀░▀░▀▀▀░▀▀▀░░░▀▀▀░▀░░░▀░░░▀▀▀░▀▀▀░░▀░░░░░░░░░░▀▀░
  `);
    console.log("\n=== Cosmic Adventure ===\n");
    console.log(`Welcome, Captain ${this.player.name}!\n`);
    console.log(`[GAME RULES]: \nPress numbers. Fly places. Fuel go bye-bye. 
    Sometimes aliens show up.`);
    console.log(`No fuel = you sad. Game over\n`)

    while (this.player.fuelLevel > 0) {
      this.printStatus();

      const action = await this.askMainMenu();

      if (action === 4) break;

      if (action === 1) {
        await this.travelMenu();
        continue;
      }

      if (action === 2) {
        await this.planetInfo();
        continue;
      }

      if (action === 3) {
        this.inventoryInfo();
        continue;
      }

      console.log(`${pickRandom(phrases.chooseWrong)}\n`);
    }

    console.log(this.player.fuelLevel <= 0 ? `\n${pickRandom(phrases.gameOver)}\nGame over.\nBye.` : `\n${pickRandom(phrases.quit)}\nBye.`);
    await this.readline.close();
  }

  private printStatus(): void {
    console.log(`\nCurrent location: ${this.player.location.name} (${this.player.location.position})`);
    console.log(`Fuel: ${this.player.fuelLevel}`);
  }

  private async askMainMenu(): Promise<number> {
    console.log("\n--- Main menu ---");
    console.log("1) Where to travel");
    console.log("2) Planet info");
    console.log("3) Resources info");
    console.log("4) Quit");

    return this.askNumber("Choose (1-4): ");
  }

  private async travelMenu(): Promise<void> {
    while (true) {
      console.log("\n--- Choose your destination ---");
      this.printPlanetList();

      const choice = await this.askNumber("\nPick a planet number (0 = back): ");
      if (choice === 0) return;

      const target = this.planets[choice - 1];
      if (!target) {
        console.log(`${pickRandom(phrases.chooseWrong)}\n`);
        continue;
      }

      if (target.name === this.player.location.name) {
        console.log(`${pickRandom(phrases.samePlanet)}\n`);
        continue;
      }

      await this.tryTravel(target);
      return;
    }
  }

  private async planetInfo(): Promise<void> {
    console.log("\n--- Planet info ---");
    console.log(`\n[PLANET INFO]: \nName: ${this.player.location.name}`);
    console.log(`Position: ${this.player.location.position}`);
    console.log(`Description: ${this.player.location.description ?? "No description"}`);
    console.log("");
  }

  private inventoryInfo(): void {
    console.log(`\n--- ${this.player.name}'s Resources: ---`);
    console.log(this.player.currentInventory());

    console.log(
      `Prices (fuel per 1): sand=${fuelPrices.sand}, water=${fuelPrices.water}, silver=${fuelPrices.silver}, gold=${fuelPrices.gold}, diamond=${fuelPrices.diamond}, alienArtifact=${fuelPrices.alienArtifact}`
    );

    let totalValue = 0;
    for (const t of resTypes) {
      totalValue += this.player.inventory[t] * fuelPrices[t];
    }

    console.log(`If you sell ALL your resources to trader: +${totalValue} fuel\n`);
  }

  private printPlanetList(): void {
    for (let i = 0; i < this.planets.length; i++) {
      const p = this.planets[i]!;
      const cost = Math.abs(p.position - this.player.location.position);
      const here = p.name === this.player.location.name ? "  <-- you are here" : "";
      console.log(`${i + 1}) ${p.name} [pos=${p.position}] cost=${cost}${here}`);
    }
  }

  private async askNumber(text: string): Promise<number> {
    const raw = (await this.readline.question(text)).trim();
    const num = Number(raw);

    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      console.log("Incorrect format. Should be integer.\n");
      return this.askNumber(text);
    }

    return num;
  }

  private async tryTravel(target: IPlanet): Promise<void> {
    const cost = Math.abs(target.position - this.player.location.position);

    if (cost > this.player.fuelLevel) {
      console.log(`${pickRandom(phrases.notEnoughFuel)}. \nWe need ${cost}, but have only ${this.player.fuelLevel}.\n`);
      return;
    }

    console.log(`\nTraveling to ${target.name} (cost ${cost})...`);
    this.player.destinationTarget(target);

    const evnt = await getRandomEvent(target.name);
    await this.applyEvent(evnt);
    console.log("");
  }

  private async applyEvent(evnt: Event): Promise<void> {
    if (evnt.kind === "nothing") {
      console.log(`\n[EVENT]: ${pickRandom(phrases.nothing)}`);
      return;
    }

    if (evnt.kind === "malfunction") {
      console.log(`\n[EVENT]: ${pickRandom(phrases.malfunction)} Fuel leak: -${evnt.leak}`);
      this.player.fuelLeak(evnt.leak);
      return;
    }

    if (evnt.kind === "resources") {
      console.log(`\n[EVENT][RESOURCES]: ${pickRandom(phrases.resources)}`);
      for (const d of evnt.drop) {
        this.player.addResource(d.type, d.amount);
        console.log(`- ${d.amount} ${d.type} (value: ${fuelPrices[d.type]} fuel for each)`);
      }
      return;
    }

    console.log(`\n[EVENT][TRADER] ${pickRandom(phrases.trader)} Trade resources for fuel.`);
    await this.traderMenu();
  }

  private async traderMenu(): Promise<void> {
    while (true) {
      console.log(`\nFuel: ${this.player.fuelLevel}`);
      console.log(this.player.currentInventory());
      console.log(
        `Prices: sand=${fuelPrices.sand}, water=${fuelPrices.water}, silver=${fuelPrices.silver}, gold=${fuelPrices.gold}, diamond=${fuelPrices.diamond}, alienArtifact=${fuelPrices.alienArtifact}`
      );

      console.log("\nTrader menu:");
      console.log("1) Sell specific resource");
      console.log("2) Sell all");
      console.log("0) Leave");

      const choice = await this.askNumber("Choose: ");

      if (choice === 0) return;

      if (choice === 2) {
        const gained = this.sellAll();
        console.log(gained > 0 ? `\nSold all for +${gained} fuel.` : `${pickRandom(phrases.sellNothing)}`);
        continue;
      }

      if (choice === 1) {
        await this.sellSpecific();
        continue;
      }

      console.log(`${pickRandom(phrases.chooseWrong)}`);
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
      console.log("Wrong.\n");
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

    console.log(`\nSold ${amount} ${type} for +${gainedFuel} fuel.`);
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
