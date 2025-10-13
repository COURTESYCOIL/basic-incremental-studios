// Game State
let gameState = {
    primalEssence: 0,
    gatherers: 0,
    gathererCost: 10,
};

// DOM Elements (so we don't have to keep searching for them)
const primalEssenceDisplay = document.getElementById('primalEssenceDisplay');
const primalEssencePerSecondDisplay = document.getElementById('primalEssencePerSecondDisplay');
const nurtureButton = document.getElementById('nurtureButton');
const buyGathererButton = document.getElementById('buyGathererButton');
const gathererCountDisplay = document.getElementById('gathererCountDisplay');
const gathererCostDisplay = document.getElementById('gathererCostDisplay');
const manualSaveButton = document.getElementById('manualSaveButton');
const saveMessage = document.getElementById('saveMessage');

// === Core Game Functions ===

function nurture() {
    gameState.primalEssence++;
    updateDisplay();
}

function buyGatherer() {
    if (gameState.primalEssence >= gameState.gathererCost) {
        gameState.primalEssence -= gameState.gathererCost;
        gameState.gatherers++;
        // Increase the cost of the next gatherer (e.g., by 15%)
        gameState.gathererCost = Math.ceil(gameState.gathererCost * 1.15);
        updateDisplay();
    }
}

function produceEssence(deltaTime) {
    const essencePerSecond = gameState.gatherers * 1; // Each gatherer gives 1 essence/sec
    gameState.primalEssence += (essencePerSecond * deltaTime) / 1000; // deltaTime is in milliseconds
    updateDisplay();
}

function updateDisplay() {
    primalEssenceDisplay.textContent = Math.floor(gameState.primalEssence).toLocaleString();
    
    const essencePerSecond = gameState.gatherers * 1;
    primalEssencePerSecondDisplay.textContent = essencePerSecond.toLocaleString();

    gathererCountDisplay.textContent = gameState.gatherers.toLocaleString();
    gathererCostDisplay.textContent = gameState.gathererCost.toLocaleString();
    
    // Disable purchase button if not enough essence
    buyGathererButton.disabled = gameState.primalEssence < gameState.gathererCost;
}

// === Saving and Loading ===

function saveGame() {
    localStorage.setItem('chronoGardenerSave', JSON.stringify(gameState));
    saveMessage.textContent = 'Game Saved!';
    setTimeout(() => { saveMessage.textContent = '' }, 2000); // Message disappears after 2s
}

function loadGame() {
    const savedGame = localStorage.getItem('chronoGardenerSave');
    if (savedGame) {
        gameState = JSON.parse(savedGame);
    }
}

// === Game Loop ===

let lastUpdateTime = Date.now();
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;
    
    produceEssence(deltaTime);

    requestAnimationFrame(gameLoop); // Use requestAnimationFrame for smoother updates
}

// Event Listeners (connecting buttons to functions)
nurtureButton.addEventListener('click', nurture);
buyGathererButton.addEventListener('click', buyGatherer);
manualSaveButton.addEventListener('click', saveGame);

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Initialize Game
loadGame(); // Load progress on start
updateDisplay(); // Update display with loaded data
requestAnimationFrame(gameLoop); // Start the game loop
