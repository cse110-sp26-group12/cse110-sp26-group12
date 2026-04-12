const SYMBOLS = [
    { icon: '💸', name: 'VC_FUNDING', weight: 1, payout: 50 },
    { icon: '⚡', name: 'GPU_CLUSTER', weight: 3, payout: 20 },
    { icon: '☁️', name: 'THE_CLOUD', weight: 5, payout: 10 },
    { icon: '🤖', name: 'STOCHASTIC_PARROT', weight: 8, payout: 5 },
    { icon: '🫠', name: 'HALLUCINATION', weight: 4, payout: 2 }
];

const SNARKY_MESSAGES = {
    spin: [
        "Tokenizing your life savings...",
        "Executing prompt: 'Give me a jackpot'...",
        "Optimizing loss function...",
        "Scaling compute clusters...",
        "Consulting the oracle (random.js)..."
    ],
    win: [
        "VC Funding secured! Scaling indefinitely.",
        "Emergent behavior detected: You actually won.",
        "Model weights adjusted in your favor.",
        "AGI achieved! (Just kidding, here's some tokens).",
        "Hallucinating a profitable quarter..."
    ],
    loss: [
        "Reinforcement Learning from Human Failure (RLHF) complete.",
        "Model collapsed. Try more data (tokens).",
        "Prompt rejected by safety filters (and physics).",
        "Your contribution to the GPU fund is appreciated.",
        "Dataset insufficient. Need more tokens."
    ],
    bet: [
        "Increasing compute budget. Bold move.",
        "Budget cut. Efficiency is key.",
        "Burn rate increased."
    ]
};

// Game State
let balance = 1000;
let currentBet = 50;
let isSpinning = false;
let reelOffsets = [0, 0, 0];

// DOM Elements
const balanceEl = document.getElementById('balance');
const betDisplayEl = document.getElementById('bet-display');
const currentBetLabelEl = document.getElementById('current-bet-label');
const spinButton = document.getElementById('spin-button');
const consoleOutput = document.getElementById('console-output');
const betUpBtn = document.getElementById('bet-up');
const betDownBtn = document.getElementById('bet-down');

// Initialize Reels
const reels = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

function init() {
    reels.forEach(reel => {
        populateReel(reel);
    });
    updateUI();
}

function populateReel(reelEl) {
    // Create a long strip of symbols for the illusion of spinning
    const symbolPool = [];
    SYMBOLS.forEach(s => {
        for (let i = 0; i < s.weight; i++) symbolPool.push(s.icon);
    });

    // Shuffle pool
    const shuffled = [...symbolPool].sort(() => Math.random() - 0.5);
    
    // Add 40 symbols to the strip
    for (let i = 0; i < 40; i++) {
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = shuffled[i % shuffled.length];
        reelEl.appendChild(div);
    }
}

function updateUI() {
    balanceEl.textContent = Math.floor(balance);
    betDisplayEl.textContent = currentBet;
    currentBetLabelEl.textContent = `BET ${currentBet}`;
    spinButton.disabled = isSpinning || balance < currentBet;
}

function logToConsole(message, type = 'info') {
    const line = document.createElement('div');
    line.innerHTML = `> ${message}`;
    if (type === 'win') line.style.color = 'var(--neon-lime)';
    if (type === 'loss') line.style.color = 'var(--neon-pink)';
    
    consoleOutput.prepend(line);
    
    // Limit console lines
    if (consoleOutput.children.length > 20) {
        consoleOutput.lastElementChild.remove();
    }
}

function getRandomQuip(category) {
    const quips = SNARKY_MESSAGES[category];
    return quips[Math.floor(Math.random() * quips.length)];
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    updateUI();

    logToConsole(getRandomQuip('spin'));

    const results = [];
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const symbolIndex = Math.floor(Math.random() * SYMBOLS.length);
            const targetSymbol = SYMBOLS[symbolIndex];
            results.push(targetSymbol);

            // Calculate a stop position that is further than current offset
            const minSymbolsToSpin = 20;
            const stopAt = minSymbolsToSpin + Math.floor(Math.random() * 10);
            
            const currentSymbolIndex = Math.round(reelOffsets[index] / 150);
            const targetIndexInStrip = (currentSymbolIndex + stopAt) % 40;
            
            reel.children[targetIndexInStrip].textContent = targetSymbol.icon;

            const targetOffset = (currentSymbolIndex + stopAt) * 150;
            
            reel.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = `translateY(-${targetOffset}px)`;

            setTimeout(() => {
                reelOffsets[index] = targetOffset;
                
                // If we've gone too far down the strip, reset to the equivalent top position
                if (reelOffsets[index] > 4500) {
                    const resetIndex = targetIndexInStrip;
                    const resetOffset = resetIndex * 150;
                    reelOffsets[index] = resetOffset;
                    
                    reel.style.transition = 'none';
                    reel.style.transform = `translateY(-${resetOffset}px)`;
                }
                resolve();
            }, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1.icon === s2.icon && s2.icon === s3.icon) {
        const winAmount = currentBet * s1.payout;
        balance += winAmount;
        logToConsole(`JACKPOT! ${s1.name} matched. +${winAmount} tokens.`, 'win');
        logToConsole(getRandomQuip('win'), 'win');
    } else if (s1.icon === s2.icon || s2.icon === s3.icon || s1.icon === s3.icon) {
        balance += currentBet;
        logToConsole(`Partial match. Data noise filtered. Bet recovered.`, 'info');
    } else {
        logToConsole(getRandomQuip('loss'), 'loss');
    }
}

// Event Listeners
spinButton.addEventListener('click', () => {
    spin();
});

betUpBtn.addEventListener('click', () => {
    if (currentBet < 500) {
        currentBet += 50;
        logToConsole(getRandomQuip('bet'));
        updateUI();
    }
});

betDownBtn.addEventListener('click', () => {
    if (currentBet > 50) {
        currentBet -= 50;
        logToConsole(getRandomQuip('bet'));
        updateUI();
    }
});

// Start the app
init();
