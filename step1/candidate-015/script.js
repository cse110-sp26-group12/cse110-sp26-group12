const SYMBOLS = [
    { char: '🤖', name: 'AGI', value: 100 },
    { char: '🧠', name: 'Neural Net', value: 50 },
    { char: '🎨', name: 'Gen-AI', value: 20 },
    { char: '🤡', name: 'Prompt Eng', value: 5 },
    { char: '💬', name: 'Hallucination', value: 0 }
];

const SATIRE_PHRASES = {
    start: [
        "Initializing hyper-parameters...",
        "Scraping Reddit for training data...",
        "Rerouting VC capital to GPU clusters...",
        "Optimizing the objective function..."
    ],
    win: [
        "Found a global minimum! Tokens granted.",
        "Emergent behavior detected: Profit.",
        "Overfitting successful. Capital gains confirmed.",
        "Model converged. Payout calculated."
    ],
    loss: [
        "Trapped in a local minimum. Sad.",
        "Vanishing gradient problem. No tokens.",
        "Loss function exploded. Capital depleted.",
        "Input was out of distribution."
    ],
    hallucination: [
        "Reality is a hallucination. Wait...",
        "Data poisoning detected. Reels rerouted.",
        "I am a stochastic parrot. Squawk!",
        "Stochasticity is the spice of life."
    ]
};

let balance = 100;
let isSpinning = false;

const spinBtn = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('balance');
const logWindow = document.getElementById('satire-log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const gpuTempDisplay = document.getElementById('gpu-temp');

// GPU Temp simulation
setInterval(() => {
    const baseTemp = isSpinning ? 75 : 42;
    const flicker = Math.floor(Math.random() * 5);
    gpuTempDisplay.textContent = `${baseTemp + flicker}°C`;
    if (baseTemp + flicker > 78) {
        gpuTempDisplay.style.color = '#ef4444';
    } else {
        gpuTempDisplay.style.color = 'inherit';
    }
}, 1000);

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = ''; // Clear
        // Add many symbols for the "scrolling" effect
        // We'll add 60 symbols, and the last few will be our "landing zone"
        for (let i = 0; i < 60; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.innerHTML = `<span>${symbol.char}</span><span class="symbol-name">${symbol.name}</span>`;
            reel.appendChild(div);
        }
    });
}

function updateLog(text, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${text}`;
    logWindow.prepend(entry);
}

function getRandomPhrase(category) {
    const phrases = SATIRE_PHRASES[category];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

async function spin() {
    if (isSpinning) return;
    
    if (balance < 1) {
        updateLog("Out of compute. Raising Series B... (Resetting)", "info");
        balance = 100;
        balanceDisplay.textContent = balance;
        return;
    }

    isSpinning = true;
    balance -= 1;
    balanceDisplay.textContent = balance;
    spinBtn.disabled = true;

    updateLog(getRandomPhrase('start'), 'info');

    const results = [];
    const reelAnimations = reels.map((reel, index) => {
        const symbolHeight = 120;
        const totalSymbols = reel.children.length;
        
        // Pick a random symbol from the pool to land on
        const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
        const targetSymbol = SYMBOLS[randomIndex];
        results.push(targetSymbol);

        // Update the very last symbol in the reel to be our target
        const lastSymbolDiv = reel.children[totalSymbols - 1];
        lastSymbolDiv.innerHTML = `<span>${targetSymbol.char}</span><span class="symbol-name">${targetSymbol.name}</span>`;

        // Reset position to top instantly
        reel.style.transition = 'none';
        reel.style.transform = `translateY(0)`;
        
        // Force reflow
        reel.offsetHeight;

        // Animate to the last symbol
        const targetPos = (totalSymbols - 1) * symbolHeight;
        reel.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.15, 0, 0.15, 1)`;
        reel.style.transform = `translateY(-${targetPos}px)`;

        return new Promise(resolve => setTimeout(resolve, (2 + index * 0.5) * 1000));
    });

    await Promise.all(reelAnimations);

    evaluateResult(results);
    isSpinning = false;
    spinBtn.disabled = false;
}

function evaluateResult(results) {
    const [s1, s2, s3] = results;
    
    // Check for "Hallucination" (Special logic)
    if (s1.name === 'Hallucination' || s2.name === 'Hallucination' || s3.name === 'Hallucination') {
        updateLog(getRandomPhrase('hallucination'), 'info');
    }

    if (s1.name === s2.name && s2.name === s3.name) {
        // Jackpot
        const winAmount = s1.value * 2;
        balance += winAmount;
        updateLog(`JACKPOT! ${getRandomPhrase('win')} +${winAmount} tokens.`, 'win');
        document.querySelector('.reels-container').classList.add('winning-reels');
        setTimeout(() => {
            document.querySelector('.reels-container').classList.remove('winning-reels');
        }, 2000);
    } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
        // Mini win
        const winningSymbol = (s1.name === s2.name) ? s1 : (s2.name === s3.name ? s2 : s1);
        const winAmount = winningSymbol.value;
        balance += winAmount;
        updateLog(`Convergence! ${getRandomPhrase('win')} +${winAmount} tokens.`, 'win');
    } else {
        updateLog(getRandomPhrase('loss'), 'loss');
    }

    balanceDisplay.textContent = balance;
}

spinBtn.addEventListener('click', spin);
initReels();
updateLog("System online. VC funding secured.");
