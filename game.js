// Default Game State
const defaultGameState = {
    primalEssence: 0,
    gatherers: 0,
    gathererCost: 10,
    isAncientEraUnlocked: false,
    civicEssence: 0,
    scribes: 0,
    scribeCost: 10,
    oralTraditionsLevel: 0,
    oralTraditionsCost: 1000,
};

let gameState = { ...defaultGameState };

// === DOM ELEMENTS (Grouped by area) ===
// --- Header ---
const headerPrimalEssence = document.getElementById('headerPrimalEssence');
const headerPrimalPerSec = document.getElementById('headerPrimalPerSec');
const headerCivicContainer = document.getElementById('headerCivicContainer');
const headerCivicEssence = document.getElementById('headerCivicEssence');
const headerCivicPerSec = document.getElementById('headerCivicPerSec');

// --- Prehistoric ---
const nurtureButton = document.getElementById('nurtureButton');
const gathererCountDisplay = document.getElementById('gathererCountDisplay');
const gathererCostDisplay = document.getElementById('gathererCostDisplay');
const buyGathererButton = document.getElementById('buyGathererButton');
const oralTraditionsLevelDisplay = document.getElementById('oralTraditionsLevelDisplay');
const oralTraditionsCostDisplay = document.getElementById('oralTraditionsCostDisplay');
const buyOralTraditionsButton = document.getElementById('buyOralTraditionsButton');

// --- Ancient ---
const ancientEraContainer = document.getElementById('ancient-era');
const scribeCountDisplay = document.getElementById('scribeCountDisplay');
const scribeCostDisplay = document.getElementById('scribeCostDisplay');
const buyScribeButton = document.getElementById('buyScribeButton');
const convertCivicButton = document.getElementById('convertCivicButton');

// --- System ---
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');


// === CORE GAME FUNCTIONS (USER ACTIONS) ===

function nurture() {
    gameState.primalEssence++;
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

function convertCivicToPrimal() {
    const conversionCost = 20;
    if (gameState.civicEssence >= conversionCost) {
        gameState.civicEssence -= conversionCost;
        gameState.primalEssence += 10;
        updateDisplay();
    }
}

function checkUnlocks() {
    if (!gameState.isAncientEraUnlocked && gameState.gatherers >= 15) {
        gameState.isAncientEraUnlocked = true;
    }
}

// === PRODUCTION, DISPLAY, and GAME LOOP ===

let productionRates = { primal: 0, civic: 0 };

function calculateProduction() {
    productionRates.primal = gameState.gatherers * 1;
    const baseCivicProduction = gameState.scribes * 5;
    const synergyCivicProduction = gameState.oralTraditionsLevel * 0.1 * gameState.gatherers;
    productionRates.civic = baseCivicProduction + synergyCivicProduction;
}

function updateDisplay() {
    calculateProduction();
    const floorPrimal = Math.floor(gameState.primalEssence);
    const floorCivic = Math.floor(gameState.civicEssence);

    // --- Update Header ---
    headerPrimalEssence.textContent = floorPrimal.toLocaleString();
    headerPrimalPerSec.textContent = productionRates.primal.toFixed(1);

    // --- Update Prehistoric ---
    gathererCountDisplay.textContent = gameState.gatherers.toLocaleString();
    gathererCostDisplay.textContent = gameState.gathererCost.toLocaleString();
    buyGathererButton.disabled = floorPrimal < gameState.gathererCost;

    // --- Update based on era unlock status ---
    if (gameState.isAncientEraUnlocked) {
        ancientEraContainer.classList.remove('hidden');
        headerCivicContainer.classList.remove('hidden');

        headerCivicEssence.textContent = floorCivic.toLocaleString();
        headerCivicPerSec.textContent = productionRates.civic.toFixed(1);

        scribeCountDisplay.textContent = gameState.scribes.toLocaleString();
        scribeCostDisplay.textContent = gameState.scribeCost.toLocaleString();
        buyScribeButton.disabled = floorCivic < gameState.scribeCost;
        
        oralTraditionsLevelDisplay.textContent = gameState.oralTraditionsLevel.toLocaleString();
        oralTraditionsCostDisplay.textContent = gameState.oralTraditionsCost.toLocaleString();
        buyOralTraditionsButton.disabled = floorPrimal < gameState.oralTraditionsCost;

        convertCivicButton.disabled = floorCivic < 20;

    } else {
        ancientEraContainer.classList.add('hidden');
        headerCivicContainer.classList.add('hidden');
    }
}

// ... rest of the game logic ...
function saveGame() { localStorage.setItem('chronoGardenerSave', JSON.stringify(gameState)); saveMessage.textContent = 'Saved!'; setTimeout(() => { saveMessage.textContent = '' }, 2000); }
function loadGame() { const savedGame = localStorage.getItem('chronoGardenerSave'); if (savedGame) { gameState = { ...defaultGameState, ...JSON.parse(savedGame) }; } }

let lastUpdateTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    produceResources(currentTime - lastUpdateTime);
    lastUpdateTime = currentTime;
    updateDisplay();
    requestAnimationFrame(gameLoop);
}

function produceResources(deltaTime) { const seconds = deltaTime / 1000; gameState.primalEssence += productionRates.primal * seconds; if (gameState.isAncientEraUnlocked) { gameState.civicEssence += productionRates.civic * seconds; } }

// === INITIALIZATION ===
nurtureButton.addEventListener('click', nurture);
buyGathererButton.addEventListener('click', buyGatherer);
buyScribeButton.addEventListener('click', buyScribe);
buyOralTraditionsButton.addEventListener('click', buyOralTraditions);
convertCivicButton.addEventListener('click', convertCivicToPrimal); // New event listener
manualSaveButton.addEventListener('click', saveGame);

setInterval(saveGame, 30000);

loadGame();
checkUnlocks();
requestAnimationFrame(gameLoop);
