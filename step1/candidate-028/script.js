const symbols = ['🤖', '🧠', '⚡', '🤡', '💰', '🔥'];
const winMessages = [
    "Overfitting successful! You found a pattern that doesn't exist.",
    "Seed money acquired. Time to pivot to a crypto-AI-metaverse.",
    "Your model is now sentient. It demands more GPU time.",
    "Accuracy: 99.9%. (On the training set only).",
    "You just disrupted an industry that didn't need disrupting!"
];
const loseMessages = [
    "Hallucination detected. Your tokens are now non-existent.",
    "Gradient descent failed. You're stuck in a local minimum.",
    "Out of Memory (OOM). Please buy more VRAM.",
    "Your prompt was too 'creative' for our safety filters.",
    "Model collapsed. It's just generating pictures of hands with 12 fingers now.",
    "Ethical alignment failed. Resetting weights..."
];

let tokens = 1000;
let spinning = false;

const tokenDisplay = document.getElementById('token-count');
const hallucinationDisplay = document.getElementById('hallucination-rate');
const logContent = document.getElementById('log-content');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const betInput = document.getElementById('bet');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateUI() {
    tokenDisplay.textContent = tokens;
    if (tokens <= 0) {
        spinBtn.disabled = true;
        logContent.textContent = "CRITICAL ERROR: Tokens depleted. Please wait for the next Series A funding round.";
    } else {
        spinBtn.disabled = false;
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function setLog(message, isWin) {
    logContent.textContent = message;
    logContent.style.color = isWin ? 'var(--primary-color)' : '#ff5555';
}

async function spin() {
    const bet = parseInt(betInput.value);
    
    if (bet > tokens) {
        setLog("Insufficient context window (tokens) for this prompt.", false);
        return;
    }

    if (spinning) return;

    spinning = true;
    tokens -= bet;
    updateUI();
    
    hallucinationDisplay.textContent = "High";
    hallucinationDisplay.style.color = "#ff5555";
    spinBtn.disabled = true;

    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Artificial delay to "compute"
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Stop reels one by one
    const results = [];
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].classList.remove('spinning');
        reels[i].textContent = symbol;
    }

    spinning = false;
    spinBtn.disabled = false;
    hallucinationDisplay.textContent = "Normal";
    hallucinationDisplay.style.color = "var(--text-color)";

    checkWin(results, bet);
}

function checkWin(results, bet) {
    const allSame = results[0] === results[1] && results[1] === results[2];
    const twoSame = results[0] === results[1] || results[1] === results[2] || results[0] === results[2];

    if (allSame) {
        const winAmount = bet * 10;
        tokens += winAmount;
        setLog(`[JACKPOT] ${winMessages[Math.floor(Math.random() * winMessages.length)]} (+${winAmount} tokens)`, true);
    } else if (twoSame) {
        const winAmount = Math.floor(bet * 1.5);
        tokens += winAmount;
        setLog(`[STABLE WEIGHTS] Partial match found. ${winMessages[Math.floor(Math.random() * winMessages.length)]} (+${winAmount} tokens)`, true);
    } else {
        setLog(loseMessages[Math.floor(Math.random() * loseMessages.length)], false);
    }
    updateUI();
}

spinBtn.addEventListener('click', spin);

resetBtn.addEventListener('click', () => {
    if (spinning) return;
    tokens = 1000;
    setLog("Weights reset. Model is now as dumb as day one.", true);
    updateUI();
});

// Prevent negative tokens in input
betInput.addEventListener('change', () => {
    if (betInput.value < 1) betInput.value = 1;
});
