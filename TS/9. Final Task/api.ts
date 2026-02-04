import { IPlanet, Event, ResourceType } from "./types.js";

export async function fetchData<T>(valueFactory: () => T, delay = 200): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(valueFactory());
        }, delay);
    });
}

export const planets: IPlanet[] = [
    {
        name: "Earth",
        position: 0,
        description: "Home. Blue planet full of life."
    },
    {
        name: "Venus",
        position: 10,
        description: "The hottest planet, covered in thick, heat-trapping clouds"
    },
    {
        name: "Mars",
        position: 20,
        description: "The Red Planet, known for its iron-rich soil, large volcanoes, and thin atmosphere"
    },
    {
        name: "Mercury",
        position: 30,
        description: "The smallest planet, closest to the Sun, with a rocky, cratered surface"
    },
    {
        name: "Jupiter",
        position: 40,
        description: "The largest planet, a gas giant known for its Great Red Spot and many moons"
    },
    {
        name: "Saturn",
        position: 50,
        description: "A gas giant famous for its extensive, bright ring system"
    },
    {
        name: "Uranus",
        position: 60,
        description: "An ice giant that rotates on its side with a distinct blue-green color"
    },
    {
        name: "Neptune",
        position: 70,
        description: "The most distant, cold, and windy ice giant"
    },
    {
        name: "Pluto",
        position: 80,
        description: "Complex, icy world located in the Kuiper Belt beyond Neptune. Once the ninth planet, it is now the most famous dwarf planet in our solar system"
    }
];


function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Resources and Prices
export const fuelPrices: Record<ResourceType, number> = {
    sand: 0,
    water: 1,
    silver: 2,
    gold: 3,
    diamond: 5,
    alienArtifact: 20
};

function getDropsAmount(): number {
    const chance = getRandom(1, 100);
    if (chance <= 65) return 1;
    if (chance <= 90) return 2;
    return 3;
}

function getRandomResource(): ResourceType {
    const chance = getRandom(1, 100);
    if (chance <= 45) return 'sand';
    if (chance <= 55) return 'water';
    if (chance <= 75) return 'silver';
    if (chance <= 90) return 'gold';
    if (chance <= 98) return 'diamond';
    return 'alienArtifact';
}

function getRandomResourceAmount(type: ResourceType): number {
    if (type === 'sand') return getRandom(5, 20);
    if (type === 'water') return getRandom(1, 6);
    if (type === 'silver') return getRandom(1, 4);
    if (type === 'gold') return getRandom(1, 3);
    if (type === 'diamond') return getRandom(1, 2);
    return 1;
}
//--End Resources and Prices

//Planets
export function getAllPlanets(): Promise<IPlanet[]> {
    return fetchData(() => planets, 120);
}
export function getAvailablePlanets(currentPlanetName: string): Promise<IPlanet[]> {
    return fetchData(() => planets.filter(p => p.name !== currentPlanetName), 120);
}
export async function findPlanetByName(name: string): Promise<IPlanet | undefined> {
    return fetchData(() => planets.find((p) => p.name.toLowerCase() === name.toLowerCase()), 120);
}

//Events

export function getRandomEvent(planetName: string): Promise<Event> {
    if (planetName === "Earth") {
        return fetchData(() => ({ kind: "nothing" }), 100);
    }

    return fetchData(() => {
        const chance = getRandom(1, 100);

        if (chance <= 20) {
            return { kind: "nothing" };
        }

        if (chance <= 75) {
            const dropsCount = getDropsAmount();
            const drop: Array<{ type: ResourceType; amount: number }> = [];
            for (let i = 0; i < dropsCount; i++) {
                const resourceType = getRandomResource();
                const amount = getRandomResourceAmount(resourceType);
                drop.push({ type: resourceType, amount });
            }
            return { kind: "resources", drop };
        }

        if (chance <= 90) {
            return { kind: "trader" };
        }
        const leak = getRandom(3, 20);
        return { kind: "malfunction", leak };
    }, 100);
}

//Phrases
export const phrases = {
    //
    nothing: [
        "Nothing happened.",
        "Still nothing happened.",
        "Wow. Empty.",
        "Space is doing space.",
        "Cool. Air. Lots of air.",
        "You blink. Nothing changes.",
        "Empty moment achieved."
    ],
    //
    malfunction: [
        "Ship made a noise. Bad noise.",
        "Oops. Fuel gone.",
        "Something broke. Again.",
        "Ship is tired. Fuel leaked.",
        "You hear hissing. That was fuel.",
        "Red light blinked. You panic. Fuel leaves.",
        "Your ship coughed. It was expensive.",
        "You press nothing. It breaks anyway.",
        "The ship is held together by hope. Hope failed.",
        "Maintenance is for losers. Now you pay."
    ],
    //
    resources: [
        "You found stuff.",
        "Shiny trash detected.",
        "This might be useful. Or not.",
        "You found junk. You feel rich.",
        "You grabbed space trash. Congrats.",
        "Resource moment. Dopamine +1.",
        "It sparkles. You take it.",
        "You pick up things. Like a raccoon. Ew."
    ],
    //
    trader: [
        "Alien shows up.",
        "Weird guy wants your junk.",
        "Green dude. Bad smile.",
        "Alien trading time. No refunds.",
        "This feels unsafe.",
        "Alien says: give trash. I say: give fuel.",
        "Trade offer: your stuff for survival.",
        "Alien capitalism activated."
    ],
    //
    chooseWrong: [
        "Wrong button. Try again.",
        "No. Not that.",
        "Numbers are hard, huh?",
        "That choice makes no sense.",
        "Invalid input.",
        "Pick a real option.",
        "Nope. Try again, captain."
    ],
    //
    notEnoughFuel: [
        "No fuel.",
        "Nice try. No fuel.",
        "Fuel = low. Plan = bad.",
        "You forgot fuel. Again.",
        "You can’t fly on confidence.",
        "Your tank is empty.",
        "Not enough fuel. Sit down.",
        "You stare at the stars. They do not help. No fuel.",
        "Walking is not an option.",
        "You are grounded. In space."
    ],
    //
    samePlanet: [
        "You are already here.",
        "Same planet. Same you.",
        "No movement achieved.",
        "Navigation level: potato.",
        "Congrats. You travelled 0 meters.",
        "You selected the same place. Again.",
        "Big brain move. You stayed.",
        "You tried to leave. You didn’t."
    ],

    //
    gameOver: [
        "No fuel.",
        "You are stuck. Forever.",
        "Space wins.",
        "You drift. Slowly. Like your career.",
        "Congratulations. You lost.",
        "FAIL."
    ],
    //
    quit: [
        "Bye.",
        "You quit.",
        "Exit pressed. Respect.",
        "Probably the right choice.",
        "Bye-bye",
        "You left before the ship did."
    ],
    sellNothing: [
        "You have nothing to sell.",
        "Empty pockets. Sad.",
        "No trash. No fuel.",
        "You tried to sell air. Alien left.",
        "Nice inventory. It is zero.",
        "You are poor.",
        "Nothing valuable to sell"
    ]
} as const;
export function pickRandom<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
