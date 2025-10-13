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

// Initialize gameState
let gameState = { ...defaultGameState };


// === DOM ELEMENTS ===
// Prehistoric
const primalEssenceDisplay = document.getElementById('primalEssenceDisplay');
const primalEssencePerSecondDisplay = document.getElementById('primalEssencePerSecondDisplay');
const nurtureButton = document.getElementById('nurtureButton');
const buyGathererButton = document.getElementById('buyGathererButton');
const gathererCountDisplay = document.getElementById('gathererCountDisplay');
const gathererCostDisplay = document.getElementById('gathererCostDisplay');

// Ancient
const ancientEraContainer = document.getElementById('ancient-era');
const civicEssenceDisplay = document.getElementById('civicEssenceDisplay');
const civicEssencePerSecondDisplay = document.getElementById('civicEssencePerSecondDisplay');
const buyScribeButton = document.getElementById('buyScribeButton');
const scribeCountDisplay = document.getElementById('scribeCountDisplay');
const scribeCostDisplay = document.getElementById('scribeCostDisplay');

// Synergy
const buyOralTraditionsButton = document.getElementById('buyOralTraditionsButton');
const oralTraditionsLevelDisplay = document.getElementById('oralTraditionsLevelDisplay');
const oralTraditionsCostDisplay = document.getElementById('oralTraditionsCostDisplay');

// System
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');


// === CORE GAME FUNCTIONS ===

function nurture() {
    gameState.primalEssence++;
    updateDisplay();
}

function buyGatherer() {
    if (gameState.primalEssence >= gameState.gathererCost) {
        gameState.primalEssence -= gameState.gathererCost;
        gameState.gatherers++;
        gameState.gathererCost = Math.ceil(gameState.gathererCost * 1.15);
        checkUnlocks(); // Check if this purchase unlocks the next era
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
        gameState.oralTraditionsCost = Math.ceil(gameState.oralTraditionsCost * 2.5); // Costs more each time
        updateDisplay();
    }
}

function checkUnlocks() {
    // Unlock Ancient Era after owning 15 Cave Drawings
    if (!gameState.isAncientEraUnlocked && gameState.gatherers >= 15) {
        gameState.isAncientEraUnlocked = true;
        ancientEraContainer.classList.remove('hidden');
    }
}

// === PRODUCTION AND DISPLAY ===

let productionRates = {
    primal: 0,
    civic: 0
};

function calculateProduction() {
    // Primal Essence Production
    productionRates.primal = gameState.gatherers * 1;

    // Civic Essence Production (Base + Synergy)
    const baseCivicProduction = gameState.scribes * 5;
    // SYNERGY: Each level of Oral Traditions makes each Cave Drawing produce 0.1 Civic Essence/sec
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
    // Update Primal display
    primalEssenceDisplay.textContent = Math.floor(gameState.primalEssence).toLocaleString();
    primalEssencePerSecondDisplay.textContent = productionRates.primal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    gathererCountDisplay.textContent = gameState.gatherers.toLocaleString();
    gathererCostDisplay.textContent = gameState.gathererCost.toLocaleString();
    buyGathererButton.disabled = gameState.primalEssence < gameState.gathererCost;
    
    // Show/hide ancient era based on unlock status
    if (gameState.isAncientEraUnlocked) {
        ancientEraContainer.classList.remove('hidden');

        // Update Ancient display
        civicEssenceDisplay.textContent = Math.floor(gameState.civicEssence).toLocaleString();
        civicEssencePerSecondDisplay.textContent = productionRates.civic.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        scribeCountDisplay.textContent = gameState.scribes.toLocaleString();
        scribeCostDisplay.textContent = gameState.scribeCost.toLocaleString();
        buyScribeButton.disabled = gameState.civicEssence < gameState.scribeCost;

        // Update Synergy display
        oralTraditionsLevelDisplay.textContent = gameState.oralTraditionsLevel.toLocaleString();
        oralTraditionsCostDisplay.textContent = gameState.oralTraditionsCost.toLocaleString();
        buyOralTraditionsButton.disabled = gameState.primalEssence < gameState.oralTraditionsCost;
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
        // This merges the default state with the loaded state,
        // ensuring new features are added to old saves.
        gameState = { ...defaultGameState, ...loadedState };
    }
}

// === GAME LOOP ===
let lastUpdateTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    
    calculateProduction();
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

// Load game, check for unlocks on load, then start the loop
loadGame();
checkUnlocks(); 
requestAnimationFrame(gameLoop);
