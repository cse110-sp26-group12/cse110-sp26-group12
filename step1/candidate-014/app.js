const symbols = ['🤖', '🔥', '📉', '🍕', '💩', '💎'];
let balance = 1000;
const spinCost = 50;

const balanceDisplay = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const statusMsg = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const messages = [
    "Synthesizing useless data...",
    "Optimizing for VC funding...",
    "Downloading more RAM...",
    "Hallucinating success...",
    "Scaling to infinite users (0 actual)...",
    "Burning through NVIDIA stock...",
    "Scraping the bottom of the barrel...",
    "Training on its own output...",
    "Ignoring safety alignment...",
    "Pivot to crypto detected..."
];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateStatus(msg) {
    statusMsg.textContent = msg;
}

function checkWin(results) {
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        if (s1 === '💎') {
            balance += 1000;
            updateStatus("JACKPOT: MARKET MANIPULATION SUCCESS!");
            return true;
        }
        if (s1 === '🤖') {
            balance += 250;
            updateStatus("AVERAGE CHATBOT OUTPUT GENERATED (+250)");
            return true;
        }
        if (s1 === '🔥') {
            balance -= 200;
            updateStatus("DATA CENTER FIRE: COMPUTE PENALTY (-200)");
            return true;
        }
        if (s1 === '💩') {
            updateStatus("PURE HALLUCINATION DETECTED (+0)");
            return true;
        }
        
        // Default small win for other triples
        balance += 100;
        updateStatus(`TRIPLE ${s1}: MINOR BREAKTHROUGH (+100)`);
        return true;
    }
    
    // Random failure messages
    if (Math.random() > 0.5) {
        updateStatus("ERROR: INSUFFICIENT QUALITY IN PROMPT.");
    } else {
        updateStatus("NO WIN: TOKENS CONSUMED BY THE VOID.");
    }
    return false;
}

async function spin() {
    if (balance < spinCost) {
        updateStatus("BANKRUPT: NO MORE COMPUTE CREDITS.");
        spinBtn.disabled = true;
        return;
    }

    // Deduct cost
    balance -= spinCost;
    balanceDisplay.textContent = balance;
    spinBtn.disabled = true;

    updateStatus(messages[Math.floor(Math.random() * messages.length)]);

    // Start spinning
    reels.forEach(reel => reel.classList.add('spinning'));

    // Wait for "compute" (simulated delay)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stop spinning and set results
    const results = [];
    reels.forEach(reel => {
        reel.classList.remove('spinning');
        const symbol = getRandomSymbol();
        reel.textContent = symbol;
        results.push(symbol);
    });

    checkWin(results);
    balanceDisplay.textContent = balance;

    if (balance >= spinCost) {
        spinBtn.disabled = false;
    } else {
        updateStatus("AGI REACHED (YOU ARE OUT OF MONEY).");
    }
}

const resetBtn = document.getElementById('reset-btn');

function reset() {
    balance = 1000;
    balanceDisplay.textContent = balance;
    spinBtn.disabled = false;
    updateStatus("Quota Refreshed. Data harvesting resumed.");
    reels.forEach(reel => reel.textContent = '🤖');
}

spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);
