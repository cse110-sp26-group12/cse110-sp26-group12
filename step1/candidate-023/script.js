const SYMBOLS = [
    { char: '💎', name: 'H100 GPU', weight: 1, payout: 100 },
    { char: '🧠', name: 'RLHF Feedback', weight: 2, payout: 50 },
    { char: '💾', name: 'Vector DB', weight: 4, payout: 20 },
    { char: '⚡', name: 'Compute Node', weight: 6, payout: 10 },
    { char: '🤖', name: 'Parameter', weight: 8, payout: 5 },
    { char: '📉', name: 'Hallucination', weight: 3, payout: 0 }
];

const MESSAGES = {
    spinning: [
        "Quantizing weights...",
        "Bypassing safety alignment...",
        "Scraping reddit for training data...",
        "Pruning ethical constraints...",
        "Injecting synthetic noise...",
        "Scaling parameters to 1.7T...",
        "Heating up Northern Virginia...",
        "Requesting more VC funding..."
    ],
    win: [
        "Emergent capability detected!",
        "Optimization successful: Revenue divergence.",
        "Aura of AGI achieved.",
        "Model convergence reached.",
        "Stock price increased by 400%."
    ],
    loss: [
        "Model collapsed into local minimum.",
        "Hallucination detected. Truth is optional.",
        "Overfitting on noise.",
        "API error: Rate limit (Poverty) exceeded.",
        "GPU cluster overheated."
    ]
};

let balance = 10000;
let isSpinning = false;

const balanceEl = document.getElementById('token-balance');
const accuracyEl = document.getElementById('accuracy');
const betInput = document.getElementById('bet-input');
const spinButton = document.getElementById('spin-button');
const logContent = document.getElementById('log-content');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function addLog(text, type = 'info') {
    const entry = document.createElement('p');
    entry.className = 'log-entry';
    if (type === 'win') entry.style.color = 'var(--neon-cyan)';
    if (type === 'loss') entry.style.color = 'var(--neon-magenta)';
    entry.textContent = text;
    logContent.prepend(entry);
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

async function spin() {
    const bet = parseInt(betInput.value);
    
    if (balance < bet) {
        addLog("Insufficient compute credits. Liquidate assets?", "loss");
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    balance -= bet;
    balanceEl.textContent = balance;
    
    addLog(`Burning ${bet} tokens for inference...`);
    
    // Start animation
    reels.forEach(r => r.classList.add('spinning'));

    const spinInterval = setInterval(() => {
        addLog(MESSAGES.spinning[Math.floor(Math.random() * MESSAGES.spinning.length)]);
    }, 400);

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Wait for "inference"
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearInterval(spinInterval);
    reels.forEach((r, i) => {
        r.classList.remove('spinning');
        r.innerHTML = `<div class="symbol">${results[i].char}</div>`;
    });

    // Calculate win
    checkResults(results, bet);

    isSpinning = false;
    spinButton.disabled = false;
    
    // Fake accuracy jitter
    accuracyEl.textContent = (99 + Math.random()).toFixed(2) + "%";
}

function checkResults(results, bet) {
    const allSame = results[0].char === results[1].char && results[1].char === results[2].char;
    const twoSame = results[0].char === results[1].char || results[1].char === results[2].char || results[0].char === results[2].char;

    if (allSame) {
        const payout = results[0].payout * (bet / 10);
        balance += payout;
        addLog(MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)], 'win');
        addLog(`PROFIT: +${payout} tokens (Optimization Multiplier: x${results[0].payout})`, 'win');
    } else if (twoSame && results[0].payout > 20) {
        // Bonus for 2 high-value symbols
        const payout = Math.floor(bet * 1.5);
        balance += payout;
        addLog("Partial convergence achieved.", 'win');
        addLog(`REVENUE: +${payout} tokens`, 'win');
    } else {
        addLog(MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)], 'loss');
    }

    balanceEl.textContent = balance;
}

spinButton.addEventListener('click', spin);
betInput.addEventListener('change', () => {
    if (betInput.value < 10) betInput.value = 10;
});
