const SYMBOLS = ['🤖', '🧠', '☁️', '⚡', '📉', '💩', '🎰'];
const WIN_MULTIPLIERS = {
    '🎰': 100,
    '🤖': 40,
    '🧠': 25,
    '⚡': 15,
    '☁️': 10,
    '📉': 5,
    '💩': 1
};

const FUNNY_MESSAGES = [
    "Synthesizing nonsense...",
    "Hallucinating a jackpot...",
    "GPU fans spinning at 100%...",
    "Scraping Reddit for advice...",
    "Training model on cat memes...",
    "Optimizing loss for your wallet...",
    "Prompt engineering the outcome...",
    "Bypassing ethical constraints...",
    "Allocating VRAM to greed...",
    "Compressing reality...",
    "Updating terms of service...",
    "Mining bio-tokens..."
];

const WIN_MESSAGES = [
    "Jackpot! Industry disrupted.",
    "Tokens acquired. Carbon footprint++.",
    "AGI achieved! (Not really).",
    "Model converged on profit.",
    "Synthetic alpha detected."
];

const LOSS_MESSAGES = [
    "Model collapsed. Needs more RAM.",
    "Token limit reached. Pay up.",
    "Hallucinated a win? Nope.",
    "GPU shortage. Try later.",
    "Error 404: Profit not found.",
    "Overfit on poverty."
];

let balance = 100;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');
const spinBtn = document.getElementById('spin-btn');
const betPlusBtn = document.getElementById('bet-plus');
const betMinusBtn = document.getElementById('bet-minus');
const betMaxBtn = document.getElementById('bet-max');
const terminalEl = document.getElementById('terminal');
const refillModal = document.getElementById('refill-modal');
const refillBtn = document.getElementById('refill-btn');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Audio Setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, duration, type = 'sine', volume = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function updateDisplay() {
    balanceEl.innerText = Math.floor(balance);
    betEl.innerText = currentBet;
    
    const canAfford = balance >= currentBet;
    spinBtn.disabled = isSpinning || !canAfford;
    betPlusBtn.disabled = isSpinning || balance < currentBet + 10;
    betMinusBtn.disabled = isSpinning || currentBet <= 10;
    betMaxBtn.disabled = isSpinning || balance < 10;

    if (balance < 10 && !isSpinning) {
        refillModal.classList.add('active');
    }
}

function logToTerminal(msg, color = '#33ff33') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.color = color;
    line.innerText = `> ${msg}`;
    terminalEl.appendChild(line);
    terminalEl.scrollTop = terminalEl.scrollHeight;
    if (terminalEl.children.length > 20) terminalEl.removeChild(terminalEl.firstChild);
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    updateDisplay();
    playSound(150, 0.1, 'square');
    logToTerminal(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);

    const results = [];
    const reelStrips = reelElements.map(el => el.querySelector('.reel-strip'));
    
    reelElements.forEach(el => el.classList.add('spinning'));

    for (let i = 0; i < 3; i++) {
        // Wait for specific duration per reel
        await new Promise(resolve => setTimeout(resolve, 1000 + i * 500));
        
        const symbol = getRandomSymbol();
        results.push(symbol);
        
        reelElements[i].classList.remove('spinning');
        // Set the final symbol in the strip
        const symbolEl = reelStrips[i].querySelector('.symbol');
        symbolEl.innerText = symbol;
        
        playSound(300 + i * 100, 0.15);
    }

    checkWin(results);
    isSpinning = false;
    // Auto-adjust bet if balance is now lower than current bet
    if (balance < currentBet) {
        currentBet = Math.max(10, Math.floor(balance / 10) * 10);
        if (currentBet === 0 && balance >= 1) currentBet = 1; // Fallback
    }
    updateDisplay();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let winMsg = "";
    let winColor = "#66fcf1";

    if (r1 === r2 && r2 === r3) {
        // Big Win
        const mult = WIN_MULTIPLIERS[r1] || 1;
        winAmount = currentBet * mult;
        winMsg = `${WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]} +${winAmount} TOKENS`;
        playSound(600, 0.6, 'triangle', 0.2);
        document.querySelector('.slot-machine').classList.add('win-pulse');
        setTimeout(() => document.querySelector('.slot-machine').classList.remove('win-pulse'), 1000);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small Win (Partial alignment)
        const common = (r1 === r2 || r1 === r3) ? r1 : r2;
        if (common !== '💩') {
            winAmount = Math.floor(currentBet * 2);
            winMsg = `Partial alignment. Model stable. +${winAmount} TOKENS`;
            winColor = "#45a29e";
            playSound(400, 0.3);
        } else {
            winMsg = "Double 💩. That's just a regular social media feed.";
            winColor = "#8b4513";
            playSound(100, 0.3, 'sawtooth');
        }
    } else {
        // Loss
        winMsg = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
        winColor = "#ff5555";
        playSound(80, 0.4, 'sawtooth');
    }

    if (winAmount > 0) {
        balance += winAmount;
        logToTerminal(winMsg, winColor);
    } else {
        logToTerminal(winMsg, winColor);
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

betPlusBtn.addEventListener('click', () => {
    if (currentBet + 10 <= balance) {
        currentBet += 10;
        playSound(440, 0.05);
        updateDisplay();
    }
});

betMinusBtn.addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        playSound(330, 0.05);
        updateDisplay();
    }
});

betMaxBtn.addEventListener('click', () => {
    // Set bet to max multiple of 10 within balance
    currentBet = Math.floor(balance / 10) * 10;
    if (currentBet === 0 && balance > 0) currentBet = 10; // Or whatever minimum
    playSound(550, 0.1);
    updateDisplay();
});

refillBtn.addEventListener('click', () => {
    balance = 100;
    currentBet = 10;
    refillModal.classList.remove('active');
    logToTerminal("Seed round secured. Don't waste it on 'ethics'.", "#66fcf1");
    playSound(880, 0.2);
    updateDisplay();
});

// Init
logToTerminal("Awaiting user prompt...");
updateDisplay();
