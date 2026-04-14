const symbols = ['🤖', '🧠', '🪄', '💥', '💰', '⚡', '🛸'];
const winMessages = [
    "AGI ACHIEVED! +{tokens} Tokens",
    "VC SEED ROUND CLOSED! +{tokens} Tokens",
    "PROMPT OPTIMIZED! +{tokens} Tokens",
    "MODEL COMPRESSION SUCCESS! +{tokens} Tokens",
    "HYPE TRAIN DEPARTING! +{tokens} Tokens"
];
const lossMessages = [
    "HALLUCINATION! -{tokens} Tokens",
    "GPU OVERHEATED! -{tokens} Tokens",
    "TOKEN LIMIT REACHED! -{tokens} Tokens",
    "MODEL COLLAPSED! -{tokens} Tokens",
    "SUBSCRIPTION EXPIRED! -{tokens} Tokens"
];

let tokens = 1000;
let currentBet = 100;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const betDisplay = document.getElementById('current-bet');
const spinBtn = document.getElementById('spin-btn');
const statusMsg = document.getElementById('status-message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const betBtns = document.querySelectorAll('.bet-btn');

// Initialize
function init() {
    reels.forEach(reel => {
        const content = reel.querySelector('.reel-content');
        content.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const div = document.createElement('div');
            div.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            content.appendChild(div);
        }
    });
    updateDisplay();
    setupEventListeners();
}

function setupEventListeners() {
    spinBtn.addEventListener('click', spin);

    betBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isSpinning) return;
            currentBet = parseInt(btn.dataset.amount);
            betBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            betDisplay.textContent = currentBet;
        });
    });
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    betDisplay.textContent = currentBet;
    spinBtn.disabled = tokens < currentBet || isSpinning;
}

async function spin() {
    if (isSpinning || tokens < currentBet) return;

    isSpinning = true;
    tokens -= currentBet;
    updateDisplay();

    statusMsg.textContent = "Generating...";
    statusMsg.className = "status-message";

    // Add spinning class
    reels.forEach(reel => reel.classList.add('spinning'));

    // Randomize results
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop reels one by one
    for (let i = 0; i < reels.length; i++) {
        reels[i].classList.remove('spinning');
        reels[i].querySelector('.reel-content').textContent = results[i];
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    checkWin(results);
    isSpinning = false;
    updateDisplay();
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        // Big win: 3 of a kind
        let winAmount = currentBet * 10;
        if (r1 === '💰') winAmount = currentBet * 50; // Jackpot
        
        tokens += winAmount;
        const msg = winMessages[Math.floor(Math.random() * winMessages.length)];
        statusMsg.textContent = msg.replace('{tokens}', winAmount);
        statusMsg.classList.add('status-win');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win: 2 of a kind
        let winAmount = Math.floor(currentBet * 1.5);
        tokens += winAmount;
        statusMsg.textContent = `Partial Match! +${winAmount} Tokens`;
        statusMsg.classList.add('status-win');
    } else {
        // Loss
        const msg = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        statusMsg.textContent = msg.replace('{tokens}', currentBet);
        statusMsg.classList.add('status-loss');
    }
}

init();
