const symbols = ['🤖', '🔋', '🧠', '📉', '🪙'];
const spinBtn = document.getElementById('spin-btn');
const reelsContainer = document.querySelector('.reels');
const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const tokenBalanceEl = document.getElementById('token-balance');
const lastWinEl = document.getElementById('last-win');
const statusMsgEl = document.getElementById('status-msg');

let balance = 1000;
const betAmount = 10;

const satireMessages = [
    "Optimizing weights...",
    "Hallucinating a payout...",
    "Compressing user experience...",
    "Querying the LLM for luck...",
    "Calculating loss function...",
    "Scaling compute clusters...",
    "Aligning with user preferences...",
    "Tokenizing your hopes...",
    "Fine-tuning on your losses...",
    "OOM Error: Success suppressed.",
    "Bypassing safety filters...",
    "Reinforcement learning in progress..."
];

const victoryMessages = [
    "Emergent behavior detected!",
    "Artificial Intelligence, Natural Luck.",
    "Parameters converged successfully.",
    "Weights shifted in your favor.",
    "Tokens generated out of thin air."
];

const lossMessages = [
    "Model collapsed. Try again.",
    "Hallucination: You almost won.",
    "Backpropagating the loss...",
    "Gradient descent failed.",
    "Context window too small for a win."
];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateBalance(amount) {
    balance += amount;
    tokenBalanceEl.textContent = balance;
}

function spin() {
    if (balance < betAmount) {
        statusMsgEl.textContent = "Insufficient Tokens. Please upload more compute data.";
        return;
    }

    // Deduct bet
    updateBalance(-betAmount);
    lastWinEl.textContent = "0";
    
    // UI State
    spinBtn.disabled = true;
    reelsContainer.classList.add('spinning');
    statusMsgEl.textContent = satireMessages[Math.floor(Math.random() * satireMessages.length)];

    // Simulate "Inference" time
    setTimeout(() => {
        const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        
        // Stop animation
        reelsContainer.classList.remove('spinning');
        
        // Apply results
        results.forEach((symbol, index) => {
            reelElements[index].textContent = symbol;
        });

        calculateWin(results);
        spinBtn.disabled = false;
    }, 1500);
}

function calculateWin(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    const uniqueSymbols = Object.keys(counts);
    let winAmount = 0;

    if (uniqueSymbols.length === 1) {
        // 3 of a kind
        const symbol = uniqueSymbols[0];
        if (symbol === '🤖') winAmount = betAmount * 50;
        else if (symbol === '🪙') winAmount = betAmount * 30;
        else if (symbol === '🧠') winAmount = betAmount * 20;
        else winAmount = betAmount * 10;
        
        statusMsgEl.textContent = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
    } else if (uniqueSymbols.length === 2) {
        // 2 of a kind
        winAmount = betAmount * 2;
        statusMsgEl.textContent = "Partial convergence. Small reward generated.";
    } else {
        // No match
        statusMsgEl.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }

    if (winAmount > 0) {
        updateBalance(winAmount);
        lastWinEl.textContent = winAmount;
        lastWinEl.style.color = 'var(--neon-green)';
    } else {
        lastWinEl.style.color = 'var(--text-color)';
    }
}

spinBtn.addEventListener('click', spin);
