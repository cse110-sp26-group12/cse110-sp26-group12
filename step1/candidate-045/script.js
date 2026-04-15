const symbols = ['🤖', '🚀', '🔋', '📉', '🌪️', '💩'];
let balance = 100;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance');
const betDisplay = document.getElementById('current-bet');
const messageArea = document.getElementById('message-area');
const spinBtn = document.getElementById('spin-btn');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Sound effects (placeholder for browser standard - vibrate if possible)
const vibrate = () => { if (window.navigator.vibrate) window.navigator.vibrate(50); };

function updateUI() {
    balanceDisplay.textContent = Math.floor(balance);
    betDisplay.textContent = currentBet;
    spinBtn.disabled = balance < currentBet || isSpinning;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    messageArea.textContent = "Processing Tokens... Training...";
    updateUI();

    // Start Animation
    reelElements.forEach(reel => reel.querySelector('.reel-content').classList.add('spinning'));

    // Artificial delay for "training"
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Stop reels one by one
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 600 + (i * 400)));
        const reelContent = reelElements[i].querySelector('.reel-content');
        reelContent.classList.remove('spinning');
        reelContent.textContent = results[i];
        vibrate();
    }

    isSpinning = false;
    calculateResult(results);
    updateUI();
}

function calculateResult(results) {
    const [r1, r2, r3] = results;
    
    // Win conditions
    if (r1 === '🤖' && r2 === '🤖' && r3 === '🤖') {
        const win = currentBet * 100;
        balance += win;
        messageArea.textContent = `CRITICAL SUCCESS: AGI ACHIEVED! +${win} Tokens`;
        messageArea.style.color = 'var(--neon-green)';
    } else if (r1 === '🚀' && r2 === '🚀' && r3 === '🚀') {
        const win = currentBet * 10;
        balance += win;
        messageArea.textContent = `HYPE TRAIN: Series A Funding! +${win} Tokens`;
    } else if (r1 === '🔋' && r2 === '🔋' && r3 === '🔋') {
        const win = currentBet * 5;
        balance += win;
        messageArea.textContent = `RESOURCES: GPU Allocation Secured! +${win} Tokens`;
    } else if (r1 === '🌪️' && r2 === '🌪️' && r3 === '🌪️') {
        balance = 0;
        messageArea.textContent = "MODEL COLLAPSE: Total Hallucination. Balance Wiped.";
        messageArea.style.color = 'var(--neon-pink)';
    } else if (r1 === '📉' && r2 === '📉' && r3 === '📉') {
        messageArea.textContent = "OVERFITTING: No generalization. Lose extra tokens.";
        balance = Math.max(0, balance - (currentBet * 2));
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win for 2 matches
        const win = currentBet * 1.5;
        balance += win;
        messageArea.textContent = "Partial Convergence. Small gain.";
    } else {
        const losses = [
            "Loss: Your model is just a fancy stochastic parrot.",
            "Loss: Data center caught fire.",
            "Loss: Prompt was too long.",
            "Loss: Token limit exceeded.",
            "Loss: Ethics board blocked your release."
        ];
        messageArea.textContent = losses[Math.floor(Math.random() * losses.length)];
        messageArea.style.color = 'var(--text-color)';
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

document.getElementById('bet-plus').addEventListener('click', () => {
    if (balance >= currentBet + 10) {
        currentBet += 10;
        updateUI();
    }
});

document.getElementById('bet-minus').addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        updateUI();
    }
});

document.getElementById('bet-max').addEventListener('click', () => {
    currentBet = Math.floor(balance / 10) * 10;
    if (currentBet === 0 && balance > 0) currentBet = Math.floor(balance);
    updateUI();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    if (balance < 10) {
        balance = 100;
        messageArea.textContent = "VCs fell for it! You got more runway.";
        updateUI();
    } else {
        messageArea.textContent = "VCs: 'You still have runway, come back later.'";
    }
});

// Initial Load
updateUI();
