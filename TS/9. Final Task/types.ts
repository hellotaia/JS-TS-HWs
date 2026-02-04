export interface IPlanet {
    name: string;
    position: number;
    description?: string;
}

export type ResourceType = 'sand' | 'water' | 'silver' | 'gold'| 'diamond'| 'alienArtifact';
export type Inventory = Record<ResourceType, number>;

export interface IPlayer {
    name: string;
    location: IPlanet;
    fuelLevel: number;
    inventory: Inventory;
    fuelCapacity: number;
}

export type Event =
|{kind: "nothing"}
|{kind: "resources"; drop: Array<{type: ResourceType; amount: number}>;}
|{kind: "trader"}
|{kind: "malfunction"; leak: number};