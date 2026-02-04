"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var promises_1 = require("node:readline/promises");
var node_process_1 = require("node:process");
var api_js_1 = require("./api.js");
var resTypes = ["sand", "water", "silver", "gold", "diamond", "alienArtifact"];
var Game = /** @class */ (function () {
    function Game(player) {
        this.readline = (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout });
        this.planets = [];
        this.player = player;
    }
    Game.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var all, choice, target;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, api_js_1.getAllPlanets)()];
                    case 1:
                        all = _a.sent();
                        this.planets = __spreadArray([], all, true).sort(function (a, b) { return a.position - b.position; });
                        console.log("\n=== Cosmic Adventure ===\n");
                        console.log("Welcome abroad, Captain ".concat(this.player.name));
                        _a.label = 2;
                    case 2:
                        if (!(this.player.fuelLevel > 0)) return [3 /*break*/, 5];
                        this.printStatus();
                        this.printPlanetMenu();
                        return [4 /*yield*/, this.askNumber("\nPick a planet number (0 = quit): ")];
                    case 3:
                        choice = _a.sent();
                        if (choice === 0)
                            return [3 /*break*/, 5];
                        target = this.planets[choice - 1];
                        if (!target) {
                            console.log("Wrong number\n");
                            return [3 /*break*/, 2];
                        }
                        if (target.name === this.player.location.name) {
                            console.log("Come on, you're already here..)\n");
                            return [3 /*break*/, 2];
                        }
                        return [4 /*yield*/, this.tryTravel(target)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        console.log(this.player.fuelLevel <= 0 ? "\nOut of fuel. Game over." : "\nBye.");
                        return [4 /*yield*/, this.readline.close()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.printStatus = function () {
        console.log("\nLocation: ".concat(this.player.location.name, " (").concat(this.player.location.position, ")"));
        console.log("Fuel: ".concat(this.player.fuelLevel));
        console.log("Inventory: ".concat(this.player.currentInventory()));
    };
    Game.prototype.printPlanetMenu = function () {
        console.log("\n---Choose your destination: ");
        for (var i = 0; i < this.planets.length; i++) {
            var p = this.planets[i];
            var cost = Math.abs(p.position - this.player.location.position);
            var here = p.name === this.player.location.name ? "  <-- you are here" : "";
            console.log("".concat(i + 1, ") ").concat(p.name, " [position = ").concat(p.position, "] cost = ").concat(cost).concat(here));
        }
    };
    Game.prototype.askNumber = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var raw, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readline.question(text)];
                    case 1:
                        raw = (_a.sent()).trim();
                        num = Number(raw);
                        if (!Number.isFinite(num) || !Number.isInteger(num)) {
                            console.log("It is not integer\n");
                            return [2 /*return*/, this.askNumber(text)];
                        }
                        return [2 /*return*/, num];
                }
            });
        });
    };
    Game.prototype.tryTravel = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var cost, evnt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cost = Math.abs(target.position - this.player.location.position);
                        if (cost > this.player.fuelLevel) {
                            console.log("Not enough fuel. We need ".concat(cost, ", but have only ").concat(this.player.fuelLevel, ".\n"));
                            return [2 /*return*/];
                        }
                        console.log("Traveling to ".concat(target.name, " (cost ").concat(cost, ")..."));
                        this.player.destinationTarget(target);
                        console.log("Arrived at ".concat(target.name, "."));
                        return [4 /*yield*/, (0, api_js_1.getRandomEvent)(target.name)];
                    case 1:
                        evnt = _a.sent();
                        return [4 /*yield*/, this.applyEvent(evnt)];
                    case 2:
                        _a.sent();
                        console.log("");
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.applyEvent = function (evnt) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, d;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (evnt.kind === "nothing") {
                            console.log("\n[EVENT]: Nothing happened");
                            return [2 /*return*/];
                        }
                        if (evnt.kind === "malfunction") {
                            console.log("\n[EVENT]: Malfunction! Fuel leak: -".concat(evnt.leak));
                            this.player.fuelLeak(evnt.leak);
                            return [2 /*return*/];
                        }
                        if (evnt.kind === "resources") {
                            console.log("\n[EVENT] You found resources:");
                            for (_i = 0, _a = evnt.drop; _i < _a.length; _i++) {
                                d = _a[_i];
                                this.player.addResource(d.type, d.amount);
                                console.log("- ".concat(d.amount, " ").concat(d.type, " (value: ").concat(api_js_1.fuelPrices[d.type], " fuel each)"));
                            }
                            return [2 /*return*/];
                        }
                        console.log("WOW! Its friendly alien trader! Trade resources for fuel.");
                        return [4 /*yield*/, this.traderMenu()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.traderMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var choice, gained;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 4];
                        console.log("\nFuel: ".concat(this.player.fuelLevel));
                        console.log("Inventory: ".concat(this.player.currentInventory()));
                        console.log("Prices: \n        sand=".concat(api_js_1.fuelPrices.sand, ", \n        water=").concat(api_js_1.fuelPrices.water, ", \n        silver=").concat(api_js_1.fuelPrices.silver, ",\n        gold=").concat(api_js_1.fuelPrices.gold, ",\n        diamond=").concat(api_js_1.fuelPrices.diamond, ",\n        alienArtifact=").concat(api_js_1.fuelPrices.alienArtifact));
                        console.log("\nTrader menu:");
                        console.log("1) Sell specific resource");
                        console.log("2) Sell all");
                        console.log("0) Leave");
                        return [4 /*yield*/, this.askNumber("Choose: ")];
                    case 1:
                        choice = _a.sent();
                        if (choice === 0)
                            return [2 /*return*/];
                        if (choice === 2) {
                            gained = this.sellAll();
                            console.log(gained > 0 ? "Sold all for +".concat(gained, " fuel.") : "Nothing valuable to sell.");
                            return [3 /*break*/, 0];
                        }
                        if (!(choice === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sellSpecific()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3:
                        console.log("Wrong. wrong. wrong. Try again");
                        return [3 /*break*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.sellSpecific = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, t, pick, type, have, amount, gainedFuel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\nPick resource type:");
                        for (i = 0; i < resTypes.length; i++) {
                            t = resTypes[i];
                            console.log("".concat(i + 1, ") ").concat(t, " (price ").concat(api_js_1.fuelPrices[t], ")"));
                        }
                        console.log("0) Back");
                        return [4 /*yield*/, this.askNumber("Type number: ")];
                    case 1:
                        pick = _a.sent();
                        if (pick === 0)
                            return [2 /*return*/];
                        type = resTypes[pick - 1];
                        if (!type) {
                            console.log("Wrong. Wrong. wrong. \n");
                            return [2 /*return*/];
                        }
                        have = this.player.inventory[type];
                        console.log("You have: ".concat(have, " ").concat(type));
                        return [4 /*yield*/, this.askNumber("How many to sell? ")];
                    case 2:
                        amount = _a.sent();
                        if (amount <= 0) {
                            console.log("Amount must be > 0.");
                            return [2 /*return*/];
                        }
                        if (amount > have) {
                            console.log("Not enough resources.");
                            return [2 /*return*/];
                        }
                        this.player.removeResource(type, amount);
                        gainedFuel = amount * api_js_1.fuelPrices[type];
                        this.player.addFuel(gainedFuel);
                        console.log("Sold ".concat(amount, " ").concat(type, " for +").concat(gainedFuel, " fuel."));
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.sellAll = function () {
        var gained = 0;
        for (var _i = 0, resTypes_1 = resTypes; _i < resTypes_1.length; _i++) {
            var t = resTypes_1[_i];
            var have = this.player.inventory[t];
            if (have <= 0)
                continue;
            this.player.removeResource(t, have);
            gained += have * api_js_1.fuelPrices[t];
        }
        this.player.addFuel(gained);
        return gained;
    };
    return Game;
}());
exports.Game = Game;
