const symbols = ['🧠', '🤖', '🔌', '💰', '💩', '📉', '⚡'];
const tickerMessages = [
    "Fine-tuning your bank account...",
    "Alignment failed. Redirecting to ads.",
    "GPU Poor? Deposit more credits.",
    "Hallucinating new features...",
    "Sampling probability distributions...",
    "Scaling to infinite hype...",
    "Overfitting on your bad decisions.",
    "Token price up 400%. Your compute is gone.",
    "AGI is coming (in 2 weeks).",
    "Stochastic parrots are chirping...",
    "Venture Capitalists are entering the room.",
    "Synthetically generating wealth..."
];

let balance = 1000;
let totalWins = 0;
const spinCost = 50;

const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const balanceEl = document.getElementById('balance');
const winsEl = document.getElementById('wins');
const tickerEl = document.getElementById('ticker');

function updateUI() {
    balanceEl.textContent = balance;
    winsEl.textContent = totalWins;
}

function setTickerMessage(msg) {
    tickerEl.textContent = msg || tickerMessages[Math.floor(Math.random() * tickerMessages.length)];
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (balance < spinCost) {
        setTickerMessage("ERROR: Insufficient Compute. Buy more credits.");
        return;
    }

    balance -= spinCost;
    updateUI();
    spinBtn.disabled = true;
    setTickerMessage("Sampling weights...");

    // Add spinning animation
    reelElements.forEach(reel => {
        reel.classList.add('spinning');
        reel.classList.remove('win-flash');
    });

    const results = [];

    // Simulate different spin durations for each reel
    for (let i = 0; i < reelElements.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 500));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reelElements[i].textContent = symbol;
        reelElements[i].classList.remove('spinning');
    }

    checkWin(results);
    spinBtn.disabled = false;
}

function checkWin(results) {
    const [r1, r2, r3] = results;

    if (r1 === r2 && r2 === r3) {
        // Big Win
        const symbol = r1;
        let winAmount = 0;
        let message = "";

        switch (symbol) {
            case '💰':
                winAmount = 5000;
                message = "JACKPOT! INFINITE FUNDING SECURED.";
                break;
            case '🤖':
                winAmount = 1000;
                message = "AGI ACHIEVED! Tokens printed.";
                break;
            case '🧠':
                winAmount = 500;
                message = "Deep insight discovered. Credits rewarded.";
                break;
            case '💩':
                winAmount = 0;
                balance -= 200; // Lose more!
                message = "TOTAL HALLUCINATION. You lost extra compute.";
                break;
            case '📉':
                winAmount = 0;
                balance = Math.floor(balance / 2);
                message = "TOKEN CRASH. Market liquidated 50% of assets.";
                break;
            default:
                winAmount = 250;
                message = "Small model convergence.";
        }

        if (winAmount > 0) {
            balance += winAmount;
            totalWins += 1;
            reelElements.forEach(r => r.classList.add('win-flash'));
        }
        setTickerMessage(message);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial Win
        balance += 75;
        setTickerMessage("Partial alignment detected. +75 Credits.");
    } else {
        // Loss
        setTickerMessage();
    }

    updateUI();
}

spinBtn.addEventListener('click', spin);

// Initial UI setup
updateUI();
setInterval(() => {
    if (!spinBtn.disabled) {
        setTickerMessage();
    }
}, 5000);
