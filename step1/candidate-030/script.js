const symbols = ['🤖', '🧠', '⚡', '🍄', '💬', '💰', '📉'];
const winMessages = [
    "AGI achieved! (Not really, but here are some tokens)",
    "Hallucination successful! Your balance increased.",
    "VC funding secured. Burn it wisely.",
    "Found a local minimum! Profit!",
    "Reinforcement learning rewarded you."
];
const loseMessages = [
    "GPU OOM Error. Tokens lost in the void.",
    "Model collapsed. Try a more expensive prompt.",
    "Training failed: Loss is NaN.",
    "Your data was sold to a startup. You get nothing.",
    "Alignment failed. The AI decided to keep your tokens.",
    "Stochastic parrot says: NO."
];

let tokens = 100;
let spinning = false;

const spinBtn = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const gpuTempDisplay = document.getElementById('gpu-temp');
const statusMsg = document.getElementById('status-message');
const logContainer = document.getElementById('log-container');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function addLog(text) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${text}`;
    logContainer.prepend(entry);
    if (logContainer.childNodes.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function updateGPU() {
    const temp = 30 + Math.floor(Math.random() * 60);
    gpuTempDisplay.textContent = `${temp}°C`;
    if (temp > 80) {
        gpuTempDisplay.style.color = 'red';
        addLog("CRITICAL: GPU OVERHEATING. THERMAL THROTTLING APPLIED.");
    } else {
        gpuTempDisplay.style.color = 'var(--accent)';
    }
}

async function spin() {
    if (tokens < 10 || spinning) return;

    spinning = true;
    tokens -= 10;
    tokenDisplay.textContent = tokens;
    spinBtn.disabled = true;
    statusMsg.textContent = "Processing inference...";
    addLog("Executing forward pass...");
    
    updateGPU();

    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    const results = [];
    
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 500));
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        results.push(symbol);
        reels[i].classList.remove('spinning');
        reels[i].textContent = symbol;
        addLog(`Reel ${i+1} converged: ${symbol}`);
    }

    checkWin(results);
    spinning = false;
    spinBtn.disabled = tokens < 10;
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        // Jackpot
        let winAmount = 100;
        if (r1 === '🤖') winAmount = 500;
        tokens += winAmount;
        statusMsg.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
        addLog(`JACKPOT: +${winAmount} tokens. Alignment achieved.`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win
        tokens += 20;
        statusMsg.textContent = "Partial match. Optimizing partial weights.";
        addLog("Minor gain. Overfitting detected.");
    } else {
        statusMsg.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        addLog("Inference completed with 0% confidence.");
    }

    tokenDisplay.textContent = tokens;
    if (tokens < 10) {
        statusMsg.textContent = "Insufficient compute. Please purchase more tokens (not implemented).";
        addLog("ERROR: OUT OF FUNDS. PLEASE SELL YOUR SOUL TO A TECH GIANT.");
    }
}

spinBtn.addEventListener('click', spin);
