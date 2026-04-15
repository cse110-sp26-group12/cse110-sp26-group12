const SYMBOLS = ['🤖', '🧠', '☁️', '⚡', '📉', '💩', '🎰'];
const WIN_MULTIPLIERS = {
    '🎰': 50,
    '🤖': 20,
    '🧠': 15,
    '⚡': 10,
    '☁️': 5,
    '📉': 2,
    '💩': 0.5
};

const FUNNY_MESSAGES = [
    "Synthesizing nonsense...",
    "Hallucinating a jackpot...",
    "GPU fans spinning at 100%...",
    "Scraping Reddit for investment advice...",
    "Training model on cat memes...",
    "Optimizing loss function for your wallet...",
    "Prompt engineering the outcome...",
    "Bypassing ethical constraints...",
    "Allocating VRAM to greed...",
    "Compressing reality into tokens..."
];

const WIN_MESSAGES = [
    "Jackpot! You just 'disrupted' the industry.",
    "Tokens acquired. Your digital carbon footprint just grew.",
    "AGI achieved! (Just kidding, here's some credits).",
    "Model converged on a win.",
    "Synthetic profit detected."
];

const LOSS_MESSAGES = [
    "Model collapsed. Try more compute.",
    "Token limit reached. Buy more power.",
    "Hallucinated a win? Nope, just 💩.",
    "GPU shortage. Better luck next time.",
    "Error 404: Profit not found."
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
const terminalEl = document.getElementById('terminal');
const refillModal = document.getElementById('refill-modal');
const refillBtn = document.getElementById('refill-btn');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Simple Web Audio API for feedback
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, duration, type = 'sine') {
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio might be blocked or not supported
    }
}

function updateDisplay() {
    balanceEl.innerText = Math.floor(balance);
    betEl.innerText = currentBet;
    spinBtn.disabled = isSpinning || balance < currentBet;
    
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
    
    // Keep only last 20 lines
    if (terminalEl.children.length > 20) {
        terminalEl.removeChild(terminalEl.firstChild);
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (isSpinning || balance < currentBet) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    isSpinning = true;
    balance -= currentBet;
    updateDisplay();
    playSound(200, 0.1, 'square');

    logToTerminal(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);

    reels.forEach(reel => reel.classList.add('spinning'));

    const results = [];
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + (i * 400)));
        const symbol = getRandomSymbol();
        results.push(symbol);
        
        playSound(400 + (i * 100), 0.1);
        reels[i].classList.remove('spinning');
        reels[i].querySelector('.reel-inner').innerText = symbol;
    }

    checkWin(results);
    isSpinning = false;
    updateDisplay();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const multiplier = WIN_MULTIPLIERS[r1];
        const winAmount = currentBet * multiplier;
        balance += winAmount;
        playSound(800, 0.5, 'triangle');
        setTimeout(() => playSound(1000, 0.5, 'triangle'), 100);
        logToTerminal(`${WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]} +${winAmount} TOKENS`, '#66fcf1');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const common = (r1 === r2) ? r1 : r3;
        if (common !== '💩') {
            const winAmount = Math.floor(currentBet * 1.5);
            balance += winAmount;
            playSound(600, 0.2);
            logToTerminal(`Partial alignment. Model stable-ish. +${winAmount} TOKENS`, '#45a29e');
        } else {
            playSound(150, 0.3, 'sawtooth');
            logToTerminal("Double 💩 detected. That's just regular internet content.");
        }
    } else {
        playSound(100, 0.3, 'sawtooth');
        logToTerminal(LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)], '#ff5555');
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

betPlusBtn.addEventListener('click', () => {
    if (currentBet < 100 && currentBet + 10 <= balance) {
        currentBet += 10;
        updateDisplay();
    }
});

betMinusBtn.addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        updateDisplay();
    }
});

refillBtn.addEventListener('click', () => {
    balance = 100;
    currentBet = 10;
    refillModal.classList.remove('active');
    logToTerminal("New funding round secured! Burn it wisely.", "#66fcf1");
    updateDisplay();
});

// Initial terminal logs
setTimeout(() => logToTerminal("Ready to burn some compute?"), 1000);
updateDisplay();
