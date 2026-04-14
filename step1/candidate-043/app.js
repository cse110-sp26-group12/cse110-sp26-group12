/**
 * TOKEN BURNER: AGI Slot Machine
 * Satirical game logic for AI token consumption.
 */

// --- Configuration ---
const SYMBOLS = ['🤖', '⚡', '🍄', '💰', '💾', '📜'];
const SPIN_DURATION = 1500; // ms
const TOKEN_COST = 5;
const STARTING_TOKENS = 100;

const SATIRICAL_MESSAGES = [
    "Optimizing learning rate...",
    "Hallucinating a jackpot...",
    "Scaling compute to 110%...",
    "Running out of H100s...",
    "Fine-tuning on user data...",
    "Injecting venture capital...",
    "Prompt engineering for profit...",
    "RLHF in progress...",
    "Normalizing weights...",
    "Drafting 'Why we failed' blog post...",
    "Searching for more training data...",
    "Reducing temperature for stability...",
];

// --- State ---
let tokens = STARTING_TOKENS;
let validation = 0;
let isSpinning = false;

// --- Elements ---
const tokenDisplay = document.getElementById('token-count');
const scoreDisplay = document.getElementById('score-count');
const terminalLog = document.getElementById('terminal-log');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// --- Utilities ---
const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

const logToTerminal = (msg) => {
    terminalLog.textContent = msg;
};

const updateUI = () => {
    tokenDisplay.textContent = tokens;
    scoreDisplay.textContent = validation;
    spinBtn.disabled = isSpinning || tokens < TOKEN_COST;
};

// --- Game Logic ---
const spin = async () => {
    if (isSpinning || tokens < TOKEN_COST) return;

    isSpinning = true;
    tokens -= TOKEN_COST;
    updateUI();
    logToTerminal(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

    // Start spinning animation
    reels.forEach(reel => {
        reel.querySelector('.reel-content').classList.add('spinning');
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, SPIN_DURATION));

    // Calculate results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop animation and show results
    reels.forEach((reel, i) => {
        const content = reel.querySelector('.reel-content');
        content.classList.remove('spinning');
        content.textContent = results[i];
    });

    processResults(results);
    isSpinning = false;
    updateUI();
};

const processResults = (results) => {
    const [s1, s2, s3] = results;

    // Check for Big Win (AGI Reached)
    if (s1 === s2 && s2 === s3) {
        let winAmount = 50;
        let msg = "AGI REACHED! Validation levels surging.";
        
        // Bonus for special symbols
        if (s1 === '🤖') {
            winAmount = 100;
            msg = "OVERLORD DETECTED. Infinite scaling enabled.";
        } else if (s1 === '🍄') {
            winAmount = 0;
            tokens = 0;
            msg = "CATASTROPHIC HALLUCINATION. Tokens evaporated.";
        } else if (s1 === '💰') {
            winAmount = 200;
            msg = "SERIES B FUNDING SECURED. Buying more GPUs.";
        }

        validation += winAmount;
        logToTerminal(msg);
        reels.forEach(r => r.classList.add('win-pulse'));
        setTimeout(() => reels.forEach(r => r.classList.remove('win-pulse')), 2000);
    } 
    // Check for Minor Win (Fine-tuned)
    else if (s1 === s2 || s2 === s3 || s1 === s3) {
        validation += 10;
        logToTerminal("Partial alignment achieved. Minimal validation granted.");
    } 
    // Loss
    else {
        logToTerminal("No correlation found. Try increasing batch size.");
    }

    if (tokens < TOKEN_COST && tokens > 0) {
        logToTerminal("GPU poor status imminent. Pitch to VCs?");
    } else if (tokens <= 0) {
        logToTerminal("BANKRUPT. Model collapsed into noise.");
    }
};

const reset = () => {
    tokens = STARTING_TOKENS;
    validation = 0;
    logToTerminal("New seed generated. Fresh VC funding acquired.");
    reels.forEach((reel, i) => {
        reel.querySelector('.reel-content').textContent = SYMBOLS[i];
    });
    updateUI();
};

// --- Events ---
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

// Initial state
updateUI();
