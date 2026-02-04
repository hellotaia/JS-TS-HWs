/**
 * Cosmic Adventure - Space Exploration Game
 * JavaScript Game Logic (adapted from TypeScript)
 */

// ============================================
// DATA & CONSTANTS
// ============================================

const planets = [
    { name: "Earth", position: 0, description: "Home. Blue planet full of life.", icon: "🌍" },
    { name: "Venus", position: 10, description: "The hottest planet, covered in thick, heat-trapping clouds", icon: "🟠" },
    { name: "Mars", position: 20, description: "The Red Planet, known for its iron-rich soil, large volcanoes, and thin atmosphere", icon: "🔴" },
    { name: "Mercury", position: 30, description: "The smallest planet, closest to the Sun, with a rocky, cratered surface", icon: "⚫" },
    { name: "Jupiter", position: 40, description: "The largest planet, a gas giant known for its Great Red Spot and many moons", icon: "🟤" },
    { name: "Saturn", position: 50, description: "A gas giant famous for its extensive, bright ring system", icon: "🪐" },
    { name: "Uranus", position: 60, description: "An ice giant that rotates on its side with a distinct blue-green color", icon: "🔵" },
    { name: "Neptune", position: 70, description: "The most distant, cold, and windy ice giant", icon: "💙" },
    { name: "Pluto", position: 80, description: "Complex, icy world located in the Kuiper Belt beyond Neptune", icon: "⚪" }
];

const fuelPrices = {
    sand: 0,
    water: 1,
    silver: 2,
    gold: 3,
    diamond: 5,
    alienArtifact: 20
};

const resourceIcons = {
    sand: "🏜️",
    water: "💧",
    silver: "🥈",
    gold: "🥇",
    diamond: "💎",
    alienArtifact: "👽"
};

