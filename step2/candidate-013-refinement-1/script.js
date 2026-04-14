const SYMBOLS = [
    { icon: '🤖', name: 'AGI', multiplier: 100 },
    { icon: '🧠', name: 'Neural Net', multiplier: 25 },
    { icon: '🖼️', name: 'Deepfake', multiplier: 10 },
    { icon: '💬', name: 'Chatbot', multiplier: 5 },
    { icon: '📉', name: 'Token Crash', multiplier: 0 }
];

const HYPE_PHRASES = [
    "Scraping personal data without consent...",
    "Hallucinating a sustainable business model...",
    "Pivoting to 'Agentic' workflows for VC funding...",
    "Burning through H100 GPU clusters...",
    "Optimizing weights for maximum user retention...",
    "Discarding privacy policy for training data...",
    "Implementing 'AI' into a simple spreadsheet...",
    "Raising Series D at a $50B valuation with zero revenue...",
    "Calculating why we need $7 Trillion...",
    "Replacing 10 developers with one buggy prompt...",
    "Injecting venture capital directly into the cooling system...",
    "Scaling to infinite compute (credit card limit reached)...",
    "Filtering 'offensive' content (everything that isn't an ad)...",
    "Prompt engineering the CEO's resignation letter...",
    "Buying up all the water in the county for cooling..."
];

// Configuration
const SYMBOL_HEIGHT = 120; // Must match CSS --symbol-height
const SPIN_DURATION = 2000;
const REEL_DELAY = 300;
const INITIAL_CREDITS = 1000;

// Game State
let credits = INITIAL_CREDITS;
let lastWin = 0;
let isSpinning = false;
let autoSpinTimeout = null;

// DOM Elements
const creditDisplay = document.getElementById('credit-display');
const winDisplay = document.getElementById('win-display');
const gpuDisplay = document.getElementById('gpu-display');
const betInput = document.getElementById('bet-input');
const spinButton = document.getElementById('spin-button');
const autoSpinCheckbox = document.getElementById('auto-spin');
const logOutput = document.getElementById('log-output');
const winLine = document.querySelector('.win-line');
const reelStrips = [
    document.getElementById('reel-1').querySelector('.reel-strip'),
    document.getElementById('reel-2').querySelector('.reel-strip'),
    document.getElementById('reel-3').querySelector('.reel-strip')
];

/**
 * Initialize the game
 */
function init() {
    reelStrips.forEach((strip, index) => {
        setupReel(strip);
    });
    updateUI();
    addLog("System initialized. AGI expected in 6 months.");
}

/**
 * Setup a reel with an initial set of symbols
 */
function setupReel(strip) {
    strip.innerHTML = '';
    // Add 3 initial random symbols
    for (let i = 0; i < 3; i++) {
        const symbol = getRandomSymbol();
        strip.appendChild(createSymbolElement(symbol));
    }
}

/**
 * Create a DOM element for a symbol
 */
function createSymbolElement(symbol) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.innerHTML = `${symbol.icon}<span>${symbol.name}</span>`;
    return div;
}

/**
 * Get a random symbol from the pool
 */
function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

/**
 * Update the UI displays
 */
function updateUI() {
    creditDisplay.textContent = Math.floor(credits);
    winDisplay.textContent = lastWin;
    
    // Highlight win display if there's a win
    if (lastWin > 0) {
        winDisplay.classList.add('winning-text');
    } else {
        winDisplay.classList.remove('winning-text');
    }
}

/**
 * Add a message to the terminal log
 */
function addLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    logOutput.prepend(p);
    
    // Keep only last 20 logs
    while (logOutput.childNodes.length > 20) {
        logOutput.removeChild(logOutput.lastChild);
    }
}

/**
 * The main spin function
 */
async function runInference() {
    if (isSpinning) return;

    const bet = parseInt(betInput.value);
    
    // Validation
    if (isNaN(bet) || bet <= 0) {
        addLog("ERROR: Invalid bet amount.");
        return;
    }

    if (credits < bet) {
        addLog("CRITICAL ERROR: Insufficient compute credits. SELL MORE DATA.");
        autoSpinCheckbox.checked = false;
        return;
    }

    // Prepare state
    isSpinning = true;
    credits -= bet;
    lastWin = 0;
    updateUI();
    spinButton.disabled = true;
    winLine.classList.remove('active');

    addLog(HYPE_PHRASES[Math.floor(Math.random() * HYPE_PHRASES.length)]);
    
    // GPU Jitter effect
    const gpuInterval = setInterval(() => {
        const util = 90 + Math.floor(Math.random() * 10);
        gpuDisplay.textContent = `${util}%`;
    }, 100);

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Animate reels
    const spinPromises = reelStrips.map((strip, i) => animateReel(strip, i, results[i]));

    await Promise.all(spinPromises);

    // End spin
    clearInterval(gpuInterval);
    gpuDisplay.textContent = "0%";
    isSpinning = false;
    spinButton.disabled = false;

    processResults(results, bet);

    // Handle Auto-spin
    if (autoSpinCheckbox.checked) {
        autoSpinTimeout = setTimeout(runInference, 1200);
    }
}

/**
 * Animates a single reel
 */
function animateReel(strip, index, finalSymbol) {
    return new Promise(resolve => {
        const delay = index * REEL_DELAY;
        const extraSymbolsCount = 20 + (index * 5); // Random number of symbols to scroll through
        
        // Add temporary symbols for the spin effect
        for (let i = 0; i < extraSymbolsCount; i++) {
            strip.appendChild(createSymbolElement(getRandomSymbol()));
        }
        
        // Add the final symbol
        strip.appendChild(createSymbolElement(finalSymbol));
        
        // We need 2 extra symbols to show after the final one if we want it centered,
        // but since our reel shows exactly 1 symbol height, the last one we append will be it.
        
        const totalHeight = (strip.children.length - 1) * SYMBOL_HEIGHT;
        
        setTimeout(() => {
            strip.style.transition = `transform ${SPIN_DURATION + delay}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${totalHeight}px)`;
            
            setTimeout(() => {
                // Cleanup: remove all but the final symbol and reset transform
                strip.style.transition = 'none';
                strip.style.transform = 'translateY(0)';
                strip.innerHTML = '';
                strip.appendChild(createSymbolElement(finalSymbol));
                
                // Add two more random ones just for visual consistency if needed, 
                // but our current CSS hides overflow so it doesn't matter much.
                
                resolve();
            }, SPIN_DURATION + delay);
        }, 50);
    });
}

/**
 * Logic to check for wins
 */
function processResults(results, bet) {
    const [s1, s2, s3] = results;
    let win = 0;

    if (s1.name === s2.name && s2.name === s3.name) {
        // 3 of a kind
        win = bet * s1.multiplier;
        if (win > 0) {
            addLog(`SUCCESS: Emergent AGI detected! Reward: ${win} credits.`);
            winLine.classList.add('active');
        } else {
            addLog(`WARNING: 3x Token Crash. Market collapse imminent.`);
        }
    } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
        // 2 of a kind
        win = bet * 2;
        addLog(`NOTICE: Local optimization found. Reward: ${win} credits.`);
    } else {
        addLog("FAILURE: Model hallucinated. Compute wasted.");
    }

    if (win > 0) {
        credits += win;
        lastWin = win;
    }
    updateUI();
}

// Event Listeners
spinButton.addEventListener('click', runInference);

// Max bet sanity check
betInput.addEventListener('change', () => {
    if (parseInt(betInput.value) > credits) {
        betInput.value = Math.max(1, Math.floor(credits / 10) * 10);
    }
});

// Start the app
init();
