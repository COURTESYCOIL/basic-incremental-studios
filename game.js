// ... (gameState and DOM elements setup, add new IDs)
// DOM Elements
const primalToCivicCost = document.getElementById('primalToCivicCost');
const civicToPrimalCost = document.getElementById('civicToPrimalCost');
const convertPrimalButton = document.getElementById('convertPrimalButton');
const convertCivicButton = document.getElementById('convertCivicButton');
// ... (all previous DOM elements remain)


// === DYNAMIC RATES LOGIC ===
// This function calculates the costs based on current game state.
// It returns an object with the costs, making it reusable.
function getExchangeRates() {
    const { primalEssence, civicEssence } = gameState;
    const { primal: primalRate, civic: civicRate } = productionRates;

    const baseCost = 40; // Base cost for balancing

    // Ratios based on supply (stock) and demand (production)
    // Adding constants avoids division by zero and smooths early game values
    const stockRatio = (primalEssence + 500) / (civicEssence + 500);
    const prodRatio = (primalRate + 5) / (civicRate + 5);

    // Combine ratios and use square root to dampen extreme values
    const primalValueMultiplier = Math.sqrt(stockRatio * prodRatio);

    // Calculate costs
    // Cost of Civic is high when Primal's value is low (multiplier is high)
    let primalForCivic = baseCost * primalValueMultiplier;
    // Cost of Primal is high when Primal's value is high (multiplier is low)
    let civicForPrimal = baseCost / primalValueMultiplier;

    // Clamp costs between a minimum and maximum to prevent absurd rates
    primalForCivic = Math.floor(Math.max(10, Math.min(primalForCivic, 5000)));
    civicForPrimal = Math.floor(Math.max(10, Math.min(civicForPrimal, 5000)));

    return { primalForCivic, civicForPrimal };
}


// === CORE GAME FUNCTIONS (USER ACTIONS) ===
// ... (nurture, buyGatherer, buyScribe, buyOralTraditions are unchanged)

function convertPrimalToCivic() {
    const { primalForCivic } = getExchangeRates(); // Get cost at the moment of click
    if (gameState.primalEssence >= primalForCivic) {
        gameState.primalEssence -= primalForCivic;
        gameState.civicEssence += 10;
        updateDisplay();
    }
}

function convertCivicToPrimal() {
    const { civicForPrimal } = getExchangeRates(); // Get cost at the moment of click
    if (gameState.civicEssence >= civicForPrimal) {
        gameState.civicEssence -= civicForPrimal;
        gameState.primalEssence += 10;
        updateDisplay();
    }
}


// === SUPERCHARGED updateDisplay() FUNCTION ===
function updateDisplay() {
    calculateProduction();
    const floorPrimal = Math.floor(gameState.primalEssence);
    const floorCivic = Math.floor(gameState.civicEssence);

    // ... (Header and Prehistoric UI are unchanged)
    
    // Ancient Era Unlock Progress Bar
    // ... (unchanged)

    // Era Visibility
    if (gameState.isAncientEraUnlocked) {
        // ... (Update Ancient UI as before)
        
        // --- NEW: DYNAMIC EXCHANGE RATE UI UPDATE ---
        const { primalForCivic, civicForPrimal } = getExchangeRates();

        // Update button text
        primalToCivicCost.textContent = primalForCivic.toLocaleString();
        civicToPrimalCost.textContent = civicForPrimal.toLocaleString();

        // Update button states and glows
        convertPrimalButton.disabled = floorPrimal < primalForCivic;
        convertPrimalButton.classList.toggle('can-afford', floorPrimal >= primalForCivic);

        convertCivicButton.disabled = floorCivic < civicForPrimal;
        convertCivicButton.classList.toggle('can-afford', floorCivic >= civicForPrimal);

    }
    // ... (Standard disable/affordability checks for other buttons remain)
}

// === INITIALIZATION ===
// Add listeners for the new conversion buttons
convertPrimalButton.addEventListener('click', convertPrimalToCivic);
convertCivicButton.addEventListener('click', convertCivicToPrimal);

// (Remove the old convertCivicButton listener)

// ... (Rest of the file is the same as the last version)