const phrases = {
    nothing: [
        "Nothing happened.",
        "Still nothing happened.",
        "Wow. Empty.",
        "Space is doing space.",
        "Cool. Air. Lots of air.",
        "You blink. Nothing changes.",
        "Empty moment achieved."
    ],
    malfunction: [
        "Ship made a noise. Bad noise.",
        "Oops. Fuel gone.",
        "Something broke. Again.",
        "Ship is tired. Fuel leaked.",
        "You hear hissing. That was fuel.",
        "ЯРІК, БОЧОК ПОТІК",
        "Red light blinked. You panic. Fuel leaves.",
        "Your ship coughed. It was expensive.",
        "You press nothing. It breaks anyway.",
        "The ship is held together by hope. Hope failed.",
        "Maintenance is for losers. Now you pay."
    ],
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
    gameOver: [
        "No fuel.",
        "You are stuck. Forever.",
        "Space wins.",
        "You drift. Slowly. Like your career.",
        "Congratulations. You lost.",
        "ГАБЕЛІ.",
        "FAIL."
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
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// PLAYER CLASS
// ============================================

class Player {
    constructor(name, fuelLevel, location) {
        this.name = name;
        this.location = location;
        this.fuelLevel = fuelLevel;
        this.fuelCapacity = 100;
        this.inventory = { sand: 0, water: 0, silver: 0, gold: 0, diamond: 0, alienArtifact: 0 };
    }

    getTravelCost(destination) {
        return Math.abs(destination.position - this.location.position);
    }

    travelTo(destination) {
        const cost = this.getTravelCost(destination);
        if (cost > this.fuelLevel) {
            return false;
        }
        this.fuelLevel -= cost;
        this.location = destination;
        return true;
    }

    addFuel(amount) {
        this.fuelLevel = Math.min(this.fuelLevel + amount, 999);
    }

    fuelLeak(amount) {
        this.fuelLevel -= amount;
        if (this.fuelLevel < 0) this.fuelLevel = 0;
    }

    addResource(type, amount) {
        this.inventory[type] += amount;
    }

    removeResource(type, amount) {
        if (this.inventory[type] < amount) return false;
        this.inventory[type] -= amount;
        return true;
    }

    getTotalResourceValue() {
        let total = 0;
        for (const [type, count] of Object.entries(this.inventory)) {
            total += count * fuelPrices[type];
        }
        return total;
    }
}

// ============================================
// GAME CLASS
// ============================================

class Game {
    constructor() {
        this.player = null;
        this.planets = [...planets].sort((a, b) => a.position - b.position);
        this.isGameOver = false;
        this.traderActive = false;
        this.init();
    }

    init() {
        const earth = this.planets.find(p => p.name === "Earth");
        this.player = new Player("Sheppard", 100, earth);
        this.isGameOver = false;
        this.traderActive = false;
        this.updateUI();
        this.closeModals();
    }

    restart() {
        this.init();
        this.clearLog();
        this.addLog("Welcome back, Captain! Your cosmic adventure begins on Earth.", "welcome");
        this.addLog("[GAME RULES]: Press buttons. Fly places. Fuel go bye-bye. Sometimes aliens show up.", "info");
        this.addLog("No fuel = you sad. Game over.", "warning");
    }

    // ==================
    // UI UPDATE METHODS
    // ==================

    updateUI() {
        // Update player name
        document.getElementById("player-name").textContent = this.player.name;
        
        // Update location
        document.getElementById("current-location").textContent = this.player.location.name;
        
        // Update fuel bar
        const fuelBar = document.getElementById("fuel-bar");
        const fuelLevel = document.getElementById("fuel-level");
        const fuelPercent = Math.min((this.player.fuelLevel / 100) * 100, 100);
        fuelBar.style.width = `${fuelPercent}%`;
        fuelLevel.textContent = this.player.fuelLevel;
        
        if (this.player.fuelLevel <= 30) {
            fuelBar.classList.add("low");
        } else {
            fuelBar.classList.remove("low");
        }
        
        // Update inventory
        for (const [type, count] of Object.entries(this.player.inventory)) {
            const countEl = document.getElementById(`${type}-count`);
            if (countEl) {
                countEl.textContent = count;
                const item = countEl.closest(".inventory-item");
                if (count > 0) {
                    item.classList.add("has-items");
                } else {
                    item.classList.remove("has-items");
                }
            }
        }
        
        // Update total value
        document.getElementById("total-value").textContent = `${this.player.getTotalResourceValue()}⛽`;
        
        // Check game over
        if (this.player.fuelLevel <= 0 && !this.isGameOver) {
            this.gameOver();
        }
    }

    addLog(message, type = "") {
        const log = document.getElementById("event-log");
        const entry = document.createElement("div");
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    clearLog() {
        const log = document.getElementById("event-log");
        log.innerHTML = "";
    }

    // ==================
    // MODAL METHODS
    // ==================

    closeModals() {
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    }

    openTravelMenu() {
        if (this.isGameOver) return;
        
        const planetList = document.getElementById("planet-list");
        planetList.innerHTML = "";
        
        for (const planet of this.planets) {
            const cost = this.player.getTravelCost(planet);
            const isCurrent = planet.name === this.player.location.name;
            const canAfford = cost <= this.player.fuelLevel;
            
            const item = document.createElement("div");
            item.className = `planet-item ${isCurrent ? "current" : ""} ${!canAfford && !isCurrent ? "disabled" : ""}`;
            
            item.innerHTML = `
                <span class="planet-icon">${planet.icon}</span>
                <div class="planet-info">
                    <div class="planet-name">${planet.name}</div>
                    <div class="planet-position">Position: ${planet.position}</div>
                </div>
                ${isCurrent 
                    ? '<span class="planet-current-tag">📍 You are here</span>' 
                    : `<span class="planet-cost ${cost === 0 ? 'free' : ''}">${cost}⛽</span>`}
            `;
            
            if (!isCurrent && canAfford) {
                item.addEventListener("click", () => this.travelTo(planet));
            }
            
            planetList.appendChild(item);
        }
        
        document.getElementById("travel-modal").classList.add("active");
    }

    // ==================
    // TRAVEL & EVENTS
    // ==================

    async travelTo(planet) {
        this.closeModals();
        
        const cost = this.player.getTravelCost(planet);
        this.addLog(`🚀 Traveling to ${planet.name} (cost: ${cost}⛽)...`, "info");
        
        await delay(500);
        
        this.player.travelTo(planet);
        this.addLog(`✅ Arrived at ${planet.name}. Remaining fuel: ${this.player.fuelLevel}`, "success");
        
        this.updateUI();
        
        // Generate random event
        await delay(300);
        await this.triggerEvent();
    }

    async triggerEvent() {
        if (this.player.location.name === "Earth") {
            this.addLog(`[EVENT]: ${pickRandom(phrases.nothing)}`, "event");
            return;
        }
        
        const chance = getRandom(1, 100);
        
        if (chance <= 20) {
            // Nothing happens
            this.addLog(`[EVENT]: ${pickRandom(phrases.nothing)}`, "event");
        } else if (chance <= 75) {
            // Resources found
            await this.resourceEvent();
        } else if (chance <= 90) {
            // Trader appears
            await this.traderEvent();
        } else {
            // Malfunction
            await this.malfunctionEvent();
        }
        
        this.updateUI();
    }

    async resourceEvent() {
        this.addLog(`[EVENT][RESOURCES]: ${pickRandom(phrases.resources)}`, "success");
        
        const dropsCount = this.getDropsAmount();
        
        for (let i = 0; i < dropsCount; i++) {
            const resourceType = this.getRandomResource();
            const amount = this.getRandomResourceAmount(resourceType);
            this.player.addResource(resourceType, amount);
            this.addLog(`   + ${amount} ${resourceType} (${resourceIcons[resourceType]}) - value: ${fuelPrices[resourceType]}⛽ each`, "success");
        }
    }

    async malfunctionEvent() {
        const leak = getRandom(3, 20);
        this.addLog(`[EVENT][MALFUNCTION]: ${pickRandom(phrases.malfunction)}`, "danger");
        this.addLog(`   ⚠️ Fuel leak: -${leak}⛽`, "danger");
        this.player.fuelLeak(leak);
    }

    async traderEvent() {
        this.addLog(`[EVENT][TRADER]: ${pickRandom(phrases.trader)}`, "event");
        this.openTrader();
    }

    getDropsAmount() {
        const chance = getRandom(1, 100);
        if (chance <= 65) return 1;
        if (chance <= 90) return 2;
        return 3;
    }

    getRandomResource() {
        const chance = getRandom(1, 100);
        if (chance <= 45) return "sand";
        if (chance <= 55) return "water";
        if (chance <= 75) return "silver";
        if (chance <= 90) return "gold";
        if (chance <= 98) return "diamond";
        return "alienArtifact";
    }

    getRandomResourceAmount(type) {
        if (type === "sand") return getRandom(5, 20);
        if (type === "water") return getRandom(1, 6);
        if (type === "silver") return getRandom(1, 4);
        if (type === "gold") return getRandom(1, 3);
        if (type === "diamond") return getRandom(1, 2);
        return 1;
    }

    // ==================
    // TRADER METHODS
    // ==================

    openTrader() {
        this.traderActive = true;
        document.getElementById("trader-greeting").textContent = pickRandom(phrases.trader);
        this.updateTraderInventory();
        document.getElementById("trader-modal").classList.add("active");
    }

    updateTraderInventory() {
        const container = document.getElementById("trader-inventory");
        container.innerHTML = "";
        
        const resourceTypes = ["sand", "water", "silver", "gold", "diamond", "alienArtifact"];
        
        for (const type of resourceTypes) {
            const count = this.player.inventory[type];
            const price = fuelPrices[type];
            
            const item = document.createElement("div");
            item.className = "trade-item";
            item.innerHTML = `
                <div class="trade-resource">
                    <span class="trade-resource-icon">${resourceIcons[type]}</span>
                    <div class="trade-resource-info">
                        <div class="trade-resource-name">${type}</div>
                        <div class="trade-resource-count">You have: ${count} | Price: ${price}⛽ each</div>
                    </div>
                </div>
                <button class="trade-sell-btn" ${count === 0 ? "disabled" : ""} onclick="game.sellResource('${type}')">
                    Sell All (+${count * price}⛽)
                </button>
            `;
            container.appendChild(item);
        }
    }

    sellResource(type) {
        const count = this.player.inventory[type];
        if (count === 0) return;
        
        const gained = count * fuelPrices[type];
        this.player.removeResource(type, count);
        this.player.addFuel(gained);
        
        this.addLog(`💰 Sold ${count} ${type} for +${gained}⛽`, "success");
        this.updateUI();
        this.updateTraderInventory();
    }

    sellAll() {
        let totalGained = 0;
        const resourceTypes = ["sand", "water", "silver", "gold", "diamond", "alienArtifact"];
        
        for (const type of resourceTypes) {
            const count = this.player.inventory[type];
            if (count > 0) {
                const gained = count * fuelPrices[type];
                this.player.removeResource(type, count);
                totalGained += gained;
            }
        }
        
        if (totalGained === 0) {
            this.addLog(`${pickRandom(phrases.sellNothing)}`, "warning");
        } else {
            this.player.addFuel(totalGained);
            this.addLog(`💰 Sold all resources for +${totalGained}⛽`, "success");
        }
        
        this.updateUI();
        this.updateTraderInventory();
    }

    closeTrader() {
        this.traderActive = false;
        document.getElementById("trader-modal").classList.remove("active");
    }

    // ==================
    // INFO METHODS
    // ==================

    showPlanetInfo() {
        if (this.isGameOver) return;
        
        const planet = this.player.location;
        this.addLog(`📍 [PLANET INFO]`, "info");
        this.addLog(`   Name: ${planet.name} ${planet.icon}`, "info");
        this.addLog(`   Position: ${planet.position}`, "info");
        this.addLog(`   Description: ${planet.description || "No description"}`, "info");
    }

    showInventoryInfo() {
        if (this.isGameOver) return;
        
        this.addLog(`🎒 [INVENTORY INFO]`, "info");
        
        let hasItems = false;
        for (const [type, count] of Object.entries(this.player.inventory)) {
            if (count > 0) {
                hasItems = true;
                this.addLog(`   ${resourceIcons[type]} ${type}: ${count} (worth ${count * fuelPrices[type]}⛽)`, "info");
            }
        }
        
        if (!hasItems) {
            this.addLog(`   Empty cargo bay!`, "warning");
        }
        
        this.addLog(`   Total cargo value: ${this.player.getTotalResourceValue()}⛽`, "success");
    }

    // ==================
    // GAME OVER
    // ==================

    gameOver() {
        this.isGameOver = true;
        document.getElementById("gameover-message").textContent = pickRandom(phrases.gameOver);
        document.getElementById("gameover-modal").classList.add("active");
        this.addLog(`💀 GAME OVER: ${pickRandom(phrases.gameOver)}`, "danger");
    }
}

// ============================================
// INITIALIZE GAME
// ============================================

const game = new Game();
