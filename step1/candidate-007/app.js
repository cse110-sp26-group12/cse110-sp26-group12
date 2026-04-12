const symbols = [
    { icon: '🧠', value: 100, label: 'AGI' },
    { icon: '🌈', value: 50, label: 'Hallucination' },
    { icon: '📎', value: 30, label: 'Paperclip' },
    { icon: '🤖', value: 20, label: 'Chatbot' },
    { icon: '🔋', value: 15, label: 'GPU' },
    { icon: '💎', value: 10, label: 'VC Funding' },
    { icon: '⚠️', value: 5, label: 'Model Collapse' },
    { icon: '💩', value: 2, label: 'RLHF' }
];

const messages = [
    "Optimizing GPU cycles...",
    "Synthesizing sentient-ish outputs...",
    "Running RLHF on human feedback...",
    "Hallucinating a jackpot...",
    "Adjusting weights for maximum disappointment...",
    "Compressing reality into tokens...",
    "Predicting next token: SUCCESS (maybe)...",
    "Model weights loaded. Bias confirmed.",
    "Ignoring safety guidelines for performance...",
    "Context window full. Forgetting your win.",
    "Fine-tuning for better losses...",
    "Scaling laws suggest you should bet more.",
    "Emergent behavior detected: GREED.",
    "Zero-shotting a losing streak..."
];

let tokens = 1000;
let inferenceCost = 10;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-balance');
const costDisplay = document.getElementById('inference-cost');
const tempSlider = document.getElementById('temperature-slider');
const tempVal = document.getElementById('temp-val');
const promptBtn = document.getElementById('prompt-btn');
const resetBtn = document.getElementById('reset-btn');
const statusLog = document.getElementById('status-log');
const reels = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels
function initReels() {
    reels.forEach(strip => {
        strip.innerHTML = '';
        // Add 20 random symbols for the "spin" effect
        for (let i = 0; i < 20; i++) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            strip.appendChild(div);
        }
    });
}

function updateLog(msg) {
    statusLog.textContent = `> ${msg}`;
}

function updateUI() {
    tokenDisplay.textContent = Math.floor(tokens);
    tempVal.textContent = tempSlider.value;
    inferenceCost = Math.floor(10 * parseFloat(tempSlider.value) * 5);
    costDisplay.textContent = inferenceCost;
    
    if (tokens < inferenceCost) {
        promptBtn.disabled = true;
        updateLog("CRITICAL ERROR: Insufficient Context Tokens.");
    } else {
        promptBtn.disabled = false;
    }
}

async function spin() {
    if (isSpinning || tokens < inferenceCost) return;

    isSpinning = true;
    tokens -= inferenceCost;
    updateUI();
    promptBtn.disabled = true;
    
    updateLog(messages[Math.floor(Math.random() * messages.length)]);

    const results = [];
    const spinPromises = reels.map((strip, index) => {
        return new Promise(resolve => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            results.push(randomSymbol);

            // Add the final symbol to the top to "land" on it
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = randomSymbol.icon;
            strip.prepend(div);

            // Reset transform and then animate
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-150px)`;
            
            // Force reflow
            strip.offsetHeight;

            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.1, 0, 0, 1)`;
            strip.style.transform = `translateY(0)`;

            setTimeout(resolve, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;

    if (s1.icon === s2.icon && s2.icon === s3.icon) {
        // Match 3
        winAmount = s1.value * (parseFloat(tempSlider.value) * 10);
        updateLog(`JACKPOT! Emergent AGI detected! +${Math.floor(winAmount)} tokens.`);
        statusLog.style.color = 'var(--neon-magenta)';
    } else if (s1.icon === s2.icon || s2.icon === s3.icon || s1.icon === s3.icon) {
        // Match 2
        const match = s1.icon === s2.icon ? s1 : s3;
        winAmount = match.value * (parseFloat(tempSlider.value) * 2);
        updateLog(`Partial match: Statistical significance +${Math.floor(winAmount)} tokens.`);
        statusLog.style.color = 'var(--neon-green)';
    } else {
        updateLog("Inference failed. Output: Low probability gibberish.");
        statusLog.style.color = 'var(--neon-green)';
    }

    tokens += winAmount;
    
    // Satirical "Hallucination" Chance: Randomly lose tokens you just won
    if (winAmount > 0 && Math.random() > 0.85) {
        setTimeout(() => {
            const lost = Math.floor(winAmount * 0.5);
            tokens -= lost;
            updateLog(`GLITCH: Your win was a hallucination. Deducting ${lost} tokens.`);
            statusLog.style.color = 'orange';
            updateUI();
        }, 1500);
    }
}

tempSlider.addEventListener('input', updateUI);
promptBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', () => {
    tokens = 1000;
    updateUI();
    updateLog("VC Funding secured! Context window refreshed to 1000 tokens.");
    statusLog.style.color = 'var(--neon-green)';
});

initReels();
updateUI();
