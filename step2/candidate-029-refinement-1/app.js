const SYMBOLS = ['🤖', '🧠', '⚡', '📉', '💸', '🦄', '💩'];
const SPIN_COST = 10;
const INITIAL_TOKENS = 100;

let state = {
    tokens: INITIAL_TOKENS,
    valuation: 0,
    isSpinning: false,
};

const UI = {
    reels: [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ],
    spinBtn: document.getElementById('spin-btn'),
    resetBtn: document.getElementById('reset-btn'),
    tokenCount: document.getElementById('token-count'),
    valuation: document.getElementById('valuation'),
    logs: document.getElementById('logs')
};

const FLAVOR_TEXT = {
    start: [
        "Inference started. Generating hallucinations...",
        "Scraping the open web without permission...",
        "Burning VC cash to warm the data center...",
        "Overclocking H100s. Room temperature rising...",
        "Applying RLHF (Really Liked His Funding)..."
    ],
    win: [
        "SOTA achieved. Raising Series B at 100x ARR.",
        "Model successfully convinced a VC it is sentient.",
        "Emergent profit detected in latent space.",
        "Benchmark scores faked successfully. Valuation up!",
        "Acqui-hired by a tech giant. Everyone wins (except users)."
    ],
    loss: [
        "Model collapse. Outputting pure gibberish.",
        "Context window exceeded by reality.",
        "Stochastic parrot failed to predict market trends.",
        "Safety filter triggered: No profit found in this prompt.",
        "GPU debt interest higher than revenue."
    ]
};

function addLog(msg, type = 'default') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.textContent = `[${time}] ${msg}`;
    UI.logs.prepend(entry);
    
    if (UI.logs.childNodes.length > 30) {
        UI.logs.removeChild(UI.logs.lastChild);
    }
}

function updateUI() {
    UI.tokenCount.textContent = state.tokens;
    UI.valuation.textContent = `$${state.valuation.toLocaleString()}M`;
    UI.spinBtn.disabled = state.tokens < SPIN_COST || state.isSpinning;
    
    if (state.tokens < SPIN_COST && !state.isSpinning) {
        UI.resetBtn.classList.remove('hidden');
        UI.spinBtn.textContent = "INSUFFICIENT COMPUTE";
    } else {
        UI.resetBtn.classList.add('hidden');
        UI.spinBtn.textContent = `RUN INFERENCE (${SPIN_COST} TOKENS)`;
    }
}

// Initialize reel strips
function initReels() {
    UI.reels.forEach(reel => {
        const strip = reel.querySelector('.reel-strip');
        strip.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const div = document.createElement('div');
            div.className = 'reel-symbol';
            div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(div);
        }
    });
}

async function spin() {
    if (state.tokens < SPIN_COST || state.isSpinning) return;

    state.isSpinning = true;
    state.tokens -= SPIN_COST;
    
    UI.reels.forEach(r => r.classList.remove('win-highlight'));
    updateUI();

    const randomMsg = FLAVOR_TEXT.start[Math.floor(Math.random() * FLAVOR_TEXT.start.length)];
    addLog(randomMsg, 'info');

    const results = [
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length)
    ];

    const spinPromises = UI.reels.map((reel, i) => {
        return animateReel(reel, results[i], i);
    });

    await Promise.all(spinPromises);

    processResults(results.map(idx => SYMBOLS[idx]));
    
    state.isSpinning = false;
    updateUI();
}

function animateReel(reel, targetIdx, reelIdx) {
    return new Promise(resolve => {
        const strip = reel.querySelector('.reel-strip');
        const symbolHeight = 100;
        const totalSymbols = strip.children.length;
        
        strip.children[totalSymbols - 1].textContent = SYMBOLS[targetIdx];
        
        const targetPos = -(totalSymbols - 1) * symbolHeight;
        const duration = 1500 + (reelIdx * 400);

        strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        strip.style.transform = `translateY(${targetPos}px)`;

        setTimeout(() => {
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            strip.children[0].textContent = SYMBOLS[targetIdx];
            resolve();
        }, duration);
    });
}

function processResults(symbols) {
    const [s1, s2, s3] = symbols;
    let winTokens = 0;
    let valBoost = 0;

    if (s1 === s2 && s2 === s3) {
        UI.reels.forEach(r => r.classList.add('win-highlight'));
        
        if (s1 === '🦄') {
            winTokens = 500;
            valBoost = 1000;
            addLog("JACKPOT: UNICORN STATUS ACHIEVED! EXIT LIQUIDITY SECURED!", 'win');
        } else if (s1 === '💩') {
            winTokens = 0;
            valBoost = -state.valuation;
            addLog("CRITICAL FAILURE: MODEL COLLAPSE. VALUATION WIPED.", 'loss');
        } else if (s1 === '📉') {
            winTokens = 5;
            valBoost = -50;
            addLog("Bear market detected. Cost cutting engaged.", 'loss');
        } else {
            winTokens = 100;
            valBoost = 250;
            addLog(FLAVOR_TEXT.win[Math.floor(Math.random() * FLAVOR_TEXT.win.length)], 'win');
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        winTokens = 20;
        valBoost = 25;
        if (s1 === s2) { UI.reels[0].classList.add('win-highlight'); UI.reels[1].classList.add('win-highlight'); }
        else if (s2 === s3) { UI.reels[1].classList.add('win-highlight'); UI.reels[2].classList.add('win-highlight'); }
        else { UI.reels[0].classList.add('win-highlight'); UI.reels[2].classList.add('win-highlight'); }
        
        addLog("Partial convergence. Optimizing weights...", 'win');
    } else {
        valBoost = -5;
        addLog(FLAVOR_TEXT.loss[Math.floor(Math.random() * FLAVOR_TEXT.loss.length)], 'default');
    }

    state.tokens += winTokens;
    state.valuation = Math.max(0, state.valuation + valBoost);
}

function reset() {
    state.tokens = INITIAL_TOKENS;
    state.valuation = 0;
    addLog("Pivot successful! Seed funding round closed.", 'info');
    updateUI();
}

UI.spinBtn.addEventListener('click', spin);
UI.resetBtn.addEventListener('click', reset);

initReels();
updateUI();
