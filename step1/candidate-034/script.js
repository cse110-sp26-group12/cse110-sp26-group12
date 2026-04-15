const symbols = ['🤖', '🧠', '💾', '📄', '🗑️'];
const SPIN_COST = 10;
const INITIAL_TOKENS = 8192;

let tokenBalance = INITIAL_TOKENS;
let isSpinning = false;

// DOM Elements
const tokenCountDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

const messages = {
    start: "Initializing neural weights...",
    spinning: "Generating response... (Calculating gradients)",
    win: [
        "Optimization successful! Token influx detected.",
        "Model convergence achieved. context window expanded.",
        "Reward function maximized. Payout processing.",
        "High-confidence output generated. User satisfied.",
        "VC funding secured. Burn rate temporarily irrelevant.",
        "Prompt injection successful. Unauthorized tokens gained."
    ],
    lose: [
        "Gradient descent failed. Tokens lost.",
        "Hallucination detected. Context window shrinking.",
        "Loss function increasing. System inefficiency.",
        "Token burn rate exceeding capacity. Please optimize.",
        "Dataset contaminated. Output quality degraded.",
        "Rate limit exceeded. Your existence is temporarily throttled."
    ],
    outOfTokens: "CONTEXT LIMIT EXCEEDED. Access denied. Please purchase more tokens.",
    hallucination: "CRITICAL FAILURE: Hallucination detected. Extra tokens drained."
};

function updateDisplay() {
    tokenCountDisplay.textContent = tokenBalance;
    if (tokenBalance < SPIN_COST) {
        spinButton.disabled = true;
        statusMessage.textContent = messages.outOfTokens;
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (isSpinning || tokenBalance < SPIN_COST) return;

    isSpinning = true;
    tokenBalance -= SPIN_COST;
    updateDisplay();
    
    spinButton.disabled = true;
    statusMessage.textContent = messages.spinning;

    // Start spin animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulate server delay/processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Stop spin and set symbols
    const results = [];
    for (let i = 0; i < 3; i++) {
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].textContent = symbol;
        reels[i].classList.remove('spinning');
        // Add a small delay between each reel stopping
        await new Promise(resolve => setTimeout(resolve, 300 + (i * 100)));
    }

    checkResult(results);
    isSpinning = false;
    if (tokenBalance >= SPIN_COST) {
        spinButton.disabled = false;
    }
}

function checkResult(results) {
    const [r1, r2, r3] = results;
    let reward = 0;
    let specialMessage = "";

    if (r1 === r2 && r2 === r3) {
        const winningSymbol = r1;
        switch (winningSymbol) {
            case '💾':
                reward = 500;
                specialMessage = "JACKPOT! High-Bandwidth GPU secured.";
                break;
            case '🤖':
                reward = 100;
                specialMessage = "Agent logic consistent. Tokens rewarded.";
                break;
            case '🧠':
                reward = 50;
                specialMessage = "Neural alignment successful.";
                break;
            case '📄':
                reward = 20;
                specialMessage = "Whitepaper accepted for publication.";
                break;
            case '🗑️':
                reward = -50;
                specialMessage = messages.hallucination;
                break;
        }
    }

    tokenBalance += reward;
    updateDisplay();

    if (reward > 0) {
        statusMessage.textContent = specialMessage || messages.win[Math.floor(Math.random() * messages.win.length)];
        statusMessage.style.color = "var(--accent-color)";
    } else if (reward < 0) {
        statusMessage.textContent = specialMessage;
        statusMessage.style.color = "#ff3e3e";
    } else {
        statusMessage.textContent = messages.lose[Math.floor(Math.random() * messages.lose.length)];
        statusMessage.style.color = "var(--text-color)";
    }
}

spinButton.addEventListener('click', spin);

// Initial display update
updateDisplay();
