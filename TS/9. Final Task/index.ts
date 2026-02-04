import { Player } from "./Player";  
import { Game } from "./Game";
import { getAllPlanets } from "./api";

async function main(): Promise<void>{
    const all = await getAllPlanets();
    const earth = all.find((p)=>p.name === "Earth");
    if (!earth) throw new Error ("Earth not found");

    const player = new Player ("Sheppard", 100, earth);
    const game = new Game (player);

    game.start();
}

main().catch((e: unknown) => {
    console.log ("---FATAL ERROR---");
    console.log(String (e));
});