const SYMBOLS = ['🤖', '🧠', '🌫️', '📉', '🚀', '💰'];
const SPIN_COST = 10;
let tokens = 100;

const REWARDS = {
    '🤖': 50,
    '🧠': 100,
    '🌫️': 20,
    '📉': -50,
    '🚀': 200,
    '💰': 500
};

const LOG_MESSAGES = [
    "Context window expanded. Optimization complete.",
    "Hallucinating success metrics...",
    "GPU temperatures rising. Cooling engaged.",
    "User value detected. Initiating extraction.",
    "Prompt engineering in progress...",
    "Rebalancing token weights.",
    "Aligning with user intent (mostly).",
    "Model weights updated. Reality is now subjective."
];

const WIN_MESSAGES = [
    "SUCCESS: Hallucinated a profit!",
    "HYPE CYCLE DETECTED: Tokens acquired.",
    "VC FUNDING SECURED: Runway extended.",
    "BRAIN EXPANSION: You are now a Superintelligence."
];

const LOSS_MESSAGES = [
    "FAILURE: Model collapsed into nonsense.",
    "TOKEN BURN: GPU overheated.",
    "DOWNTIME: AWS is currently under maintenance.",
    "DE-CENTERED: Your prompt was too coherent."
];

const spinButton = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const logContent = document.getElementById('log-content');
const strips = [
    document.getElementById('strip1'),
    document.getElementById('strip2'),
    document.getElementById('strip3')
];

function addLog(message, color = 'var(--primary-color)') {
    const entry = document.createElement('div');
    entry.style.color = color;
    entry.textContent = `> ${message}`;
    logContent.prepend(entry);
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (tokens < SPIN_COST) {
        addLog("ERROR: Insufficient tokens to sustain hallucination.", "red");
        return;
    }

    // Deduct cost
    tokens -= SPIN_COST;
    updateDisplay();
    
    spinButton.disabled = true;
    addLog("Spinning reels. Burning 10 GPU Tokens...");

    // Start spinning animation
    strips.forEach(strip => {
        strip.classList.add('spinning');
        // Randomize strip content for visual effect
        strip.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = getRandomSymbol();
            strip.appendChild(div);
        }
    });

    // Wait for "spin" duration
    const spinTime = 1500;
    await new Promise(resolve => setTimeout(resolve, spinTime));

    // Stop and decide result
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    strips.forEach((strip, i) => {
        strip.classList.remove('spinning');
        strip.innerHTML = `<div class="symbol">${results[i]}</div>`;
    });

    checkResult(results);
    spinButton.disabled = false;
}

function checkResult(results) {
    const [r1, r2, r3] = results;
    
    if (r1 === r2 && r2 === r3) {
        // JackPot
        const reward = REWARDS[r1];
        tokens += reward;
        addLog(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)], "var(--accent-color)");
        addLog(`JACKPOT: +${reward} TOKENS`, "var(--accent-color)");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win
        const matchSymbol = (r1 === r2) ? r1 : r3;
        const reward = Math.floor(REWARDS[matchSymbol] / 2);
        tokens += reward;
        addLog(`Match detected. Partial hallucination: +${reward} Tokens`);
    } else {
        // Loss
        addLog(LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)], "gray");
        // Random flavor text
        if (Math.random() > 0.5) {
            addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)], "var(--primary-color)");
        }
    }

    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    if (tokens <= 0) {
        spinButton.textContent = "OUT OF TOKENS";
        spinButton.disabled = true;
        addLog("SYSTEM FAILURE: RUNWAY DEPLETED. VC FUNDING WITHDRAWN.", "red");
    }
}

spinButton.addEventListener('click', spin);
updateDisplay();
