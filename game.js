// === GAME STATE SETUP ===
const defaultGameState = {
    temporalShards: 5,
    primalEssence: 0,
    gatherers: 0,
    gathererCost: 10,
    stoneToolsLevel: 0,
    stoneToolsCost: 50,
    ritualDrumsLevel: 0,
    ritualDrumsCost: 250,
    isAncientEraUnlocked: false,
    civicEssence: 0,
    scribes: 0,
    scribeCost: 10,
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
const temporalShardDisplay = document.getElementById('temporalShardDisplay');
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
const civicAmountInput = document.getElementById('civicAmountInput');
const primalToCivicRate = document.getElementById('primalToCivicRate');
const primalToCivicTotalCost = document.getElementById('primalToCivicTotalCost');
const convertPrimalButton = document.getElementById('convertPrimalButton');
const primalAmountInput = document.getElementById('primalAmountInput');
const civicToPrimalRate = document.getElementById('civicToPrimalRate');
const civicToPrimalTotalCost = document.getElementById('civicToPrimalTotalCost');
const convertCivicButton = document.getElementById('convertCivicButton');
const surgeHoursInput = document.getElementById('surgeHoursInput');
const surgeCostDisplay = document.getElementById('surgeCostDisplay');
const surgePrimalGainDisplay = document.getElementById('surgePrimalGainDisplay');
const surgeCivicGainContainer = document.getElementById('surgeCivicGainContainer');
const surgeCivicGainDisplay = document.getElementById('surgeCivicGainDisplay');
const activateSurgeButton = document.getElementById('activateSurgeButton');
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');

let productionRates = { primal: 0, civic: 0 };

// === DYNAMIC RATES & PREVIEWS ===
function getExchangeRates() {
    const { primalEssence, civicEssence } = gameState;
    const { primal: primalRate, civic: civicRate } = productionRates;
    const baseCost = 4;
    const stockRatio = (primalEssence + 500) / (civicEssence + 500);
    const prodRatio = (primalRate + 5) / (civicRate + 5);
    const primalValueMultiplier = Math.sqrt(stockRatio * prodRatio);
    let primalPerCivic = Math.max(1, Math.min(baseCost * primalValueMultiplier, 500));
    let civicPerPrimal = Math.max(1, Math.min(baseCost / primalValueMultiplier, 500));
    return { primalPerCivic, civicPerPrimal };
}

function calculateProduction() {
    const drumBonus = 1 + (gameState.ritualDrumsLevel * 0.20);
    productionRates.primal = gameState.gatherers * drumBonus;
    const synergyCivic = gameState.oralTraditionsLevel * 0.1 * gameState.gatherers;
    productionRates.civic = (gameState.scribes * 5) + synergyCivic;
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
}
function buyGatherer() { if (gameState.primalEssence >= gameState.gathererCost) { gameState.primalEssence -= gameState.gathererCost; gameState.gatherers++; gameState.gathererCost = Math.ceil(gameState.gathererCost * 1.15); checkUnlocks(); } }
function buyStoneTools() { if (gameState.primalEssence >= gameState.stoneToolsCost) { gameState.primalEssence -= gameState.stoneToolsCost; gameState.stoneToolsLevel++; gameState.stoneToolsCost = Math.ceil(gameState.stoneToolsCost * 1.8); } }
function buyRitualDrums() { if (gameState.primalEssence >= gameState.ritualDrumsCost) { gameState.primalEssence -= gameState.ritualDrumsCost; gameState.ritualDrumsLevel++; gameState.ritualDrumsCost = Math.ceil(gameState.ritualDrumsCost * 2.2); } }
function buyScribe() { if (gameState.civicEssence >= gameState.scribeCost) { gameState.civicEssence -= gameState.scribeCost; gameState.scribes++; gameState.scribeCost = Math.ceil(gameState.scribeCost * 1.20); } }
function buyOralTraditions() { if (gameState.primalEssence >= gameState.oralTraditionsCost) { gameState.primalEssence -= gameState.oralTraditionsCost; gameState.oralTraditionsLevel++; gameState.oralTraditionsCost = Math.ceil(gameState.oralTraditionsCost * 2.5); } }
function convertPrimalToCivic() { const { primalPerCivic } = getExchangeRates(); const amountToGet = parseInt(civicAmountInput.value) || 0; const totalCost = Math.ceil(amountToGet * primalPerCivic); if (gameState.primalEssence >= totalCost) { gameState.primalEssence -= totalCost; gameState.civicEssence += amountToGet; } }
function convertCivicToPrimal() { const { civicPerPrimal } = getExchangeRates(); const amountToGet = parseInt(primalAmountInput.value) || 0; const totalCost = Math.ceil(amountToGet * civicPerPrimal); if (gameState.civicEssence >= totalCost) { gameState.civicEssence -= totalCost; gameState.primalEssence += amountToGet; } }

function activateTemporalSurge() {
    const hours = parseInt(surgeHoursInput.value) || 0;
    if (hours <= 0) return;
    const cost = hours; // 1 Shard per hour
    if (gameState.temporalShards >= cost) {
        gameState.temporalShards -= cost;
        const seconds = hours * 3600;
        const primalGain = productionRates.primal * seconds;
        const civicGain = gameState.isAncientEraUnlocked ? productionRates.civic * seconds : 0;
        gameState.primalEssence += primalGain;
        gameState.civicEssence += civicGain;
        createFloatingText(`+${Math.floor(primalGain).toLocaleString()} Primal`, window.innerWidth / 2, window.innerHeight / 2 - 15);
        if (civicGain > 0) createFloatingText(`+${Math.floor(civicGain).toLocaleString()} Civic`, window.innerWidth / 2, window.innerHeight / 2 + 15);
    }
}

function checkUnlocks() { if (!gameState.isAncientEraUnlocked && gameState.gatherers >= 15) gameState.isAncientEraUnlocked = true; }

// === CENTRAL UPDATE FUNCTION ===
function updateDisplay() {
    calculateProduction();
    const floorPrimal = Math.floor(gameState.primalEssence);
    const floorCivic = Math.floor(gameState.civicEssence);
    const floorShards = Math.floor(gameState.temporalShards);

    // Header & Primal UI
    headerPrimalEssence.textContent = floorPrimal.toLocaleString();
    headerPrimalPerSec.textContent = productionRates.primal.toFixed(1);
    temporalShardDisplay.textContent = floorShards.toLocaleString();
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

    // Ancient Era & Exchange UI
    if (gameState.isAncientEraUnlocked) {
        ancientEraContainer.classList.remove('hidden');
        headerCivicContainer.classList.remove('hidden');
        headerCivicEssence.textContent = floorCivic.toLocaleString();
        headerCivicPerSec.textContent = productionRates.civic.toFixed(1);
        scribeCountDisplay.textContent = gameState.scribes.toLocaleString();
        scribeCostDisplay.textContent = gameState.scribeCost.toLocaleString();
        oralTraditionsLevelDisplay.textContent = gameState.oralTraditionsLevel.toLocaleString();
        oralTraditionsCostDisplay.textContent = gameState.oralTraditionsCost.toLocaleString();
        
        const { primalPerCivic, civicPerPrimal } = getExchangeRates();
        primalToCivicRate.textContent = (primalPerCivic * 10).toFixed(1);
        civicToPrimalRate.textContent = (civicPerPrimal * 10).toFixed(1);
        const civicToGet = parseInt(civicAmountInput.value) || 0;
        const primalTotalCost = Math.ceil(civicToGet * primalPerCivic);
        primalToCivicTotalCost.textContent = primalTotalCost.toLocaleString();
        const primalToGet = parseInt(primalAmountInput.value) || 0;
        const civicTotalCost = Math.ceil(primalToGet * civicPerPrimal);
        civicToPrimalTotalCost.textContent = civicTotalCost.toLocaleString();

        convertPrimalButton.disabled = floorPrimal < primalTotalCost || civicToGet <= 0;
        convertPrimalButton.classList.toggle('can-afford', floorPrimal >= primalTotalCost && civicToGet > 0);
        convertCivicButton.disabled = floorCivic < civicTotalCost || primalToGet <= 0;
        convertCivicButton.classList.toggle('can-afford', floorCivic >= civicTotalCost && primalToGet > 0);
    } else {
        ancientEraContainer.classList.add('hidden');
        headerCivicContainer.classList.add('hidden');
    }

    // Temporal Surge Preview UI
    const surgeHours = parseInt(surgeHoursInput.value) || 0;
    const surgeCost = surgeHours;
    surgeCostDisplay.textContent = surgeCost.toLocaleString();
    const secondsToSurge = surgeHours * 3600;
    const primalGainPreview = productionRates.primal * secondsToSurge;
    surgePrimalGainDisplay.textContent = `+${Math.floor(primalGainPreview).toLocaleString()}`;
    if (gameState.isAncientEraUnlocked) {
        const civicGainPreview = productionRates.civic * secondsToSurge;
        surgeCivicGainDisplay.textContent = `+${Math.floor(civicGainPreview).toLocaleString()}`;
        surgeCivicGainContainer.classList.remove('hidden');
    } else {
        surgeCivicGainContainer.classList.add('hidden');
    }
    activateSurgeButton.disabled = floorShards < surgeCost || surgeHours <= 0;
    activateSurgeButton.classList.toggle('can-afford', floorShards >= surgeCost && surgeHours > 0);

    // Main Affordability Checks
    buyGathererButton.classList.toggle('can-afford', floorPrimal >= gameState.gathererCost);
    buyStoneToolsButton.classList.toggle('can-afford', floorPrimal >= gameState.stoneToolsCost);
    buyRitualDrumsButton.classList.toggle('can-afford', floorPrimal >= gameState.ritualDrumsCost);
    buyOralTraditionsButton.classList.toggle('can-afford', floorPrimal >= gameState.oralTraditionsCost);
    buyScribeButton.classList.toggle('can-afford', floorCivic >= gameState.scribeCost);
    buyGathererButton.disabled = floorPrimal < gameState.gathererCost;
    buyStoneToolsButton.disabled = floorPrimal < gameState.stoneToolsCost;
    buyRitualDrumsButton.disabled = floorPrimal < gameState.ritualDrumsCost;
    buyOralTraditionsButton.disabled = floorPrimal < gameState.oralTraditionsCost;
    buyScribeButton.disabled = floorCivic < gameState.scribeCost;
}

// === SAVING, LOADING, & GAME LOOP ===
function saveGame() { localStorage.setItem('chronoGardenerSave', JSON.stringify(gameState)); saveMessage.textContent = 'Saved!'; setTimeout(() => { saveMessage.textContent = ''; }, 2000); }
function loadGame() { const s = localStorage.getItem('chronoGardenerSave'); if (s) { gameState = { ...defaultGameState, ...JSON.parse(s) }; } }

let lastUpdateTime = Date.now();
function gameLoop() {
    const now = Date.now();
    const delta = now - lastUpdateTime;
    lastUpdateTime = now;
    produceResources(delta);
    updateDisplay();
    requestAnimationFrame(gameLoop);
}

function produceResources(deltaTime) {
    const seconds = deltaTime / 1000;
    gameState.temporalShards += (1 / 60) * seconds; // 1 Shard per minute
    gameState.primalEssence += productionRates.primal * seconds;
    if (gameState.isAncientEraUnlocked) gameState.civicEssence += productionRates.civic * seconds;
}

// === EVENT LISTENERS & INITIALIZATION ===
function handlePurchase(purchaseFunction) { purchaseFunction(); updateDisplay(); }
nurtureButton.addEventListener('click', (event) => { nurture(event); updateDisplay(); });
buyGathererButton.addEventListener('click', () => handlePurchase(buyGatherer));
buyStoneToolsButton.addEventListener('click', () => handlePurchase(buyStoneTools));
buyRitualDrumsButton.addEventListener('click', () => handlePurchase(buyRitualDrums));
buyScribeButton.addEventListener('click', () => handlePurchase(buyScribe));
buyOralTraditionsButton.addEventListener('click', () => handlePurchase(buyOralTraditions));
convertPrimalButton.addEventListener('click', () => handlePurchase(convertPrimalToCivic));
convertCivicButton.addEventListener('click', () => handlePurchase(convertCivicToPrimal));
activateSurgeButton.addEventListener('click', () => handlePurchase(activateTemporalSurge));
civicAmountInput.addEventListener('input', updateDisplay); // Live update cost on input
primalAmountInput.addEventListener('input', updateDisplay); // Live update cost on input
surgeHoursInput.addEventListener('input', updateDisplay);   // Live update surge preview
manualSaveButton.addEventListener('click', saveGame);
setInterval(saveGame, 30000);

loadGame();
checkUnlocks();
requestAnimationFrame(gameLoop);
