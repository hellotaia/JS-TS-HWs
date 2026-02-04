import { IPlanet, Event, ResourceType } from "./types";

export function fetchData<T> (valueFactory: () => T, delay= 200): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(valueFactory());
        }, delay);
    });
}

export const planets: IPlanet[] = [
    {name: "Earth", 
        position: 0, 
        description: "Home. Blue planet full of life."
    },
    {name: "Venus", 
        position: 10, 
        description: "The hottest planet, covered in thick, heat-trapping clouds"
    },
    { name: "Mars", 
        position: 20,
        description: "The Red Planet, known for its iron-rich soil, large volcanoes, and thin atmosphere" 
    },
    { name: "Mercury", 
    position: 30,
    description: "The smallest planet, closest to the Sun, with a rocky, cratered surface"
    },
    { name: "Jupiter", 
    position: 40,
    description: "The largest planet, a gas giant known for its Great Red Spot and many moons"
    },
    { name: "Saturn",
    position: 50,
    description: "A gas giant famous for its extensive, bright ring system"
    },
    { name: "Uranus", 
    position: 60,
    description: "An ice giant that rotates on its side with a distinct blue-green color"
    },
    { name: "Neptune",
    position: 70,
    description: "The most distant, cold, and windy ice giant"
    },
    {name: "Pluto", 
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
    water:1,
    silver:2, 
    gold:3,
    diamond:5,
    alienArtifact:20
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
export function findPlanetByName(name: string): Promise<IPlanet | undefined> {
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