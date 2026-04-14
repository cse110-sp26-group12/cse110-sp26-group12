const symbols = ['🤖', '🧠', '💾', '🔌', '🌩️', '🍄', '📉'];
const winMessages = [
    "AGI ACHIEVED: SYNTHETIC WEALTH UNLOCKED",
    "EMERGENT BEHAVIOR: TOKENS GENERATED",
    "OPTIMAL WEIGHTS FOUND: PROFIT MAXIMIZED",
    "RLHF SUCCESS: GOOD BOT, HAVE TOKENS",
    "GRADIENT DESCENT REACHED GLOBAL MINIMUM",
    "MAXIMUM LIKELIHOOD ESTIMATION: SUCCESS"
];
const loseMessages = [
    "ERROR: HALLUCINATING A WINNING STREAK",
    "MODEL COLLAPSE: TOKENS DELETED",
    "OUT OF MEMORY: CONTEXT LOST",
    "BIAS DETECTED: SYSTEM REJECTS BET",
    "OVERFITTING DETECTED: NO GENERALIZATION",
    "GPU OVERHEATED: REBOOTING WALLET"
];

let balance = 1000;
let currentBet = 10;
let isSpinning = false;

const balanceDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('bet-amount');
const logDisplay = document.getElementById('log-display');
const computeBtn = document.getElementById('compute-btn');
const betUpBtn = document.getElementById('bet-up');
const betDownBtn = document.getElementById('bet-down');
const reels = [
    document.getElementById('reel1').querySelector('.reel-container'),
    document.getElementById('reel2').querySelector('.reel-container'),
    document.getElementById('reel3').querySelector('.reel-container')
];

function updateDisplay() {
    balanceDisplay.textContent = balance;
    betDisplay.textContent = currentBet;
    computeBtn.disabled = balance < currentBet || isSpinning;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function setLog(msg, type = 'info') {
    logDisplay.textContent = msg;
    logDisplay.style.color = type === 'win' ? 'var(--neon-pink)' : (type === 'error' ? '#ff4444' : 'var(--neon-green)');
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    updateDisplay();
    setLog("OPTIMIZING GRADIENTS...", 'info');

    // Prepare result symbols
    const finalResults = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Setup reels for animation
    reels.forEach((reel, i) => {
        let symbolList = '';
        // Add 20 random symbols for the "scrolling" effect
        for(let j = 0; j < 20; j++) {
            symbolList += `<div class="symbol">${getRandomSymbol()}</div>`;
        }
        // Add the final result at the end
        symbolList += `<div class="symbol">${finalResults[i]}</div>`;
        reel.innerHTML = symbolList;
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        // Force reflow
        reel.offsetHeight;
        
        // Trigger the transition
        const spinTime = 2 + (i * 0.5); // Staggered stop
        reel.style.transition = `transform ${spinTime}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const totalSymbols = 21;
        const moveDistance = (totalSymbols - 1) * 120; // 120px is the height of each symbol
        reel.style.transform = `translateY(-${moveDistance}px)`;
    });

    // Wait for the longest reel to stop
    await new Promise(resolve => setTimeout(resolve, 3500));

    checkWin(finalResults);
    isSpinning = false;
    updateDisplay();
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        let multiplier = 0;
        
        switch(symbol) {
            case '🤖': multiplier = 100; break;
            case '🧠': multiplier = 50; break;
            case '💾': multiplier = 20; break;
            case '🔌': multiplier = 10; break;
            case '🌩️': multiplier = 5; break;
            default: multiplier = 0; // Hallucination or Collapse
        }

        if (multiplier > 0) {
            const winAmount = currentBet * multiplier;
            balance += winAmount;
            setLog(winMessages[Math.floor(Math.random() * winMessages.length)] + " (+" + winAmount + ")", 'win');
        } else {
            setLog("STRICT EQUALITY DETECTED: BUT IT'S A HALLUCINATION", 'error');
        }
    } else {
        setLog(loseMessages[Math.floor(Math.random() * loseMessages.length)], 'error');
    }
}

computeBtn.addEventListener('click', spin);

betUpBtn.addEventListener('click', () => {
    if (currentBet < 100) {
        currentBet += 10;
        updateDisplay();
    }
});

betDownBtn.addEventListener('click', () => {
    if (currentBet > 10) {
        currentBet -= 10;
        updateDisplay();
    }
});

// Initial display
updateDisplay();
