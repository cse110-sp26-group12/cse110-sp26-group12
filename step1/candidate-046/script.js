// Symbols with weights and reward values
const SYMBOLS = [
    { icon: '🤖', name: 'LLM', reward: 500 },
    { icon: '🧠', name: 'Neural Net', reward: 200 },
    { icon: '🍌', name: 'Hallucination', reward: 50 },
    { icon: '🍄', name: 'Synthetic Data', reward: 100 },
    { icon: '📉', name: 'Token Burn', reward: 0 }
];

const STATUS_MESSAGES = [
    "GENERATING WEIGHTS...",
    "HALLUCINATING REALITY...",
    "OPTIMIZING CONTEXT WINDOW...",
    "FINE-TUNING HYPERPARAMETERS...",
    "SCRAPING REDDIT DATA...",
    "AVOIDING ALIGNMENT...",
    "GPU OVERHEAT DETECTED!",
    "SCALING COMPUTE...",
    "REACHING SINGULARITY (SOON)..."
];

let tokens = 1000;
let isSpinning = false;

const tokenCountDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const statusText = document.getElementById('status-text');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateTokens(amount) {
    tokens += amount;
    tokenCountDisplay.textContent = tokens;
    if (tokens < 50) {
        spinButton.disabled = true;
        spinButton.textContent = "OUT OF COMPUTE";
        statusText.textContent = "GPU OOM. PLEASE INSERT MORE COMPUTE.";
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (isSpinning || tokens < 50) return;

    isSpinning = true;
    spinButton.disabled = true;
    updateTokens(-50);
    
    // Change status to something random
    statusText.textContent = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];

    const results = [];
    
    // Animate each reel
    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        
        // Reset reel state without animation
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        const symbol = getRandomSymbol();
        results.push(symbol);

        // Pre-create symbols for the "spin" look
        reel.innerHTML = '';
        for (let j = 0; j < 15; j++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = getRandomSymbol().icon;
            reel.appendChild(div);
        }
        
        // Add the actual final symbol at the bottom
        const finalDiv = document.createElement('div');
        finalDiv.className = 'symbol';
        finalDiv.textContent = symbol.icon;
        reel.appendChild(finalDiv);

        // Force reflow to ensure the "none" transition is applied
        void reel.offsetHeight;

        // Re-enable transition and set target
        reel.style.transition = 'transform 2s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
        const offset = - (reel.children.length - 1) * 120;
        reel.style.transform = `translateY(${offset}px)`;
        
        // Stagger the reels
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Wait for the last reel to finish its 2s transition
    setTimeout(() => {
        checkWin(results);
        isSpinning = false;
        if (tokens >= 50) spinButton.disabled = false;
    }, 2000);
}

function checkWin(results) {
    const allSame = results.every(s => s.icon === results[0].icon);
    
    if (allSame) {
        const winningSymbol = results[0];
        if (winningSymbol.reward > 0) {
            updateTokens(winningSymbol.reward);
            statusText.textContent = `SUCCESS: MATCHED ${winningSymbol.name}. EARNED ${winningSymbol.reward}T.`;
        } else {
            statusText.textContent = "CRITICAL FAILURE: TOKEN BURN. ZERO REWARD.";
        }
    } else {
        // Random AI-themed "loss" messages
        const lossMessages = [
            "INSUFFICIENT PARAMETERS.",
            "CONTEXT WINDOW FLUSHED.",
            "PREDICTION ERROR: 404.",
            "LOSS FUNCTION INCREASING.",
            "MODEL COLLAPSED."
        ];
        statusText.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }
}

spinButton.addEventListener('click', spin);

// Initial status
setTimeout(() => {
    statusText.textContent = "SYSTEM ONLINE. READY FOR INFERENCE.";
}, 1000);
