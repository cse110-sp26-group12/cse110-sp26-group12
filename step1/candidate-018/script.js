const symbols = ['🤖', '🧠', '⚡', '💸', '📉'];
let tokens = 1000;
const bet = 50;

const tokensEl = document.getElementById('tokens');
const spinBtn = document.getElementById('spin-btn');
const statusFeed = document.getElementById('status-feed');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${message}`;
    statusFeed.prepend(entry);
    
    // Limit logs to 20 entries
    if (statusFeed.children.length > 20) {
        statusFeed.removeChild(statusFeed.lastChild);
    }
}

function updateTokens(amount) {
    tokens += amount;
    tokensEl.textContent = tokens;
    
    if (tokens < bet) {
        spinBtn.disabled = true;
        spinBtn.textContent = "RATE LIMIT EXCEEDED";
        addLog("API Rate Limit Exceeded: Context window exhausted. Please insert credit card.", "loss");
    }
}

async function spin() {
    if (tokens < bet) return;

    updateTokens(-bet);
    spinBtn.disabled = true;
    addLog(`Burning ${bet} tokens for inference...`);
    
    // Start spinning
    reels.forEach(reel => {
        reel.classList.add('spinning');
        reel.classList.remove('glitch');
    });

    // Simulate network latency/compute time
    const spinDuration = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
        const results = reels.map(reel => {
            reel.classList.remove('spinning');
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = symbol;
            
            if (symbol === '📉') {
                reel.classList.add('glitch');
            }
            return symbol;
        });

        calculateOutcome(results);
        if (tokens >= bet) spinBtn.disabled = false;
    }, spinDuration);
}

function calculateOutcome(results) {
    const [r1, r2, r3] = results;
    
    if (results.includes('📉')) {
        addLog("Hallucination detected! Alignment failed.", "loss");
        return;
    }

    if (r1 === r2 && r2 === r3) {
        let win = 0;
        let msg = "";
        
        if (r1 === '🤖') {
            win = 1000;
            msg = "SINGULARITY ACHIEVED! Superintelligence unlocked.";
        } else if (r1 === '🧠') {
            win = 500;
            msg = "Weights optimized. Loss function minimized.";
        } else if (r1 === '⚡') {
            win = 200;
            msg = "Compute surplus detected. Batch size increased.";
        } else if (r1 === '💸') {
            win = 100;
            msg = "VC funding secured. Burn rate sustainable.";
        }
        
        addLog(msg, "win");
        updateTokens(win);
    } else {
        const randomLogs = [
            "Sampling top-p... No significant patterns.",
            "Gradient descent stuck in local minima.",
            "Token sequence probability below threshold.",
            "Overfitting detected. Regularizing...",
            "Context window overflow. Truncating history."
        ];
        addLog(randomLogs[Math.floor(Math.random() * randomLogs.length)]);
    }
}

spinBtn.addEventListener('click', spin);
