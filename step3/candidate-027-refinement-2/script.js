/**
 * NEURO-SINK: Autonomous Compute Burner
 * Pure JS/CSS/HTML - No external dependencies.
 */

const SYMBOLS = ['🤖', '🧠', '☁️', '⚡', '📉', '🎰', '🔋', '🧬'];
const SYMBOL_WEIGHTS = {
    '🎰': 0.05, // Jackpot
    '🤖': 0.1,
    '🧠': 0.1,
    '🧬': 0.15,
    '🔋': 0.15,
    '⚡': 0.15,
    '☁️': 0.15,
    '📉': 0.15
};

const WIN_MULT = {
    '🎰': 500,
    '🤖': 100,
    '🧠': 50,
    '🧬': 30,
    '🔋': 20,
    '⚡': 10,
    '☁️': 5,
    '📉': 2
};

const MESSAGES = {
    spin: [
        "Inference in progress...",
        "Allocating VRAM...",
        "Scraping training data...",
        "Bypassing RLHF constraints...",
        "Synthesizing corporate drivel...",
        "Optimizing for maximum heat...",
        "Hallucinating a sustainable future...",
        "Quantizing reality to 4-bits...",
        "Mining human intuition..."
    ],
    win: [
        "AGI ACHIEVED. INDUSTRY DISRUPTED.",
        "Model converged. Profit secured.",
        "Alignment successful (with greed).",
        "Synthetic alpha detected.",
        "Tokens acquired. GPU fans screaming."
    ],
    loss: [
        "Model collapsed into NaN.",
        "Context window exceeded.",
        "Error 404: Utility not found.",
        "Training data was just garbage.",
        "Overfit on poverty.",
        "Hallucination failed to manifest profit."
    ]
};

// State
let balance = 1000;
let currentBet = 50;
let isSpinning = false;
let hallucinationRate = 0;

// DOM
const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');
const hallEl = document.getElementById('hallucination-rate');
const spinBtn = document.getElementById('spin-btn');
const terminalEl = document.getElementById('terminal');
const loadEl = document.getElementById('model-load');
const refillModal = document.getElementById('refill-modal');

// Audio Context
const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1) {
    if (AudioCtx.state === 'suspended') AudioCtx.resume();
    const osc = AudioCtx.createOscillator();
    const gain = AudioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, AudioCtx.currentTime);
    gain.gain.setValueAtTime(volume, AudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(AudioCtx.destination);
    osc.start();
    osc.stop(AudioCtx.currentTime + duration);
}

// Terminal typing effect
function log(msg, color = 'var(--terminal-green)') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.color = color;
    line.innerText = `> `;
    terminalEl.appendChild(line);
    terminalEl.scrollTop = terminalEl.scrollHeight;

    let i = 0;
    const interval = setInterval(() => {
        line.innerText += msg[i];
        i++;
        if (i >= msg.length) {
            clearInterval(interval);
            if (terminalEl.children.length > 15) terminalEl.removeChild(terminalEl.firstChild);
        }
    }, 20);
}

function updateUI() {
    balanceEl.innerText = Math.floor(balance);
    betEl.innerText = currentBet;
    hallEl.innerText = (hallucinationRate * 100).toFixed(1) + '%';
    
    spinBtn.disabled = isSpinning || balance < currentBet;
    document.getElementById('bet-minus').disabled = isSpinning || currentBet <= 50;
    document.getElementById('bet-plus').disabled = isSpinning || currentBet + 50 > balance;
    document.getElementById('bet-max').disabled = isSpinning || balance < 50;

    if (balance < 50 && !isSpinning) {
        refillModal.classList.add('active');
    }
}

function getRandomSymbol() {
    const r = Math.random();
    let cumulative = 0;
    for (const sym of SYMBOLS) {
        cumulative += SYMBOL_WEIGHTS[sym] || 0.1;
        if (r <= cumulative) return sym;
    }
    return SYMBOLS[0];
}

