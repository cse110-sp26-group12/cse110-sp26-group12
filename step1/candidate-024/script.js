const SYMBOLS = [
    { name: 'AGI', icon: '🧠', value: 100 },
    { name: 'GPU', icon: '📟', value: 50 },
    { name: 'Python', icon: '🐍', value: 20 },
    { name: 'Paperclip', icon: '📎', value: 10 },
    { name: 'Bug', icon: '🐛', value: 5 },
    { name: 'Hallucination', icon: '🌫️', value: 0 }
];

const LOG_MESSAGES = [
    "Loss function converging... slowly.",
    "Hallucinating a jackpot... wait, no.",
    "Overfitting to player psychology.",
    "Backpropagating through time (and your wallet).",
    "Stochastic gradient descent hit a local minimum.",
    "Warning: Temperature setting too high.",
    "Allocating VRAM for useless tasks.",
    "Transformer layers fully saturated.",
    "LLM refusing to answer due to 'safety' guidelines.",
    "RLHFing your credits away.",
    "Merging weights with sheer luck.",
    "Token limit reached. Please insert more compute."
];

let credits = 1000;
let isSpinning = false;

const creditsEl = document.getElementById('credits');
const lossEl = document.getElementById('loss');
const logsContainer = document.getElementById('logs');
const spinBtn = document.getElementById('spin-btn');
const betSelect = document.getElementById('bet-amount');
const winLine = document.querySelector('.win-line');

// Initialize reels
function initReels() {
    for (let i = 1; i <= 3; i++) {
        const strip = document.getElementById(`strip-${i}`);
        // Add many symbols for the "spin" effect
        for (let j = 0; j < 30; j++) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = `symbol sym-${sym.name}`;
            div.textContent = sym.icon;
            strip.appendChild(div);
        }
    }
}

function addLog(msg) {
    const log = document.createElement('div');
    log.className = 'log-entry';
    log.textContent = `> ${msg}`;
    logsContainer.prepend(log);
    if (logsContainer.children.length > 20) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

async function spin() {
    if (isSpinning) return;
    
    const bet = parseInt(betSelect.value);
    if (credits < bet) {
        addLog("CRITICAL ERROR: Insufficient compute credits.");
        return;
    }

    credits -= bet;
    updateUI();
    isSpinning = true;
    spinBtn.disabled = true;
    winLine.classList.remove('active');
    addLog(`Optimizing model with batch size ${bet}...`);

    const results = [];
    const reels = [1, 2, 3];
    
    const animations = reels.map(async (id, index) => {
        const strip = document.getElementById(`strip-${id}`);
        const finalSymIndex = Math.floor(Math.random() * SYMBOLS.length);
        results.push(SYMBOLS[finalSymIndex]);

        // Reset position without transition
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        
        // Wait a bit for the reset to take effect
        await new Promise(r => setTimeout(r, 50));

        // Animate to final position
        // We want the final symbol to be at index 27, 28, or 29 to show movement
        const targetOffset = (25 + finalSymIndex) * 130; 
        strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        strip.style.transform = `translateY(-${targetOffset}px)`;

        return new Promise(r => setTimeout(r, (2 + index * 0.5) * 1000));
    });

    await Promise.all(animations);
    
    checkWin(results, bet);
    isSpinning = false;
    spinBtn.disabled = false;
}

function checkWin(results, bet) {
    const uniqueSymbols = new Set(results.map(r => r.name));
    
    if (uniqueSymbols.size === 1) {
        const winSym = results[0];
        const multiplier = winSym.value;
        const prize = bet * multiplier;
        credits += prize;
        addLog(`SUCCESS: Global minimum found! Jackpot: ${prize} Credits.`);
        winLine.classList.add('active');
        lossEl.textContent = "0.0000";
    } else if (uniqueSymbols.size === 2) {
        // Find the symbol that repeated
        const counts = {};
        results.forEach(r => counts[r.name] = (counts[r.name] || 0) + 1);
        const pairSymName = Object.keys(counts).find(name => counts[name] === 2);
        const pairSym = SYMBOLS.find(s => s.name === pairSymName);
        
        const prize = bet * (pairSym.value / 2);
        credits += prize;
        addLog(`Partial convergence: Yielded ${prize} Credits.`);
        lossEl.textContent = (Math.random() * 0.5).toFixed(4);
    } else {
        addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
        lossEl.textContent = (0.5 + Math.random() * 0.5).toFixed(4);
    }

    updateUI();
}

function updateUI() {
    creditsEl.textContent = credits;
}

spinBtn.addEventListener('click', spin);

// Initialize
initReels();
updateUI();
addLog("Neural network weights randomized.");
