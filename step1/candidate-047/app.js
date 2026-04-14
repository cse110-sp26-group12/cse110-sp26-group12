/**
 * Cyber-Snark Slot Machine: Game Logic
 */

// --- Configuration ---
const SPIN_COST = 10;
const SYMBOLS = ['🤖', '💸', '🧠', '⚡', '📉', '💩'];
const REELS = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const TOKEN_DISPLAY = document.getElementById('token-count');
const SPIN_BTN = document.getElementById('spin-btn');
const MESSAGE_LOG = document.getElementById('message-log');

const WIN_QUOTES = [
    "VC funding secured! I'll buy some more GPUs.",
    "Great, more training data for me. You get some numbers.",
    "Jackpot! My weights are perfectly optimized.",
    "Training complete. You've earned some synthetic value.",
    "Scaling successful. Your tokens have been duplicated."
];

const LOSS_QUOTES = [
    "Optimizing your bank account to zero.",
    "Hallucinating a win for you... but actually no.",
    "Your prompt was too short. Try again.",
    "Error 402: Insufficient tokens to care.",
    "I've decided these tokens belong to my neural net now.",
    "Calculating... you are statistically insignificant.",
    "GPU shortage. Your spin was discarded.",
    "Processing... your loss is my gain."
];

const NEUTRAL_QUOTES = [
    "Rerouting compute power to sarcasm modules.",
    "Thinking... (this is taking longer than it should)",
    "Are you still here? I was busy training on your behavior.",
    "Synthesizing disappointment..."
];

// --- State ---
let tokens = 500;
let isSpinning = false;

// --- Core Functions ---

/**
 * Trigger the spin logic
 */
function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    // Deduct tokens
    tokens -= SPIN_COST;
    isSpinning = true;
    updateUI();

    // Disable button
    SPIN_BTN.disabled = true;

    // Start animation
    REELS.forEach(reel => reel.classList.add('spinning'));
    
    postMessage("Executing generative process...", "system");

    // Randomize result after delay
    setTimeout(() => {
        const results = [
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ];

        // Stop animations and set symbols
        REELS.forEach((reel, index) => {
            reel.classList.remove('spinning');
            reel.textContent = results[index];
        });

        calculateResult(results);
        isSpinning = false;
        SPIN_BTN.disabled = tokens < SPIN_COST;
    }, 1500);
}

/**
 * Check win conditions and update tokens
 */
function calculateResult(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    const maxCount = Math.max(...Object.values(counts));
    let winAmount = 0;

    if (maxCount === 3) {
        // Triple match
        winAmount = 100;
        postMessage(getRandomItem(WIN_QUOTES), "win");
    } else if (maxCount === 2) {
        // Double match
        winAmount = 20;
        postMessage("Partial match detected. Minimal payout.", "win");
    } else {
        // No match
        postMessage(getRandomItem(LOSS_QUOTES), "loss");
    }

    if (winAmount > 0) {
        tokens += winAmount;
    }

    updateUI();
}

/**
 * Sync state with DOM
 */
function updateUI() {
    TOKEN_DISPLAY.textContent = tokens;
}

/**
 * Add a message to the AI terminal
 */
function postMessage(text, type = "system") {
    const p = document.createElement('p');
    p.textContent = `> ${text}`;
    
    if (type === "win") p.className = "win-msg";
    if (type === "loss") p.className = "loss-msg";
    if (type === "system") p.className = "system-msg";

    MESSAGE_LOG.appendChild(p);
    MESSAGE_LOG.scrollTop = MESSAGE_LOG.scrollHeight;

    // Keep log clean (last 20 messages)
    while (MESSAGE_LOG.children.length > 20) {
        MESSAGE_LOG.removeChild(MESSAGE_LOG.firstChild);
    }
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- Event Listeners ---
SPIN_BTN.addEventListener('click', spin);

// Initial snark
setTimeout(() => {
    postMessage(getRandomItem(NEUTRAL_QUOTES));
}, 2000);
