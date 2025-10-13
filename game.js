// === GAME STATE SETUP ===
const defaultGameState = {
    // Primal
    primalEssence: 0,
    gatherers: 0,
    gathererCost: 10,
    stoneToolsLevel: 0,
    stoneToolsCost: 50,
    ritualDrumsLevel: 0,
    ritualDrumsCost: 250,
    // Ancient
    isAncientEraUnlocked: false,
    civicEssence: 0,
    scribes: 0,
    scribeCost: 10,
    // Synergy
    oralTraditionsLevel: 0,
    oralTraditionsCost: 1000,
};
let gameState = { ...defaultGameState };

// === DOM ELEMENT CACHING ===
// UX Elements
const floatingTextContainer = document.getElementById('floatingTextContainer');
// Header
const headerPrimalEssence = document.getElementById('headerPrimalEssence');
const headerPrimalPerSec = document.getElementById('headerPrimalPerSec');
const headerCivicContainer = document.getElementById('headerCivicContainer');
const headerCivicEssence = document.getElementById('headerCivicEssence');
const headerCivicPerSec = document.getElementById('headerCivicPerSec');
// Prehistoric Era
const ancientUnlockProgress = document.getElementById('ancientUnlockProgress');
const ancientUnlockCounter = document.getElementById('ancientUnlockCounter');
const ancientUnlockBar = document.getElementById('ancientUnlockBar');
const nurtureButton = document.getElementById('nurtureButton');
const nurturePowerDisplay = document.getElementById('nurturePowerDisplay');
const gathererCountDisplay = document.getElementById('gathererCountDisplay');
const gathererCostDisplay = document.getElementById('gathererCostDisplay');
const buyGathererButton = document.getElementById('buyGathererButton');
const stoneToolsLevelDisplay = document.getElementById('stoneToolsLevelDisplay');
const stoneToolsCostDisplay = document.getElementById('stoneToolsCostDisplay');
const buyStoneToolsButton = document.getElementById('buyStoneToolsButton');
const ritualDrumsLevelDisplay = document.getElementById('ritualDrumsLevelDisplay');
const ritualDrumsCostDisplay = document.getElementById('ritualDrumsCostDisplay');
const buyRitualDrumsButton = document.getElementById('buyRitualDrumsButton');
const oralTraditionsLevelDisplay = document.getElementById('oralTraditionsLevelDisplay');
const oralTraditionsCostDisplay = document.getElementById('oralTraditionsCostDisplay');
const buyOralTraditionsButton = document.getElementById('buyOralTraditionsButton');
// Ancient Era
const ancientEraContainer = document.getElementById('ancient-era');
const scribeCountDisplay = document.getElementById('scribeCountDisplay');
const scribeCostDisplay = document.getElementById('scribeCostDisplay');
const buyScribeButton = document.getElementById('buyScribeButton');
// Temporal Exchange
const primalToCivicCost = document.getElementById('primalToCivicCost');
const civicToPrimalCost = document.getElementById('civicToPrimalCost');
const convertPrimalButton = document.getElementById('convertPrimalButton');
const convertCivicButton = document.getElementById('convertCivicButton');
// System
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');

let productionRates = { primal: 0, civic: 0 };

// === DYNAMIC RATES LOGIC ===
function getExchangeRates() {
    const { primalEssence, civicEssence } = gameState;
    const { primal: primalRate, civic: civicRate } = productionRates;
    const baseCost = 40;
    const stockRatio = (primalEssence + 500) / (civicEssence + 500);
    const prodRatio = (primalRate + 5) / (civicRate + 5);
    const primalValueMultiplier = Math.sqrt(stockRatio * prodRatio);
    let primalForCivic = baseCost * primalValueMultiplier;
    let civicForPrimal = baseCost / primalValueMultiplier;
    primalForCivic = Math.floor(Math.max(10, Math.min(primalForCivic, 5000)));
    civicForPrimal = Math.floor(Math.max(10, Math.min(civicForPrimal, 5000)));
    return { primalForCivic, civicForPrimal };
}

// === UX FUNCTIONS ===
function createFloatingText(text, x, y) {
    const el = document.createElement('div');
    el.textContent = text;
    el.className = 'floating-text';
    el.style.left = `${x - 15}px`;
    el.style.top = `${y - 25}px`;
    floatingTextContainer.appendChild(el);
    setTimeout(() => { el.remove(); }, 1500);
}

// === CORE GAME ACTIONS ===
function nurture(event) {
    const nurturePower = 1 + gameState.stoneToolsLevel;
    gameState.primalEssence += nurturePower;
    createFloatingText(`+${nurturePower}`, event.clientX, event.clientY);
    updateDisplay();
}

function buyGatherer() {
    if (gameState.primalEssence >= gameState.gathererCost) {
        gameState.primalEssence -= gameState.gathererCost;
        gameState.gatherers++;
        gameState.gathererCost = Math.ceil(gameState.gathererCost * 1.15);
        checkUnlocks();
        updateDisplay();
    }
}

function buyStoneTools() {
    if (gameState.primalEssence >= gameState.stoneToolsCost) {
        gameState.primalEssence -= gameState.stoneToolsCost;
        gameState.stoneToolsLevel++;
        gameState.stoneToolsCost = Math.ceil(gameState.stoneToolsCost * 1.8);
        updateDisplay();
    }
}

function buyRitualDrums() {
     if (gameState.primalEssence >= gameState.ritualDrumsCost) {
        gameState.primalEssence -= gameState.ritualDrumsCost;
        gameState.ritualDrumsLevel++;
        gameState.ritualDrumsCost = Math.ceil(gameState.ritualDrumsCost * 2.2);
        updateDisplay();
    }
}

function buyScribe() {
    if (gameState.civicEssence >= gameState.scribeCost) {
        gameState.civicEssence -= gameState.scribeCost;
        gameState.scribes++;
        gameState.scribeCost = Math.ceil(gameState.scribeCost * 1.20);
        updateDisplay();
    }
}

function buyOralTraditions() {
    if (gameState.primalEssence >= gameState.oralTraditionsCost) {
        gameState.primalEssence -= gameState.oralTraditionsCost;
        gameState.oralTraditionsLevel++;
        gameState.oralTraditionsCost = Math.ceil(gameState.oralTraditionsCost * 2.5);
        updateDisplay();
    }
}

function convertPrimalToCivic() {
    const { primalForCivic } = getExchangeRates();
    if (gameState.primalEssence >= primalForCivic) {
        gameState.primalEssence -= primalForCivic;
        gameState.civicEssence += 10;
        updateDisplay();
    }
}

function convertCivicToPrimal() {
    const { civicForPrimal } = getExchangeRates();
    if (gameState.civicEssence >= civicForPrimal) {
        gameState.civicEssence -= civicForPrimal;
        gameState.primalEssence += 10;
        updateDisplay();
    }
}

function checkUnlocks() {
    if (!gameState.isAncientEraUnlocked && gameState.gatherers >= 15) {
        gameState.isAncientEraUnlocked = true;
    }
}

// === CENTRAL UPDATE FUNCTION ===
function calculateProduction() {
    const drumBonus = 1 + (gameState.ritualD
