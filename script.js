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

// === DOM ELEMENTS ===
const primalEssenceDisplay = document.getElementById('primalEssenceDisplay');
const primalEssencePerSecondDisplay = document.getElementById('primalEssencePerSecondDisplay');
const nurtureButton = document.getElementById('nurtureButton');
const buyGathererButton = document.getElementById('buyGathererButton');
const gathererCountDisplay = document.getElementById('gathererCountDisplay');
const gathererCostDisplay = document.getElementById('gathererCostDisplay');
const ancientEraContainer = document.getElementById('ancient-era');
const civicEssenceDisplay = document.getElementById('civicEssenceDisplay');
const civicEssencePerSecondDisplay = document.getElementById('civicEssencePerSecondDisplay');
const buyScribeButton = document.getElementById('buyScribeButton');
const scribeCountDisplay = document.getElementById('scribeCountDisplay');
const scribeCostDisplay = document.getElementById('scribeCostDisplay');
const buyOralTraditionsButton = document.getElementById('buyOralTraditionsButton');
const oralTraditionsLevelDisplay = document.getElementById('oralTraditionsLevelDisplay');
const oralTraditionsCostDisplay = document.getElementById('oralTraditionsCostDisplay');
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');


// === CORE GAME FUNCTIONS (USER ACTIONS) ===

function nurture() {
    gameState.primalEssence++;
    updateDisplay(); // <<< FIX: Update immediately on click
}

function buyGatherer() {
    if (gameState.primalEssence >= gameState.gathererCost) {
        gameState.primalEssence -= gameState.gathererCost;
        gameState.gatherers++;
        gameState.gathererCost = Math.ceil(gameState.gathererCost * 1.15);
        checkUnlocks();
        updateDisplay(); // <<< FIX: Update immediately after purchase
    }
}

function buyScribe() {
    if (gameState.civicEssence >= gameState.scribeCost) {
        gameState.civicEssence -= gameState.scribeCost;
        gameState.scribes++;
        gameState.scribeCost = Math.ceil(gameState.scribeCost * 1.20);
        updateDisplay(); // <<< FIX: Update immediately after purchase
    }
}

function buyOralTraditions() {
    if (gameState.primalEssence >= gameState.oralTraditionsCost) {
        gameState.primalEssence -= gameState.oralTraditionsCost;
        gameState.oralTraditionsLevel++;
        gameState.oralTraditionsCost = Math.ceil(gameState.oralTraditionsCost * 2.5);
        updateDisplay(); // <<< FIX: Update immediately after purchase
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

function produceResources(deltaTime) {
    const seconds = deltaTime / 1000;
    gameState.primalEssence += productionRates.primal * seconds;
    if (gameState.isAncientEraUnlocked) {
        gameState.civicEssence += productionRates.civic * seconds;
    }
}

function updateDisplay() {
    calculateProduction(); // Always calculate latest rates before display

    primalEssenceDisplay.textContent = Math.floor(gameState.primalEssence).toLocaleString();
    primalEssencePerSecondDisplay.textContent = productionRates.primal.toFixed(1);
    gathererCountDisplay.textContent = gameState.gatherers.toLocaleString();
    gathererCostDisplay.textContent = gameState.gathererCost.toLocaleString();
    buyGathererButton.disabled = gameState.primalEssence < gameState.gathererCost;

    if (gameState.isAncientEraUnlocked) {
        ancientEraContainer.classList.remove('hidden');
        civicEssenceDisplay.textContent = Math.floor(gameState.civicEssence).toLocaleString();
        civicEssencePerSecondDisplay.textContent = productionRates.civic.toFixed(1);
        scribeCountDisplay.textContent = gameState.scribes.toLocaleString();
        scribeCostDisplay.textContent = gameState.scribeCost.toLocaleString();
        buyScribeButton.disabled = gameState.civicEssence < gameState.scribeCost;
        oralTraditionsLevelDisplay.textContent = gameState.oralTraditionsLevel.toLocaleString();
        oralTraditionsCostDisplay.textContent = gameState.oralTraditionsCost.toLocaleString();
        buyOralTraditionsButton.disabled = gameState.primalEssence < gameState.oralTraditionsCost;
    } else {
        ancientEraContainer.classList.add('hidden');
    }
}

// === SAVING AND LOADING ===
function saveGame() {
    localStorage.setItem('chronoGardenerSave', JSON.stringify(gameState));
    saveMessage.textContent = 'Game Saved!';
    setTimeout(() => { saveMessage.textContent = '' }, 2000);
}

function loadGame() {
    const savedGame = localStorage.getItem('chronoGardenerSave');
    if (savedGame) {
        const loadedState = JSON.parse(savedGame);
        gameState = { ...defaultGameState, ...loadedState };
    }
}

// === GAME LOOP ===
let lastUpdateTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    
    produceResources(deltaTime);
    updateDisplay();

    requestAnimationFrame(gameLoop);
}

// === INITIALIZATION ===
// Event Listeners
nurtureButton.addEventListener('click', nurture);
buyGathererButton.addEventListener('click', buyGatherer);
buyScribeButton.addEventListener('click', buyScribe);
buyOralTraditionsButton.addEventListener('click', buyOralTraditions);
manualSaveButton.addEventListener('click', saveGame);

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Initialize
loadGame();
checkUnlocks();
updateDisplay(); // Initial display sync on load
requestAnimationFrame(gameLoop);
