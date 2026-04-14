/**
 * NEURO-SINK: Autonomous Compute Burner
 * Pure JS/CSS/HTML Refinement v0.5.0
 */

// --- Constants & Config ---
const SYMBOLS = ['🤖', '🧠', '☁️', '⚡', '📉', '🎰', '🔋', '🧬'];
const SYMBOL_WEIGHTS = {
    '🎰': 0.04, // Jackpot
    '🤖': 0.08,
    '🧠': 0.10,
    '🧬': 0.12,
    '🔋': 0.14,
    '⚡': 0.16,
    '☁️': 0.18,
    '📉': 0.18
};

const WIN_MULT = {
    '🎰': 250,
    '🤖': 80,
    '🧠': 40,
    '🧬': 25,
    '🔋': 15,
    '⚡': 10,
    '☁️': 5,
    '📉': 2
};

const MESSAGES = {
    spin: [
        "Inference in progress...", "Allocating VRAM...", "Scraping training data...",
        "Bypassing RLHF...", "Synthesizing corporate drivel...", "Quantizing reality...",
        "Mining human intuition...", "Encoding biases...", "Distilling silicon dreams..."
    ],
    win: [
        "AGI ACHIEVED. INDUSTRY DISRUPTED.", "Model converged. Profit secured.",
        "Alignment successful (with greed).", "Synthetic alpha detected.",
        "Tokens acquired. GPU fans screaming."
    ],
    loss: [
        "Model collapsed into NaN.", "Context window exceeded.", "Error 404: Utility not found.",
        "Training data was just garbage.", "Overfit on poverty.", "Gradient explosion detected."
    ]
};

// --- State ---
let balance = 1000;
let currentBet = 50;
let isSpinning = false;
let isAutoSpinning = false;
let hallucinationRate = 0;
let gpuTemp = 32;

// --- DOM Elements ---
const el = {
    balance: document.getElementById('balance'),
    bet: document.getElementById('bet'),
    hall: document.getElementById('hallucination-rate'),
    temp: document.getElementById('gpu-temp'),
    load: document.getElementById('model-load'),
    spinBtn: document.getElementById('spin-btn'),
    autoBtn: document.getElementById('auto-btn'),
    autoStatus: document.getElementById('auto-status'),
    terminal: document.getElementById('terminal'),
    winDisplay: document.getElementById('win-display'),
    refillModal: document.getElementById('refill-modal'),
    onboarding: document.getElementById('onboarding'),
    machine: document.getElementById('machine')
};

// --- Audio Engine ---
const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.1, volume = 0.1) {
    try {
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
    } catch (e) { /* Audio fails silently if blocked */ }
}

// --- Logic & UI Updates ---

function log(msg, color = 'var(--terminal-green)') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.color = color;
    line.innerText = `> ${msg}`;
    el.terminal.appendChild(line);
    el.terminal.scrollTop = el.terminal.scrollHeight;
    
    // Cleanup old lines
    if (el.terminal.children.length > 20) el.terminal.removeChild(el.terminal.firstChild);
}

function updateUI() {
    el.balance.innerText = Math.floor(balance);
    el.bet.innerText = currentBet;
    el.hall.innerText = (hallucinationRate * 100).toFixed(1) + '%';
    el.temp.innerText = Math.floor(gpuTemp);
    
    const canAfford = balance >= currentBet;
    el.spinBtn.disabled = isSpinning || !canAfford;
    el.autoBtn.disabled = !canAfford && !isAutoSpinning;
    
    document.getElementById('bet-minus').disabled = isSpinning || isAutoSpinning || currentBet <= 50;
    document.getElementById('bet-plus').disabled = isSpinning || isAutoSpinning || currentBet + 50 > balance;
    document.getElementById('bet-max').disabled = isSpinning || isAutoSpinning || balance < 50;

    if (balance < 50 && !isSpinning && !isAutoSpinning) {
        el.refillModal.classList.add('active');
    }

    if (isAutoSpinning) {
        el.autoBtn.classList.add('active');
        el.autoStatus.style.display = 'block';
    } else {
        el.autoBtn.classList.remove('active');
        el.autoStatus.style.display = 'none';
    }
}

