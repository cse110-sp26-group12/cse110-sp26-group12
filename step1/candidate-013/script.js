const SYMBOLS = [
    { icon: '🤖', name: 'AGI', multiplier: 100 },
    { icon: '🧠', name: 'Neural Net', multiplier: 20 },
    { icon: '🖼️', name: 'Deepfake', multiplier: 10 },
    { icon: '💬', name: 'Chatbot', multiplier: 5 },
    { icon: '📉', name: 'Token Crash', multiplier: 0 }
];

const HYPE_PHRASES = [
    "Scraping personal data without consent...",
    "Hallucinating a sustainable business model...",
    "Pivoting to 'Agentic' workflows for VC funding...",
    "Burning through H100 GPU clusters...",
    "Optimizing weights for maximum user retention...",
    "Discarding privacy policy for training data...",
    "Implementing 'AI' into a simple spreadsheet...",
    "Raising Series D at a $50B valuation with zero revenue...",
    "Calculating why we need $7 Trillion...",
    "Replacing 10 developers with one buggy prompt...",
    "Fine-tuning the model to say 'I am an AI' repeatedly...",
    "Injecting venture capital directly into the cooling system...",
    "Scaling to infinite compute (credit card limit reached)..."
];

// Game State
let credits = 1000;
let isSpinning = false;

// DOM Elements
const creditDisplay = document.getElementById('credit-display');
const gpuDisplay = document.getElementById('gpu-display');
const betInput = document.getElementById('bet-input');
const spinButton = document.getElementById('spin-button');
const autoSpinCheckbox = document.getElementById('auto-spin');
const logOutput = document.getElementById('log-output');
const reels = [
    document.getElementById('reel-1').querySelector('.reel-strip'),
    document.getElementById('reel-2').querySelector('.reel-strip'),
    document.getElementById('reel-3').querySelector('.reel-strip')
];

// Initialize Reels
function init() {
    reels.forEach(reel => {
        populateReel(reel);
    });
    updateUI();
}

function populateReel(reel) {
    reel.innerHTML = '';
    // Create a strip of 20 random symbols for the "spin" look
    for (let i = 0; i < 30; i++) {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.innerHTML = `${symbol.icon}<span>${symbol.name}</span>`;
        reel.appendChild(symbolDiv);
    }
}

function updateUI() {
    creditDisplay.textContent = Math.floor(credits);
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logOutput.prepend(p);
    if (logOutput.childNodes.length > 20) {
        logOutput.removeChild(logOutput.lastChild);
    }
}

async function runInference() {
    const bet = parseInt(betInput.value);
    
    if (credits < bet) {
        addLog("CRITICAL ERROR: Insufficient compute credits. Please sell more data.");
        return;
    }

    if (isSpinning) return;

    // Deduct credits
    credits -= bet;
    isSpinning = true;
    spinButton.disabled = true;
    updateUI();

    addLog(HYPE_PHRASES[Math.floor(Math.random() * HYPE_PHRASES.length)]);
    gpuDisplay.textContent = "99%";

    // Determine results ahead of time
    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Animation logic
    const animationDuration = 2000; // 2 seconds
    
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        // Add a slight delay for each reel
        reel.style.animationDelay = `${index * 0.2}s`;
    });

    setTimeout(() => {
        reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            
            // Set the final symbol at the top
            const finalSymbol = results[index];
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.innerHTML = `${finalSymbol.icon}<span>${finalSymbol.name}</span>`;
            
            // Clear and set just the result (simplified for vanilla)
            reel.innerHTML = '';
            reel.appendChild(symbolDiv);
        });

        checkWin(results, bet);
        isSpinning = false;
        spinButton.disabled = false;
        gpuDisplay.textContent = "0%";

        if (autoSpinCheckbox.checked && credits >= bet) {
            setTimeout(runInference, 1000);
        }
    }, animationDuration);
}

function checkWin(results, bet) {
    const s1 = results[0].name;
    const s2 = results[1].name;
    const s3 = results[2].name;

    if (s1 === s2 && s2 === s3) {
        const winAmount = bet * results[0].multiplier;
        credits += winAmount;
        addLog(`SUCCESS: Found emergent behavior! Gained ${winAmount} credits.`);
        highlightWin();
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        const smallWin = bet * 2;
        credits += smallWin;
        addLog(`NOTICE: Local minima reached. Gained ${smallWin} credits.`);
    } else {
        addLog("FAILURE: Hallucination detected. Compute wasted.");
    }
    updateUI();
}

function highlightWin() {
    const winLine = document.querySelector('.win-line');
    winLine.style.display = 'block';
    setTimeout(() => {
        winLine.style.display = 'none';
    }, 1000);
}

spinButton.addEventListener('click', runInference);

init();
