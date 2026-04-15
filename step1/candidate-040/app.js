/**
 * AI Hype Slot Machine - Logic
 */

const SYMBOLS = ['🤖', '🚀', '📉', '💡', '💰', '🤡', '🍪', '🧠'];

const WIN_QUOTES = [
    "Series A closed! +20 Credits",
    "Added 'AI' to your LinkedIn bio. +10 Credits",
    "Hallucination passed as 'Emergent Behavior'. +50 Credits",
    "Secured H100 GPUs. +100 Credits",
    "Pivot to Crypto failed, but AI hype saved you! +30 Credits"
];

const LOSE_QUOTES = [
    "Model collapsed. Back to the drawing board.",
    "Token limit exceeded. Pay up.",
    "Weights lost during training.",
    "Overfitted on junk data.",
    "Just another GPT wrapper...",
    "Server overloaded by 1 billion bots."
];

let balance = 50;
const spinBtn = document.getElementById('spin-btn');
const balanceEl = document.getElementById('balance');
const statusMsg = document.getElementById('status-msg');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateDisplay() {
    balanceEl.textContent = balance;
}

async function startInference() {
    if (balance < 5) return;

    // Burn credits
    balance -= 5;
    updateDisplay();

    // UI Feedback
    spinBtn.disabled = true;
    statusMsg.textContent = "Processing neural weights...";
    statusMsg.style.color = "#888";

    // Start Animation
    reels.forEach(r => r.classList.add('spinning'));

    // Artificial Latency (Simulation)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Resolve Symbols
    const results = reels.map(reel => {
        const pick = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        reel.classList.remove('spinning');
        reel.textContent = pick;
        return pick;
    });

    evaluateResult(results);
    spinBtn.disabled = false;
}

function evaluateResult(res) {
    const [s1, s2, s3] = res;

    if (s1 === s2 && s2 === s3) {
        // Jackpot
        balance += 50;
        statusMsg.textContent = `SUCCESS: ${WIN_QUOTES[Math.floor(Math.random() * WIN_QUOTES.length)]}`;
        statusMsg.style.color = "#39ff14";
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Minor Win
        balance += 10;
        statusMsg.textContent = "Minor Breakthrough! +10 Credits";
        statusMsg.style.color = "#fff";
    } else {
        // Loss
        statusMsg.textContent = LOSE_QUOTES[Math.floor(Math.random() * LOSE_QUOTES.length)];
        statusMsg.style.color = "#ff4444";
    }

    if (balance < 5) {
        statusMsg.textContent = "Bankruptcy. Your startup was just an API wrapper.";
        spinBtn.textContent = "NO COMPUTE LEFT";
        spinBtn.disabled = true;
    }
    updateDisplay();
}

spinBtn.addEventListener('click', startInference);