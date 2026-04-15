// Game Configuration
const SYMBOLS = [
    { char: '🤖', name: 'Founder', weight: 1, payout: 100 },
    { char: '⚡', name: 'Compute', weight: 2, payout: 50 },
    { char: '☁️', name: 'Cloud', weight: 3, payout: 20 },
    { char: '💼', name: 'VC', weight: 4, payout: 10 },
    { char: '🚫', name: 'Downround', weight: 5, payout: 0 }
];

const MESSAGES = {
    SPIN: [
        "Optimizing hyperparameters...",
        "Fine-tuning model on public domain data...",
        "Scaling up GPU cluster...",
        "Scraping the internet for training data...",
        "Ingesting venture capital for compute...",
        "Attempting to reach the Singularity..."
    ],
    WIN: [
        "Model converged! Huge success.",
        "Revenue increased! Series B incoming.",
        "Algorithm optimized. Payout secured.",
        "AI Agent achieved autonomous profit."
    ],
    LOSS: [
        "Hallucination detected - Tokens burned.",
        "Model failed to converge. Try again.",
        "API rate limit exceeded. Pay more.",
        "Bias detected! PR disaster, tokens lost.",
        "Overfitting on noise. Payout: 0."
    ]
};

// Game State
let balance = 1000;
let singularityProgress = 0;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-display');
const progressDisplay = document.getElementById('singularity-progress');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinButton = document.getElementById('spin-button');
const betAmountInput = document.getElementById('bet-amount');
const logContent = document.getElementById('log-content');

// Initialize
updateUI();

spinButton.addEventListener('click', () => {
    if (isSpinning) return;
    
    const betAmount = parseInt(betAmountInput.value);
    
    if (balance < betAmount) {
        addLog("CRITICAL ERROR: Insufficient compute tokens. Need Series A funding.", "error");
        return;
    }

    startSpin(betAmount);
});

function startSpin(bet) {
    isSpinning = true;
    balance -= bet;
    updateUI();
    
    addLog(`> ${getRandomMessage(MESSAGES.SPIN)}`);
    
    // Add spinning animation class
    reelElements.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.add('spinning');
        }, index * 100);
    });

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Wait for animation to "finish" (simulate)
    setTimeout(() => {
        stopSpin(results, bet);
    }, 2000);
}

function stopSpin(results, bet) {
    reelElements.forEach((reel, index) => {
        setTimeout(() => {
            reel.classList.remove('spinning');
            reel.textContent = results[index].char;
        }, index * 300);
    });

    setTimeout(() => {
        processResults(results, bet);
        isSpinning = false;
    }, 1200);
}

function processResults(results, bet) {
    const isWin = results[0].char === results[1].char && results[1].char === results[2].char;
    
    if (isWin) {
        const symbol = results[0];
        const winnings = bet * symbol.payout;
        balance += winnings;
        singularityProgress = Math.min(100, singularityProgress + (symbol.payout / 5));
        
        addLog(`> SUCCESS: Triple ${symbol.name}! +${winnings} CT.`, "success");
        addLog(`> ${getRandomMessage(MESSAGES.WIN)}`, "success");
        
        if (singularityProgress >= 100) {
            addLog("!!! SINGULARITY REACHED !!! Artificial General Intelligence achieved.", "success");
            singularityProgress = 0; // Reset or keep it? Let's reset for more gambling.
        }
    } else {
        addLog(`> FAILURE: ${getRandomMessage(MESSAGES.LOSS)}`, "error");
    }

    updateUI();
}

function getRandomSymbol() {
    // Weighted randomness
    const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function getRandomMessage(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

function updateUI() {
    balanceDisplay.textContent = `BALANCE: ${balance} CT`;
    progressDisplay.textContent = `SINGULARITY: ${Math.floor(singularityProgress)}%`;
}

function addLog(text, type = "") {
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    entry.textContent = text;
    logContent.prepend(entry); // Newest on top
}
