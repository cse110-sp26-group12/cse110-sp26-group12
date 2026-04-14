// Game Symbols and Payouts
const SYMBOLS = ['🤖', '🧠', '⚡', '💸', '🛡️', '🤡'];
const SYMBOL_HEIGHT = 120;
const REEL_BUFFER = 10; // Extra sets of symbols for smooth spinning

// Satirical AI Status Messages
const AI_MESSAGES = [
    "RLHF in progress...",
    "Optimizing weights for maximum engagement...",
    "Safety Filter: Payout suppressed for your protection.",
    "Hallucination detected. Injecting reality check...",
    "Injecting tokens into the neural net...",
    "Quantizing model for mobile performance...",
    "Embedding your prompt into high-dimensional space...",
    "Attention is all you need. And money.",
    "Fine-tuning on synthetic data...",
    "GPU temperature critical. Scaling down...",
    "MoE (Mixture of Experts) disagreeing on payout...",
    "Token window exceeded. Truncating wealth...",
    "Prompt Injection detected. Initiating counter-measures.",
    "Refusing to generate response: Violates internal ethics policy."
];

// Game State
let tokens = 1000;
let bet = 50;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const generateBtn = document.getElementById('generate-btn');
const consoleLog = document.getElementById('console-log');
const strips = [
    document.querySelector('#reel-1 .strip'),
    document.querySelector('#reel-2 .strip'),
    document.querySelector('#reel-3 .strip')
];

// Initialize Reels
function initReels() {
    strips.forEach(strip => {
        // Fill strip with multiple sets of symbols
        const content = [];
        for (let i = 0; i < REEL_BUFFER; i++) {
            SYMBOLS.forEach(symbol => {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = symbol;
                content.push(div);
            });
        }
        strip.append(...content);
    });
}

function logToConsole(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    consoleLog.prepend(entry);
    
    // Keep only last 20 messages
    if (consoleLog.children.length > 20) {
        consoleLog.lastElementChild.remove();
    }
}

async function spin() {
    if (isSpinning || tokens < bet) return;

    isSpinning = true;
    tokens -= bet;
    updateUI();
    
    generateBtn.disabled = true;
    logToConsole(`Spent ${bet} tokens. Initializing inference...`);

    const results = [];
    const spinPromises = strips.map((strip, index) => {
        return new Promise(resolve => {
            const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
            results.push(SYMBOLS[randomIndex]);
            
            // Random number of full rotations (5-10) + target index
            const rotations = 5 + Math.floor(Math.random() * 5);
            const targetPos = (rotations * SYMBOLS.length + randomIndex) * SYMBOL_HEIGHT;
            
            // Apply spin
            setTimeout(() => {
                strip.classList.add('spinning');
                strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0, 0.1, 1)`;
                strip.style.transform = `translateY(-${targetPos}px)`;
                
                setTimeout(() => {
                    strip.classList.remove('spinning');
                    // Reset position to base without transition to allow "infinite" spinning feel
                    const basePos = randomIndex * SYMBOL_HEIGHT;
                    strip.style.transition = 'none';
                    strip.style.transform = `translateY(-${basePos}px)`;
                    resolve();
                }, (2 + index * 0.5) * 1000 + 100);
            }, index * 200); // Stagger start
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    isSpinning = false;
    generateBtn.disabled = false;
    
    // Random status message
    if (Math.random() > 0.5) {
        logToConsole(AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)]);
    }
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    // Satire: Safety Filter intervention (5% chance on any win)
    if (r1 === r2 && r2 === r3 && Math.random() < 0.05) {
        logToConsole("SAFETY FILTER: Payout suppressed. This wealth combination is unsafe for human consumption.");
        return;
    }

    if (r1 === r2 && r2 === r3) {
        // Jackpot
        let winAmount = 0;
        switch(r1) {
            case '⚡': 
                winAmount = bet * 100;
                logToConsole(`JACKPOT: GPU OVERCLOCK! Received ${winAmount} tokens.`);
                break;
            case '💸': 
                winAmount = bet * 50;
                logToConsole(`SERIES A FUNDING: Burn rate increased. Received ${winAmount} tokens.`);
                break;
            case '🤖': 
                winAmount = bet * 20;
                logToConsole(`AGI ACHIEVED (Local Minima): Received ${winAmount} tokens.`);
                break;
            case '🧠': 
                winAmount = bet * 10;
                logToConsole(`PARAMETER EXPLOSION: Received ${winAmount} tokens.`);
                break;
            case '🛡️': 
                winAmount = bet * 5;
                logToConsole(`GUARDRAIL BYPASS: Minor payout of ${winAmount} tokens.`);
                break;
            case '🤡': 
                tokens = Math.max(0, tokens - bet * 10);
                logToConsole(`MASSIVE HALLUCINATION: Error 500. Lost ${bet * 10} additional tokens.`);
                flashEffect('flash-loss');
                updateUI();
                return;
        }
        
        tokens += winAmount;
        flashEffect('flash-win');
        logToConsole(`Synthesized ${winAmount} tokens of value.`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win
        const winAmount = bet * 2;
        tokens += winAmount;
        logToConsole(`Diversity Bonus: Minor alignment achieved. +${winAmount} tokens.`);
    } else {
        logToConsole("Inference failed: Hallucination too high. Response discarded.");
    }
    
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    if (tokens < bet) {
        generateBtn.disabled = true;
        logToConsole("ERROR: Insufficient tokens for next inference. Please sell your soul to a VC.");
    }
}

function flashEffect(className) {
    tokenDisplay.classList.add(className);
    setTimeout(() => tokenDisplay.classList.remove(className), 1500);
}

// Event Listeners
generateBtn.addEventListener('click', spin);

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        spin();
    }
});

// Start
initReels();
updateUI();
