// Configuration
const SYMBOLS = ['🤖', '🌩️', '🦄', '📉', '🧠'];
const TOKEN_COST = 10;
const PAYOUTS = {
    '🧠': 500, // AGI
    '🤖': 50,  // LLM
    '🌩️': 25,  // GPU Cloud
    '🦄': 20,  // Unicorn
    '📉': -20  // Hallucination (Special: Deduct)
};

const LOG_MESSAGES = [
    "Synthesizing mediocre code...",
    "Hallucinating factual data...",
    "Pivoting to Web4...",
    "Raising Series A from a toaster...",
    "Calculating GPU thermal debt...",
    "Scraping the internet for scraps...",
    "Finetuning for toxicity...",
    "Optimizing for maximum hype...",
    "Model collapsing. Please wait...",
    "Selling user data to hedge funds..."
];

// State
let tokens = 1000;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const statusLog = document.getElementById('status-log');
const logContent = document.getElementById('log-content');
const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// Initialize
function init() {
    spinBtn.addEventListener('click', spin);
    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.innerText = tokens;
    if (tokens < TOKEN_COST) {
        spinBtn.disabled = true;
        spinBtn.innerText = "OUT OF COMPUTE";
    }
}

function addLog(msg) {
    logContent.innerText = `> ${msg}`;
}

async function spin() {
    if (isSpinning || tokens < TOKEN_COST) return;

    isSpinning = true;
    tokens -= TOKEN_COST;
    updateDisplay();
    
    statusLog.innerText = "TRAINING...";
    spinBtn.disabled = true;

    // Start Animation
    reels.forEach(reel => reel.classList.add('spinning'));
    
    // Cycle random symbols while spinning
    const spinInterval = setInterval(() => {
        reels.forEach(reel => {
            reel.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        });
        addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
    }, 100);

    // Stop reels one by one
    await new Promise(r => setTimeout(r, 1500));
    clearInterval(spinInterval);

    const results = reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    
    // Animate stopping
    for(let i=0; i<3; i++) {
        await new Promise(r => setTimeout(r, 300));
        reels[i].classList.remove('spinning');
        reels[i].innerText = results[i];
    }

    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
}

function checkWin(results) {
    const isWin = results[0] === results[1] && results[1] === results[2];
    
    if (isWin) {
        const winSymbol = results[0];
        const payout = PAYOUTS[winSymbol];
        
        if (winSymbol === '📉') {
            tokens += payout; // This is a loss (negative payout)
            statusLog.innerText = "CRITICAL FAILURE";
            addLog("HALLUCINATION DETECTED. ASSETS LIQUIDATED.");
        } else {
            tokens += payout;
            statusLog.innerText = winSymbol === '🧠' ? "AGI ACHIEVED" : "VALUE GENERATED";
            addLog(`SYNERGY FOUND! +${payout} TOKENS.`);
        }
    } else {
        // Random chance for "Hallucination" to just hurt you anyway
        if (results.includes('📉')) {
            const hallucinationCount = results.filter(s => s === '📉').length;
            const loss = hallucinationCount * 5;
            tokens -= loss;
            statusLog.innerText = "DRIFT DETECTED";
            addLog(`MINOR HALLUCINATION. LOST ${loss} TOKENS.`);
        } else {
            statusLog.innerText = "INSUFFICIENT DATA";
            addLog("SPENT 10 TOKENS ON NOTHING. VERY REALISTIC.");
        }
    }

    updateDisplay();
}

init();
