import { Player } from "./Player.js";
import { Game } from "./Game.js";
import { getAllPlanets } from "./api.js";

async function main(): Promise<void> {
    const all = await getAllPlanets();
    const earth = all.find((p) => p.name === "Earth");
    if (!earth) throw new Error("Earth not found");

    const player = new Player("Sheppard", 100, earth);
    const game = new Game(player);

    game.start();
}

main().catch((e: unknown) => {
    console.log("---FATAL ERROR---");
    console.log(String(e));
});