// AI TOKEN GRINDER - Game Logic
const SYMBOLS = ['🧠', '💾', '⛓️', '⚠️', '💎'];
const PAYOUTS = {
    '💎': 1000,
    '🧠': 100,
    '💾': 50,
    '⛓️': 20,
    '⚠️': 0
};

const QUIPS = [
    "Optimizing weights... result: Garbage.",
    "RLHF failed. Model is now sentient and depressed.",
    "Training on Reddit data... accuracy: -5%.",
    "Context window exceeded. Forgetting your existence.",
    "Hallucinating a better reality for you...",
    "GPU cooling fan sounds like a dying whale.",
    "Vector database corrupted by memes.",
    "Stochastic parrot says: 'SQUAWK! MONEY PLEASE!'",
    "Prompt engineering complete: 'Be a slot machine'.",
    "Scaling laws hit a wall. Adding more layers of regret.",
    "Fine-tuning on LinkedIn 'Thought Leader' posts...",
    "Temperature set to 2.0. Logic has left the building."
];

let tokens = 500;
let isSpinning = false;

const tokenBalanceEl = document.getElementById('token-balance');
const statusLogEl = document.getElementById('status-log');
const inferenceBtn = document.getElementById('inference-btn');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const REEL_ANIMATION_SYMBOLS = 20;

function createSymbol(char) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = char;
    return div;
}

// Initialize Reels
function initReels() {
    reels.forEach(reel => {
        const strip = reel.querySelector('.reel-strip');
        strip.innerHTML = '';
        strip.appendChild(createSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
    });
}

async function runInference() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    updateHUD();
    inferenceBtn.disabled = true;
    
    updateStatus("INITIALIZING INFERENCE SEQUENCE...");

    const results = [];
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const strip = reel.querySelector('.reel-strip');
            const resultSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            results.push(resultSymbol);

            // Populate the strip with random symbols for the spin effect
            for (let i = 0; i < REEL_ANIMATION_SYMBOLS; i++) {
                strip.appendChild(createSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
            }
            // Add the final result
            strip.appendChild(createSymbol(resultSymbol));

            const symbolHeight = 120;
            const targetY = (strip.children.length - 1) * symbolHeight;

            // Trigger animation
            setTimeout(() => {
                strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.transform = `translateY(-${targetY}px)`;
            }, 50);

            // Wait for transition to end, then "snap" to the new result and cleanup
            setTimeout(() => {
                strip.style.transition = 'none';
                strip.style.transform = 'translateY(0)';
                strip.innerHTML = '';
                strip.appendChild(createSymbol(resultSymbol));
                resolve();
            }, 2500 + (index * 500));
        });
    });

    await Promise.all(spinPromises);
    
    calculateResult(results);
    isSpinning = false;
    inferenceBtn.disabled = tokens < 10;
}

function calculateResult(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
        winAmount = PAYOUTS[r1] || 0;
        if (winAmount > 0) {
            updateStatus(`SUCCESS: HIGH ACCURACY MATCH! +${winAmount} TOKENS`);
        } else if (winAmount < 0) {
            updateStatus(`CRITICAL FAILURE: MODEL HALLUCINATED A DEBT. ${winAmount} TOKENS`);
        }
    } else {
        updateStatus(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    }

    tokens += winAmount;
    updateHUD();
}

function updateHUD() {
    tokenBalanceEl.textContent = tokens;
}

function updateStatus(message) {
    statusLogEl.textContent = message;
}

inferenceBtn.addEventListener('click', runInference);

// Start
initReels();
updateHUD();
