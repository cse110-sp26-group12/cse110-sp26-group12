const SYMBOLS = ['🤖', '🧠', '⚡', '📉', '💸', '🦄', '💩'];
const SPIN_COST = 10;
const INITIAL_TOKENS = 100;

let tokens = INITIAL_TOKENS;
let valuation = 0;
let isSpinning = false;

const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('token-count');
const valuationDisplay = document.getElementById('valuation');
const logsContainer = document.getElementById('logs');

const AI_MESSAGES = {
    start: [
        "Initializing neural weights...",
        "Scraping Reddit for training data...",
        "Scaling cluster to 10,000 H100s...",
        "Overfitting on noise...",
        "Hallucinating a bullish market..."
    ],
    win: [
        "Emergent behavior detected: PROFIT.",
        "AIGC generated a patentable idea.",
        "Pivot successful. Valuation increased.",
        "Optimization complete. Local maxima found.",
        "Series A funding secured via LinkedIn buzzwords."
    ],
    loss: [
        "Model collapse imminent.",
        "Hallucinating a reason to continue...",
        "RLHF indicates user is disappointed.",
        "Error: Token limit exceeded by reality.",
        "Stochastic parrot failed to repeat success."
    ],
    empty: [
        "Out of tokens. Applying for government subsidy...",
        "Burn rate: Infinite. Runway: Zero.",
        "System failure. Have you tried adding more layers?"
    ]
};

function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    if (type === 'win') entry.style.color = 'var(--neon-green)';
    if (type === 'loss') entry.style.color = 'var(--neon-pink)';
    
    logsContainer.prepend(entry);
    if (logsContainer.childNodes.length > 20) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    valuationDisplay.textContent = `$${valuation.toLocaleString()}M`;
    spinBtn.disabled = tokens < SPIN_COST || isSpinning;
}

async function spin() {
    if (tokens < SPIN_COST || isSpinning) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateUI();

    addLog(AI_MESSAGES.start[Math.floor(Math.random() * AI_MESSAGES.start.length)]);

    // Start spinning animation
    reelElements.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Randomize results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Wait for "inference" (simulated delay)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop animation and show results
    reelElements.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.querySelector('.reel-content').textContent = results[i];
    });

    calculateResult(results);
    isSpinning = false;
    updateUI();
}

function calculateResult(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let valuationBoost = 0;

    if (r1 === r2 && r2 === r3) {
        // Triple match
        if (r1 === '🦄') {
            winAmount = 500;
            valuationBoost = 1000;
            addLog("UNICORN STATUS ACHIEVED! Valuation skyrocketing!", 'win');
        } else if (r1 === '💩') {
            winAmount = 0;
            valuationBoost = -valuation;
            addLog("TOTAL MODEL COLLAPSE. Valuation reset.", 'loss');
        } else {
            winAmount = 50;
            valuationBoost = 100;
            addLog(AI_MESSAGES.win[Math.floor(Math.random() * AI_MESSAGES.win.length)], 'win');
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Double match
        winAmount = 15;
        valuationBoost = 10;
        addLog("Partial convergence. Minor optimization found.", 'win');
    } else {
        // No match
        addLog(AI_MESSAGES.loss[Math.floor(Math.random() * AI_MESSAGES.loss.length)], 'loss');
        valuationBoost = -1;
    }

    tokens += winAmount;
    valuation = Math.max(0, valuation + valuationBoost);
    
    if (winAmount > 0) {
        reelElements.forEach(reel => {
            reel.classList.add('win-flash');
            setTimeout(() => reel.classList.remove('win-flash'), 1000);
        });
    }

    if (tokens <= 0) {
        addLog(AI_MESSAGES.empty[Math.floor(Math.random() * AI_MESSAGES.empty.length)], 'loss');
    }
}

spinBtn.addEventListener('click', spin);

// Initial log
addLog("AGI-lot System v0.1.0-alpha loaded.");
addLog("Seed tokens granted. Prepare for disruption.");
updateUI();
