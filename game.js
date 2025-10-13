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
const floatingTextContainer = document.getElementById('floatingTextContainer');
const headerPrimalEssence = document.getElementById('headerPrimalEssence');
const headerPrimalPerSec = document.getElementById('headerPrimalPerSec');
const headerCivicContainer = document.getElementById('headerCivicContainer');
const headerCivicEssence = document.getElementById('headerCivicEssence');
const headerCivicPerSec = document.getElementById('headerCivicPerSec');
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
const ancientEraContainer = document.getElementById('ancient-era');
const scribeCountDisplay = document.getElementById('scribeCountDisplay');
const scribeCostDisplay = document.getElementById('scribeCostDisplay');
const buyScribeButton = document.getElementById('buyScribeButton');
const primalToCivicCost = document.getElementById('primalToCivicCost');
const civicToPrimalCost = document.getElementById('civicToPrimalCost');
const convertPrimalButton = document.getElementById('convertPrimalButton');
const convertCivicButton = document.getElementById('convertCivicButton');
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
    const drumBonus = 1 + (gameState.ritualDrumsLevel * 0.20); // Each level adds a 20% multiplier
    const basePrimal = gameState.gatherers * 1;
    productionRates.primal = basePrimal * drumBonus;
    
    const baseCivic = gameState.scribes * 5;
    const synergyCivic = gameState.oralTraditionsLevel * 0.1 * gameState.gatherers;
    productionRates.civic = baseCivic + synergyCivic;
}

function updateDisplay() {
    calculateProduction();
    const floorPrimal = Math.floor(gameState.primalEssence);
    const floorCivic = Math.floor(gameState.civicEssence);

    // Header
    headerPrimalEssence.textContent = floorPrimal.toLocaleString();
    headerPrimalPerSec.textContent = productionRates.primal.toFixed(1);

    // Prehistoric Era UI
    nurturePowerDisplay.textContent = `+${1 + gameState.stoneToolsLevel}`;
    gathererCountDisplay.textContent = gameState.gatherers.toLocaleString();
    gathererCostDisplay.textContent = gameState.gathererCost.toLocaleString();
    stoneToolsLevelDisplay.textContent = gameState.stoneToolsLevel.toLocaleString();
    stoneToolsCostDisplay.textContent = gameState.stoneToolsCost.toLocaleString();
    ritualDrumsLevelDisplay.textContent = gameState.ritualDrumsLevel.toLocaleString();
    ritualDrumsCostDisplay.textContent = gameState.ritualDrumsCost.toLocaleString();
    
    if (!gameState.isAncientEraUnlocked) {
        const req = 15;
        const progress = Math.min(gameState.gatherers / req, 1);
        ancientUnlockCounter.textContent = `${gameState.gatherers} / ${req}`;
        ancientUnlockBar.style.width = `${progress * 100}%`;
        ancientUnlockProgress.style.display = 'block';
    } else {
        ancientUnlockProgress.style.display = 'none';
    }

    // Ancient Era Visibility and UI
    if (gameState.isAncientEraUnlocked) {
        ancientEraContainer.classList.remove('hidden');
        headerCivicContainer.classList.remove('hidden');

        headerCivicEssence.textContent = floorCivic.toLocaleString();
        headerCivicPerSec.textContent = productionRates.civic.toFixed(1);
        scribeCountDisplay.textContent = gameState.scribes.toLocaleString();
        scribeCostDisplay.textContent = gameState.scribeCost.toLocaleString();
        oralTraditionsLevelDisplay.textContent = gameState.oralTraditionsLevel.toLocaleString();
        oralTraditionsCostDisplay.textContent = gameState.oralTraditionsCost.toLocaleString();
        
        const { primalForCivic, civicForPrimal } = getExchangeRates();
        primalToCivicCost.textContent = primalForCivic.toLocaleString();
        civicToPrimalCost.textContent = civicForPrimal.toLocaleString();
        convertPrimalButton.disabled = floorPrimal < primalForCivic;
        convertPrimalButton.classList.toggle('can-afford', floorPrimal >= primalForCivic);
        convertCivicButton.disabled = floorCivic < civicForPrimal;
        convertCivicButton.classList.toggle('can-afford', floorCivic >= civicForPrimal);
    } else {
         ancientEraContainer.classList.add('hidden');
         headerCivicContainer.classList.add('hidden');
    }

    // Affordability Checks
    buyGathererButton.disabled = floorPrimal < gameState.gathererCost;
    buyGathererButton.classList.toggle('can-afford', floorPrimal >= gameState.gathererCost);
    buyStoneToolsButton.disabled = floorPrimal < gameState.stoneToolsCost;
    buyStoneToolsButton.classList.toggle('can-afford', floorPrimal >= gameState.stoneToolsCost);
    buyRitualDrumsButton.disabled = floorPrimal < gameState.ritualDrumsCost;
    buyRitualDrumsButton.classList.toggle('can-afford', floorPrimal >= gameState.ritualDrumsCost);
    buyOralTraditionsButton.disabled = floorPrimal < gameState.oralTraditionsCost;
    buyOralTraditionsButton.classList.toggle('can-afford', floorPrimal >= gameState.oralTraditionsCost);
    buyScribeButton.disabled = floorCivic < gameState.scribeCost;
    buyScribeButton.classList.toggle('can-afford', floorCivic >= gameState.scribeCost);
}

// === SAVING, LOADING, & GAME LOOP ===
function saveGame() {
    localStorage.setItem('chronoGardenerSave', JSON.stringify(gameState));
    saveMessage.textContent = 'Saved!';
    setTimeout(() => { saveMessage.textContent = '' }, 2000);
}

function loadGame() {
    const savedGame = localStorage.getItem('chronoGardenerSave');
    if (savedGame) {
        const loadedState = JSON.parse(savedGame);
        gameState = { ...defaultGameState, ...loadedState };
    }
}

let lastUpdateTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    produceResources(deltaTime);
    updateDisplay();
    requestAnimationFrame(gameLoop);
}

function produceResources(deltaTime) {
    const seconds = deltaTime / 1000;
    gameState.primalEssence += productionRates.primal * seconds;
    if (gameState.isAncientEraUnlocked) {
        gameState.civicEssence += productionRates.civic * seconds;
    }
}

// === INITIALIZATION ===
nurtureButton.addEventListener('click', (event) => nurture(event));
buyGathererButton.addEventListener('click', buyGatherer);
buyStoneToolsButton.addEventListener('click', buyStoneTools);
buyRitualDrumsButton.addEventListener('click', buyRitualDrums);
buyScribeButton.addEventListener('click', buyScribe);
buyOralTraditionsButton.addEventListener('click', buyOralTraditions);
convertPrimalButton.addEventListener('click', convertPrimalToCivic);
convertCivicButton.addEventListener('click', convertCivicToPrimal);
manualSaveButton.addEventListener('click', saveGame);
setInterval(saveGame, 30000);

loadGame();
checkUnlocks();
requestAnimationFrame(gameLoop);
