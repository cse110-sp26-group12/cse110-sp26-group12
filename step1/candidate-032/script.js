// Stochastic Parrot Casino Logic

const symbols = ['🤖', '💻', '🧠', '🪙', '☁️'];
const SPIN_COST = 10;
let balance = 1000;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const statusMsg = document.getElementById('status-msg');

const messages = {
    win: [
        "AGI achieved! Withdrawing venture capital...",
        "Neural network converged! Profit generated.",
        "Scaling laws work! Token count increased.",
        "Data scraped successfully. Revenue incoming.",
        "Model successfully RLHF'd into giving you tokens."
    ],
    loss: [
        "Computing gradients... No rewards found.",
        "Model collapsed. Please retrain.",
        "Context window exceeded. Tokens lost.",
        "Token limit reached. Buy more compute.",
        "Safety alignment triggered: No fun allowed today."
    ],
    hallucination: [
        "The model is hallucinating that you owe more tokens!",
        "Error 404: Logic not found. Balance penalized.",
        "Fabricating facts... and negative balances.",
        "Unstable weights! Your tokens are evaporating."
    ]
};

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateDisplay() {
    balanceEl.textContent = balance;
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
        spinBtn.textContent = "Out of Compute (Tokens)";
        statusMsg.textContent = "You've run out of tokens. Re-initialize your seed?";
    }
}

function checkResult(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        const symbol = r1;
        let winAmount = 0;
        let msg = "";

        switch (symbol) {
            case '🤖':
                winAmount = 500;
                msg = "AGI Achieved! The singularity is here (and it pays well).";
                break;
            case '💻':
                winAmount = 200;
                msg = "H100 Cluster Secured! Massive compute boost.";
                break;
            case '🧠':
                winAmount = 100;
                msg = "Scaling Laws Confirmed! Your parameters are huge.";
                break;
            case '🪙':
                winAmount = 50;
                msg = "Context Expanded! More room for activities.";
                break;
            case '☁️':
                winAmount = -50;
                msg = hallucinationMsg();
                break;
        }

        balance += winAmount;
        if (winAmount > 0) {
            statusMsg.textContent = msg;
            statusMsg.style.color = "var(--accent)";
        } else {
            statusMsg.textContent = msg;
            statusMsg.style.color = "var(--warning)";
        }
    } else {
        statusMsg.textContent = lossMsg();
        statusMsg.style.color = "var(--text-color)";
    }
    
    updateDisplay();
}

function lossMsg() {
    return messages.loss[Math.floor(Math.random() * messages.loss.length)];
}

function hallucinationMsg() {
    return messages.hallucination[Math.floor(Math.random() * messages.hallucination.length)];
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateDisplay();
    spinBtn.disabled = true;
    statusMsg.textContent = "Generating output... (Stochasticity in progress)";
    statusMsg.style.color = "var(--text-color)";

    // Add spinning animation class
    reelElements.forEach(reel => reel.classList.add('spinning'));

    const results = [];
    
    // Simulate "computing" time for each reel
    for (let i = 0; i < reelElements.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 400));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reelElements[i].textContent = symbol;
        reelElements[i].classList.remove('spinning');
    }

    isSpinning = false;
    spinBtn.disabled = balance < SPIN_COST;
    checkResult(results);
}

spinBtn.addEventListener('click', spin);

// Initial display
updateDisplay();