function getRandomSymbol() {
    const r = Math.random();
    let cumulative = 0;
    for (const sym of SYMBOLS) {
        cumulative += SYMBOL_WEIGHTS[sym];
        if (r <= cumulative) return sym;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function initReels() {
    for (let i = 0; i < 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        strip.innerHTML = '';
        // Add 3 symbols for the initial view
        for (let j = 0; j < 3; j++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.innerText = getRandomSymbol();
            strip.appendChild(div);
        }
    }
}

async function spin() {
    if (isSpinning || balance < currentBet) {
        isAutoSpinning = false;
        updateUI();
        return;
    }

    isSpinning = true;
    balance -= currentBet;
    hallucinationRate = Math.random() * 0.5;
    gpuTemp = 40 + (currentBet / 10) + (Math.random() * 10);
    updateUI();
    
    playSound(80, 'square', 0.1, 0.05);
    log(MESSAGES.spin[Math.floor(Math.random() * MESSAGES.spin.length)]);

    const results = [];
    const reelPromises = [];

    // Model load simulation
    let load = 0;
    const loadInt = setInterval(() => {
        load += (99 - load) * 0.2;
        el.load.innerText = load.toFixed(2);
    }, 100);

    for (let i = 0; i < 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        strip.parentElement.classList.add('reel-spinning');
        
        const p = new Promise(resolve => {
            setTimeout(() => {
                const finalSymbol = getRandomSymbol();
                results.push(finalSymbol);
                
                strip.parentElement.classList.remove('reel-spinning');
                
                // Show final symbol in middle (clean up strip)
                strip.innerHTML = '';
                // Add padding symbols for visual consistency
                strip.appendChild(createSymbolDiv(getRandomSymbol()));
                const mainSym = createSymbolDiv(finalSymbol);
                strip.appendChild(mainSym);
                strip.appendChild(createSymbolDiv(getRandomSymbol()));
                
                // Position the main symbol in the center
                strip.style.transform = 'translateY(-160px)';
                
                playSound(150 + i * 50, 'sine', 0.1, 0.15);
                resolve();
            }, 800 + i * 600);
        });
        reelPromises.push(p);
    }

    await Promise.all(reelPromises);
    clearInterval(loadInt);
    el.load.innerText = "0.00";
    gpuTemp = Math.max(32, gpuTemp - 10);
    
    await checkWin(results);
    
    isSpinning = false;
    updateUI();

    if (isAutoSpinning) {
        setTimeout(spin, 1000);
    }
}

function createSymbolDiv(text) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.innerText = text;
    return div;
}

async function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const mult = WIN_MULT[r1] || 1;
        const winAmount = currentBet * mult;
        balance += winAmount;
        
        showWinDisplay(`JACKPOT: +${winAmount}`);
        log(`${MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)]} +${winAmount} TOKENS`, 'var(--accent-color)');
        
        el.machine.classList.add('win-shake');
        playSound(440, 'square', 0.5, 0.2);
        setTimeout(() => playSound(660, 'square', 0.5, 0.2), 100);
        
        return new Promise(r => setTimeout(() => {
            el.machine.classList.remove('win-shake');
            r();
        }, 2000));
    } 
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const winAmount = Math.floor(currentBet * 1.2);
        balance += winAmount;
        showWinDisplay(`MATCH: +${winAmount}`);
        log(`Gradient descent stable. +${winAmount} TOKENS`, 'var(--success-color)');
        playSound(300, 'sine', 0.3, 0.1);
        return new Promise(r => setTimeout(r, 800));
    }
    else {
        log(MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)], 'var(--error-color)');
        playSound(100, 'sawtooth', 0.3, 0.05);
        return Promise.resolve();
    }
}

function showWinDisplay(text) {
    el.winDisplay.innerText = text;
    el.winDisplay.classList.add('active');
    setTimeout(() => el.winDisplay.classList.remove('active'), 1500);
}

// --- Event Listeners ---

el.spinBtn.addEventListener('click', () => {
    isAutoSpinning = false;
    spin();
});

el.autoBtn.addEventListener('click', () => {
    isAutoSpinning = !isAutoSpinning;
    if (isAutoSpinning && !isSpinning) spin();
    updateUI();
});

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
    if (currentBet === 0 && balance >= 50) currentBet = 50;
    playSound(800, 'sine', 0.1);
    updateUI();
});

document.getElementById('start-btn').addEventListener('click', () => {
    el.onboarding.classList.remove('active');
    playSound(1000, 'sine', 0.5, 0.1);
    log("Terminal authorized. Happy burning.");
});

document.getElementById('refill-btn').addEventListener('click', () => {
    balance = 1000;
    currentBet = 50;
    el.refillModal.classList.remove('active');
    log("Series A funding secured. Inflation imminent.", 'var(--accent-color)');
    playSound(800, 'triangle', 0.4);
    updateUI();
});

// --- Initialization ---
initReels();
updateUI();
log("System initialized. Context window ready.");
