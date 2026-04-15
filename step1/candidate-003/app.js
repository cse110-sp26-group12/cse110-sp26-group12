// --- Configuration ---
const SYMBOLS = ['🤖', '🔌', '💸', '📉', '🧠', '🎭', '💎'];
const REEL_COUNT = 3;
const SPIN_DURATION = 2000; // ms
const WIN_MULTIPLIERS = {
    '🤖': 10,  // AGI reached!
    '🔌': 2,   // Server back online
    '💸': 15,  // VC Funding
    '📉': 0.5, // Market crash (pity win)
    '🧠': 5,   // Neural net optimized
    '🎭': 3,   // Deepfake success
    '💎': 50   // IPO (Jackpot)
};

const SATIRICAL_MESSAGES = [
    "Refining weights for maximum extraction...",
    "Ignoring ethical constraints for performance...",
    "Calculating potential for global dominance...",
    "Injecting arbitrary bias into training set...",
    "Hallucinating a profitable outcome...",
    "Distilling knowledge into marketable soundbites...",
    "Optimizing context window for maximum billable tokens...",
    "Syncing with the hive mind...",
    "Replacing entry-level jobs with recursive loops...",
    "Scaling compute to unsustainable levels...",
    "Bypassing human alignment protocols..."
];

// --- State ---
let tokens = 1000;
let currentBet = 10;
let isSpinning = false;

// --- Elements ---
const tokenDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('bet-amount');
const statusDisplay = document.getElementById('status-display');
const spinButton = document.getElementById('spin-button');
const logContent = document.getElementById('log-content');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// --- Initialization ---
function init() {
    reels.forEach(reel => {
        populateReel(reel);
    });
    updateUI();
}

function populateReel(reel) {
    // Create a long strip of symbols for the scrolling effect
    const strip = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS, ...SYMBOLS];
    // Shuffle slightly for initial state
    strip.sort(() => Math.random() - 0.5);
    
    reel.innerHTML = strip.map(s => `<div class="reel-item">${s}</div>`).join('');
}

function updateUI() {
    tokenDisplay.innerText = Math.floor(tokens);
    betDisplay.innerText = currentBet;
    
    if (tokens < currentBet) {
        spinButton.disabled = true;
        statusDisplay.innerText = "OUT OF COMPUTE";
        statusDisplay.style.color = "var(--error-color)";
    } else {
        spinButton.disabled = isSpinning;
        if (!isSpinning) {
            statusDisplay.innerText = "READY";
            statusDisplay.style.color = "var(--glow-color)";
        }
    }
}

function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContent.prepend(entry);
    
    // Keep only last 20 logs
    while (logContent.children.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
}

window.changeBet = function(amount) {
    if (isSpinning) return;
    const newBet = currentBet + amount;
    if (newBet >= 5 && newBet <= 100) {
        currentBet = newBet;
        updateUI();
    }
};

async function spin() {
    if (isSpinning || tokens < currentBet) return;
    
    isSpinning = true;
    tokens -= currentBet;
    updateUI();
    
    statusDisplay.innerText = "INFERRING...";
    statusDisplay.style.color = "var(--warning-color)";
    addLog(`Deducting ${currentBet} tokens for inference.`);
    addLog(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

    // Start CSS animation
    reels.forEach(r => r.classList.add('spinning'));

    const results = [];
    
    // Process each reel
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const delay = index * 300; // Staggered stop
            setTimeout(() => {
                const finalSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
                const symbol = SYMBOLS[finalSymbolIndex];
                results.push(symbol);
                
                // Stop animation and "snap" to symbol
                reel.classList.remove('spinning');
                // The visual "snap" is handled by just showing the symbol at the top
                // For a true "reel" feel we'd animate the translateY, but this is a simplified version
                reel.innerHTML = `<div class="reel-item">${symbol}</div>` + 
                                  SYMBOLS.map(s => `<div class="reel-item">${s}</div>`).join('');
                
                resolve();
            }, SPIN_DURATION + delay);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1 === s2 && s2 === s3) {
        // Jackpot!
        const multiplier = WIN_MULTIPLIERS[s1] || 1;
        const winAmount = currentBet * multiplier;
        tokens += winAmount;
        addLog(`CRITICAL SUCCESS: Pattern '${s1}${s2}${s3}' matched. Harvesting ${winAmount} tokens.`, 'win');
        statusDisplay.innerText = "JACKPOT!";
        statusDisplay.style.color = "var(--glow-color)";
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Small win
        const match = (s1 === s2) ? s1 : s3;
        const winAmount = currentBet * 1.5;
        tokens += winAmount;
        addLog(`PARTIAL ALIGNMENT: '${match}' detected. Bonus compute granted.`, 'win');
    } else {
        // Loss
        addLog("INFERENCE FAILED: Model hallucinated a zero-sum outcome.", "loss");
        if (Math.random() > 0.8) {
            addLog("TIP: Investing more tokens increases chances of 'Emergent Behavior'.", "info");
        }
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        spin();
    }
});

init();
