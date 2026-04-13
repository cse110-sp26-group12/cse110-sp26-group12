const symbols = ['🤖', '⚡', '🧠', '⚠️', '💰', '📉', '📈'];
const weights = [2, 3, 3, 2, 1, 3, 3]; // Probability weights

const statusMessages = [
    "Optimizing weights...",
    "Predicting next token...",
    "Hallucinating profit...",
    "Training on your history...",
    "Venture Capital injection!",
    "Context window overflowing...",
    "Loss function converging...",
    "Self-attention mechanism engaged...",
    "Discarding irrelevant data...",
    "Fine-tuning hyperparameters..."
];

const winMessages = [
    "Jackpot! Compute credits granted.",
    "Efficient inference! Tokens earned.",
    "Model performance peaked!",
    "Venture Capitalists are impressed."
];

const lossMessages = [
    "Prompt rejected. Safety alignment error.",
    "Model collapsed. Tokens burned.",
    "Hallucination detected. Credits lost.",
    "Inference timeout. Try again."
];

let tokens = 10000;
const spinCost = 100;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-balance');
const statusDisplay = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const vcButton = document.getElementById('vc-button');
const autoSpinCheckbox = document.getElementById('auto-spin');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels with some symbols
function initReels() {
    reelStrips.forEach(strip => {
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < symbols.length; i++) {
        if (random < weights[i]) return symbols[i];
        random -= weights[i];
    }
    return symbols[0];
}

async function spin() {
    if (isSpinning || tokens < spinCost) return;

    isSpinning = true;
    tokens -= spinCost;
    updateUI();
    
    spinButton.disabled = true;
    statusDisplay.textContent = statusMessages[Math.floor(Math.random() * statusMessages.length)];

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const symbolHeight = strip.children[0].offsetHeight;
            const spinCount = 10 + index * 5; // Variation in spin duration
            
            // Add the target symbol to the end
            const targetDiv = document.createElement('div');
            targetDiv.className = 'symbol';
            targetDiv.textContent = results[index];
            strip.appendChild(targetDiv);
            
            // Trigger animation
            const targetOffset = (strip.children.length - 1) * symbolHeight;
            strip.style.transform = `translateY(-${targetOffset}px)`;
            
            setTimeout(() => {
                // Reset strip position and clear extra symbols to prevent DOM bloat
                strip.style.transition = 'none';
                strip.style.transform = 'translateY(0)';
                
                // Keep only the last symbol and some fillers
                while (strip.children.length > 1) {
                    strip.removeChild(strip.firstChild);
                }
                
                // Add filler symbols back for the next spin
                for (let i = 0; i < 19; i++) {
                    const div = document.createElement('div');
                    div.className = 'symbol';
                    div.textContent = getRandomSymbol();
                    strip.insertBefore(div, strip.firstChild);
                }
                
                // Ensure the target result is at the bottom (visible)
                strip.style.transform = 'translateY(0)';
                // Force reflow
                strip.offsetHeight; 
                strip.style.transition = 'transform 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
                
                resolve();
            }, 1500 + index * 200);
        });
    });

    await Promise.all(spinPromises);

    calculateResults(results);
    isSpinning = false;
    spinButton.disabled = false;

    if (autoSpinCheckbox.checked && tokens >= spinCost) {
        setTimeout(spin, 1000);
    }
}

function calculateResults(results) {
    let winAmount = 0;
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        // Match 3
        const multiplier = getMultiplier(s1, 3);
        winAmount = spinCost * multiplier;
        statusDisplay.textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Match 2
        const matchSymbol = (s1 === s2) ? s1 : s3;
        const multiplier = getMultiplier(matchSymbol, 2);
        winAmount = spinCost * multiplier;
        statusDisplay.textContent = "Partial Convergence. Small gain.";
    } else {
        statusDisplay.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }

    // Special case: Hallucination ⚠️
    if (results.includes('⚠️')) {
        const hallucinationCount = results.filter(s => s === '⚠️').length;
        const penalty = spinCost * hallucinationCount;
        tokens = Math.max(0, tokens - penalty);
        statusDisplay.textContent = `CRITICAL HALLUCINATION! Lost ${penalty} extra tokens.`;
    }

    tokens += winAmount;
    updateUI();
}

function getMultiplier(symbol, matchCount) {
    const baseMultipliers = {
        '🤖': matchCount === 3 ? 10 : 2,
        '⚡': matchCount === 3 ? 5 : 1.5,
        '🧠': matchCount === 3 ? 8 : 2,
        '💰': matchCount === 3 ? 20 : 5,
        '📉': matchCount === 3 ? 2 : 0.5,
        '📈': matchCount === 3 ? 15 : 3,
        '⚠️': 0
    };
    return baseMultipliers[symbol] || 0;
}

function updateUI() {
    tokenDisplay.textContent = tokens.toLocaleString();
    if (tokens < spinCost) {
        spinButton.style.display = 'none';
        vcButton.style.display = 'block';
        statusDisplay.textContent = "OUT OF TOKENS. Please deposit more VC funding.";
    } else {
        spinButton.style.display = 'block';
        vcButton.style.display = 'none';
        spinButton.disabled = isSpinning;
    }
}

vcButton.addEventListener('click', () => {
    tokens += 5000;
    statusDisplay.textContent = "Venture Capital injection received! Go burn some tokens.";
    updateUI();
});

spinButton.addEventListener('click', spin);

// Initialize
initReels();
updateUI();
