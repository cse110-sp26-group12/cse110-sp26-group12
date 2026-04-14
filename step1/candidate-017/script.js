const SYMBOLS = [
    { char: '🧠', label: 'AGI' },
    { char: '🤖', label: 'BOT' },
    { char: '📈', label: 'DATA' },
    { char: '🫠', label: 'ERR' },
    { char: '🔋', label: 'PWR' },
    { char: '📡', label: 'SYNC' }
];

const REWARDS = {
    '🧠🧠🧠': 500,
    '🤖🤖🤖': 100,
    '📈📈📈': 50,
    '🫠🫠🫠': 10
};

const MESSAGES = [
    "OPTIMIZING HYPERPARAMETERS...",
    "CLEANING TRAINING DATA...",
    "SCRAPING REDDIT...",
    "CONVINCING INVESTORS...",
    "MINIMIZING LOSS FUNCTION...",
    "HALLUCINATING REALITY...",
    "WAITING FOR GPU CLUSTER...",
    "REDUCING LEARNING RATE...",
    "APPLYING DROPOUT...",
    "QUANTIZING WEIGHTS..."
];

let tokens = 1000;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const statusDisplay = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels with random symbols
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Create 20 symbols for initial padding
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const el = createSymbolElement(symbol);
            strip.appendChild(el);
        }
    });
}

function createSymbolElement(symbol) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.innerHTML = `<span>${symbol.char}</span><span class="symbol-label">${symbol.label}</span>`;
    return div;
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    updateDisplay();
    spinButton.disabled = true;
    statusDisplay.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    const results = [];
    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            results.push(symbol.char);

            // Create a long strip to animate
            const newSymbols = [];
            for (let i = 0; i < 30 + (index * 10); i++) {
                newSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            }
            newSymbols[newSymbols.length - 1] = symbol; // Set the result symbol

            // Prepend new symbols
            newSymbols.reverse().forEach(s => {
                strip.prepend(createSymbolElement(s));
            });

            // Calculate target offset
            const symbolHeight = 150;
            const targetOffset = (newSymbols.length - 1) * symbolHeight;
            
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${targetOffset}px)`;
            
            // Trigger animation
            setTimeout(() => {
                strip.style.transition = `transform ${2 + index}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.transform = 'translateY(0)';
                setTimeout(() => resolve(), (2 + index) * 1000);
            }, 50);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    spinButton.disabled = tokens < 10;
}

function checkWin(results) {
    const combination = results.join('');
    const reward = REWARDS[combination] || 0;

    if (reward > 0) {
        tokens += reward;
        statusDisplay.textContent = `SUCCESS: ${reward} TOKENS MINTED!`;
        statusDisplay.style.color = 'var(--secondary-color)';
        triggerWinEffect();
    } else {
        statusDisplay.textContent = "INFERENCE FAILED - NO REWARD";
        statusDisplay.style.color = 'var(--primary-color)';
    }
    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
}

function triggerWinEffect() {
    document.body.style.backgroundColor = '#1a001a';
    setTimeout(() => {
        document.body.style.backgroundColor = 'var(--bg-color)';
    }, 200);
}

function resetCluster() {
    tokens = 1000;
    statusDisplay.textContent = "CLUSTER RESET - READY FOR INFERENCE";
    updateDisplay();
    spinButton.disabled = false;
    initReels();
}

spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetCluster);

initReels();
updateDisplay();
