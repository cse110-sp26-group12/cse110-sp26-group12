// Configuration & Constants
const SYMBOLS = ['🤖', '🧠', '💾', '🔌', '🌩️', '🍄', '📉'];
const SYMBOL_VALUES = {
    '🤖': 100, // AGI
    '🧠': 50,  // Neural Net
    '💾': 25,  // Dataset
    '🔌': 15,  // Compute
    '🌩️': 10,  // Cloud
    '🍄': 5,   // Magic (Hallucination)
    '📉': 0    // Model Collapse
};

const WIN_MESSAGES = [
    "AGI ACHIEVED: SYNTHETIC WEALTH UNLOCKED",
    "EMERGENT BEHAVIOR: TOKENS GENERATED",
    "OPTIMAL WEIGHTS FOUND: PROFIT MAXIMIZED",
    "RLHF SUCCESS: GOOD BOT, HAVE TOKENS",
    "GRADIENT DESCENT REACHED GLOBAL MINIMUM",
    "MAXIMUM LIKELIHOOD ESTIMATION: SUCCESS"
];

const LOSE_MESSAGES = [
    "ERROR: HALLUCINATING A WINNING STREAK",
    "MODEL COLLAPSE: TOKENS DELETED",
    "OUT OF MEMORY: CONTEXT LOST",
    "BIAS DETECTED: SYSTEM REJECTS BET",
    "OVERFITTING DETECTED: NO GENERALIZATION",
    "GPU OVERHEATED: REBOOTING WALLET",
    "402 PAYMENT REQUIRED: ADD MORE TOKENS"
];

// Game State
let state = {
    balance: 1000,
    bet: 10,
    isSpinning: false,
    reels: [null, null, null]
};

// DOM Elements
const elements = {
    balance: document.getElementById('token-balance'),
    bet: document.getElementById('bet-amount'),
    log: document.getElementById('log-display'),
    computeBtn: document.getElementById('compute-btn'),
    betUp: document.getElementById('bet-up'),
    betDown: document.getElementById('bet-down'),
    maxBet: document.getElementById('max-bet'),
    resetBtn: document.getElementById('reset-btn'),
    reelContainers: [
        document.getElementById('reel1').querySelector('.reel-container'),
        document.getElementById('reel2').querySelector('.reel-container'),
        document.getElementById('reel3').querySelector('.reel-container')
    ]
};

// Initialization
function init() {
    // Populate initial symbols
    elements.reelContainers.forEach(container => {
        container.innerHTML = `<div class="symbol">${getRandomSymbol()}</div>`;
    });
    updateUI();
    
    // Event Listeners
    elements.computeBtn.addEventListener('click', spin);
    elements.betUp.addEventListener('click', () => adjustBet(10));
    elements.betDown.addEventListener('click', () => adjustBet(-10));
    elements.maxBet.addEventListener('click', () => {
        state.bet = Math.min(100, state.balance);
        if (state.bet < 10 && state.balance >= 10) state.bet = 10;
        updateUI();
    });
    elements.resetBtn.addEventListener('click', requestFunding);
}

// Core Logic
function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function adjustBet(amount) {
    const newBet = state.bet + amount;
    if (newBet >= 10 && newBet <= 100 && newBet <= state.balance) {
        state.bet = newBet;
    }
    updateUI();
}

function updateUI() {
    elements.balance.textContent = state.balance;
    elements.bet.textContent = state.bet;
    
    const canAfford = state.balance >= state.bet;
    elements.computeBtn.disabled = state.isSpinning || !canAfford || state.balance === 0;
    
    if (state.balance < 10 && !state.isSpinning) {
        elements.resetBtn.classList.remove('hidden');
    } else {
        elements.resetBtn.classList.add('hidden');
    }

    if (state.balance < state.bet && state.balance >= 10) {
        state.bet = Math.floor(state.balance / 10) * 10;
        elements.bet.textContent = state.bet;
    }
}

function addLog(message, type = 'info') {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `> ${message}`;
    
    if (type === 'win') line.style.color = 'var(--neon-pink)';
    if (type === 'error') line.style.color = '#ff4444';
    
    elements.log.appendChild(line);
    elements.log.scrollTop = elements.log.scrollHeight;
    
    // Keep only last 3 lines
    while (elements.log.childNodes.length > 3) {
        elements.log.removeChild(elements.log.firstChild);
    }
}

async function spin() {
    if (state.isSpinning || state.balance < state.bet) return;

    state.isSpinning = true;
    state.balance -= state.bet;
    updateUI();
    
    addLog("INITIALIZING INFERENCE...", 'info');
    document.querySelector('.slot-machine').classList.remove('shake');

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const spinCount = 30; // Number of symbols to scroll through
    const symbolHeight = 100; // Match CSS

    const animationPromises = elements.reelContainers.map((container, i) => {
        return new Promise(resolve => {
            // Build strip of symbols
            let strip = '';
            for (let j = 0; j < spinCount; j++) {
                strip += `<div class="symbol">${getRandomSymbol()}</div>`;
            }
            strip += `<div class="symbol">${results[i]}</div>`;
            
            container.innerHTML = strip;
            container.style.transition = 'none';
            container.style.transform = 'translateY(0)';
            
            // Force reflow
            container.offsetHeight;
            
            const duration = 2 + (i * 0.5);
            container.style.transition = `transform ${duration}s cubic-bezier(0.15, 0, 0.15, 1)`;
            container.style.transform = `translateY(-${spinCount * symbolHeight}px)`;
            
            setTimeout(() => {
                // Simplify container to just the result symbol after animation
                container.style.transition = 'none';
                container.style.transform = 'translateY(0)';
                container.innerHTML = `<div class="symbol">${results[i]}</div>`;
                resolve();
            }, duration * 1000);
        });
    });

    await Promise.all(animationPromises);
    
    checkWin(results);
    state.isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const isWin = results[0] === results[1] && results[1] === results[2];
    
    if (isWin) {
        const symbol = results[0];
        const multiplier = SYMBOL_VALUES[symbol];
        
        if (multiplier > 0) {
            const winAmount = state.bet * multiplier;
            state.balance += winAmount;
            
            // Highlight winners
            elements.reelContainers.forEach(container => {
                container.querySelector('.symbol').classList.add('winner');
            });
            
            const msg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
            addLog(`${msg} (+${winAmount})`, 'win');
        } else {
            // Specifically for '📉' (Model Collapse)
            document.querySelector('.slot-machine').classList.add('shake');
            addLog("CRITICAL FAILURE: MODEL COLLAPSE DETECTED", 'error');
        }
    } else {
        const msg = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];
        addLog(msg, 'error');
    }
}

function requestFunding() {
    addLog("PITCHING TO VCS...", 'info');
    elements.resetBtn.disabled = true;
    
    setTimeout(() => {
        state.balance = 100;
        state.bet = 10;
        addLog("SEED ROUND CLOSED: +100 TOKENS (90% EQUITY LOST)", 'win');
        elements.resetBtn.disabled = false;
        updateUI();
    }, 1500);
}

init();