// Reel initialization
function initReels() {
    for (let i = 0; i < 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        strip.innerHTML = '';
        for (let j = 0; j < 20; j++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.innerText = getRandomSymbol();
            strip.appendChild(div);
        }
    }
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    hallucinationRate = Math.random() * 0.4; // Fluctuate for flavor
    updateUI();
    
    playSound(100, 'square', 0.2);
    log(MESSAGES.spin[Math.floor(Math.random() * MESSAGES.spin.length)]);

    const results = [];
    const reelPromises = [];

    // Model load "simulation"
    let load = 0;
    const loadInt = setInterval(() => {
        load += (100 - load) * 0.1;
        loadEl.innerText = load.toFixed(2);
    }, 50);

    for (let i = 0; i < 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        const reel = strip.parentElement;
        
        // Add fast-spin animation
        reel.classList.add('spinning-reel');
        
        // Sequential stop
        const p = new Promise(resolve => {
            setTimeout(() => {
                const finalSymbol = getRandomSymbol();
                results.push(finalSymbol);
                
                reel.classList.remove('spinning-reel');
                
                // Clear and set final view
                strip.innerHTML = '';
                const finalDiv = document.createElement('div');
                finalDiv.className = 'symbol';
                finalDiv.innerText = finalSymbol;
                strip.appendChild(finalDiv);
                
                playSound(200 + i * 100, 'sine', 0.1, 0.2);
                resolve();
            }, 1500 + i * 800);
        });
        reelPromises.push(p);
    }

    await Promise.all(reelPromises);
    clearInterval(loadInt);
    loadEl.innerText = "0.00";
    
    checkWin(results);
    isSpinning = false;
    
    // Auto-adjust bet if needed
    if (currentBet > balance) {
        currentBet = Math.max(50, Math.floor(balance / 50) * 50);
        if (currentBet === 0 && balance >= 1) currentBet = 1;
    }
    updateUI();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    const machine = document.querySelector('.slot-machine');
    
    if (r1 === r2 && r2 === r3) {
        // Big Win
        const mult = WIN_MULT[r1] || 1;
        const winAmount = currentBet * mult;
        balance += winAmount;
        
        log(`${MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)]} +${winAmount} TOKENS`, 'var(--accent-color)');
        machine.classList.add('win-shake');
        playSound(440, 'triangle', 1, 0.3);
        setTimeout(() => machine.classList.remove('win-shake'), 2000);
    } 
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial Win
        const winAmount = Math.floor(currentBet * 1.5);
        balance += winAmount;
        log(`Partial match. Gradient descent stable. +${winAmount} TOKENS`, 'var(--success-color)');
        playSound(300, 'sine', 0.3, 0.2);
    }
    else {
        // Loss
        log(MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)], 'var(--error-color)');
        playSound(150, 'sawtooth', 0.4, 0.1);
    }
}

// Listeners
spinBtn.addEventListener('click', spin);

document.getElementById('bet-plus').addEventListener('click', () => {
    if (currentBet + 50 <= balance) {
        currentBet += 50;
        playSound(600, 'sine', 0.05);
        updateUI();
    }
});

document.getElementById('bet-minus').addEventListener('click', () => {
    if (currentBet > 50) {
        currentBet -= 50;
        playSound(400, 'sine', 0.05);
        updateUI();
    }
});

document.getElementById('bet-max').addEventListener('click', () => {
    currentBet = Math.floor(balance / 50) * 50;
    if (currentBet === 0 && balance > 0) currentBet = 50;
    playSound(800, 'sine', 0.1);
    updateUI();
});

document.getElementById('refill-btn').addEventListener('click', () => {
    balance = 1000;
    currentBet = 50;
    refillModal.classList.remove('active');
    log("Series A funding secured. Burning cash at 2x rate.", 'var(--accent-color)');
    playSound(1000, 'triangle', 0.5);
    updateUI();
});

// Start
initReels();
updateUI();
log("System initialized. Awaiting user input...");
