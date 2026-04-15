/**
 * AGI-LOT v2.1.0
 * NeuralGrift VC Simulator - Refining the Grift.
 */

const SYMBOLS = [
    { icon: '🤖', name: 'Agent', weight: 12, value: 50 },
    { icon: '🧠', name: 'Neural Net', weight: 10, value: 60 },
    { icon: '⚡', name: 'Compute', weight: 8, value: 80 },
    { icon: '💸', name: 'Funding', weight: 6, value: 150 },
    { icon: '📈', name: 'Growth', weight: 5, value: 200 },
    { icon: '🦄', name: 'Unicorn', weight: 2, value: 1000 },
    { icon: '📉', name: 'Burn Rate', weight: 4, value: -100 },
    { icon: '💩', name: 'Hallucination', weight: 3, value: -500 }
];

const CONFIG = {
    SPIN_COST: 10,
    INITIAL_TOKENS: 100,
    REEL_SYMBOLS_COUNT: 30,
    BASE_SPIN_DURATION: 1200,
    REEL_DELAY: 250,
    MILESTONES: [
        { val: 0, label: "STEALTH_MODE" },
        { val: 1000, label: "SEED_ROUND" },
        { val: 5000, label: "SERIES_A" },
        { val: 25000, label: "SERIES_B" },
        { val: 100000, label: "UNICORN_STATUS" },
        { val: 500000, label: "SOTA_ACHIEVED" }
    ]
};

const FLAVOR_TEXT = {
    start: [
        "Inference started. Generating hallucinations...",
        "Scraping the open web without permission...",
        "Burning VC cash to warm the data center...",
        "Applying RLHF (Really Liked His Funding)...",
        "Tokenizing the human experience...",
        "Optimizing loss function for shareholder value...",
        "Initializing latent space projection..."
    ],
    jackpot: [
        "SOTA ACHIEVED. Raising Series B at 100x ARR.",
        "Model successfully convinced a VC it is sentient.",
        "Emergent profit detected in latent space!",
        "Acqui-hired by Tech Giant. Everyone wins (except users).",
        "Benchmark scores faked successfully. Valuation up!"
    ],
    loss: [
        "Model collapse. Outputting pure gibberish.",
        "Context window exceeded by reality.",
        "Stochastic parrot failed to predict market trends.",
        "Safety filter triggered: No profit found.",
        "GPU debt interest higher than revenue.",
        "Chief Scientist left to start a competing stealth startup."
    ]
};

// --- STATE ---
let state = {
    tokens: CONFIG.INITIAL_TOKENS,
    valuation: 0,
    isSpinning: false,
    maxValuation: 0
};

// --- UI HELPERS ---
const UI = {
    onboarding: document.getElementById('onboarding'),
    startBtn: document.getElementById('start-btn'),
    app: document.getElementById('app'),
    machine: document.getElementById('machine-body'),
    reels: [
        { el: document.getElementById('reel-0'), strip: null },
        { el: document.getElementById('reel-1'), strip: null },
        { el: document.getElementById('reel-2'), strip: null }
    ],
    spinBtn: document.getElementById('spin-btn'),
    resetBtn: document.getElementById('reset-btn'),
    tokenCount: document.getElementById('token-count'),
    valuation: document.getElementById('valuation'),
    milestoneText: document.getElementById('milestone-text'),
    milestonePercent: document.getElementById('milestone-percent'),
    milestoneProgress: document.getElementById('milestone-progress'),
    logs: document.getElementById('logs'),
    status: document.getElementById('system-status')
};

// --- INIT ---
function init() {
    UI.reels.forEach(reel => {
        reel.strip = reel.el.querySelector('.reel-strip');
        fillReelStrip(reel.strip);
    });

    UI.spinBtn.addEventListener('click', handleSpin);
    UI.resetBtn.addEventListener('click', handleReset);
    UI.startBtn.addEventListener('click', () => {
        UI.onboarding.classList.add('hidden');
        addLog("Runway initialized. Good luck, Founder.", 'system');
    });

    updateDisplay();
}

function fillReelStrip(stripEl, finalIcon = null) {
    stripEl.innerHTML = '';
    const icons = SYMBOLS.map(s => s.icon);
    
    for (let i = 0; i < CONFIG.REEL_SYMBOLS_COUNT; i++) {
        const div = document.createElement('div');
        div.className = 'reel-symbol';
        div.textContent = (i === 0 && finalIcon) ? finalIcon : icons[Math.floor(Math.random() * icons.length)];
        stripEl.appendChild(div);
    }
}

// --- LOGIC ---
async function handleSpin() {
    if (state.isSpinning || state.tokens < CONFIG.SPIN_COST) return;

    state.isSpinning = true;
    state.tokens -= CONFIG.SPIN_COST;
    
    // UI Reset
    UI.machine.classList.remove('win-flash');
    UI.reels.forEach(r => r.el.classList.remove('highlight', 'critical'));
    UI.status.textContent = "INFERRING...";
    UI.status.className = 'status-dot pulse';
    
    updateDisplay();
    addLog(getRandom(FLAVOR_TEXT.start), 'info');

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const animations = UI.reels.map((reel, i) => animateReel(reel, results[i], i));
    
    await Promise.all(animations);
    await processOutcome(results);
    
    state.isSpinning = false;
    updateDisplay();
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

function animateReel(reel, targetSymbol, index) {
    return new Promise(resolve => {
        const strip = reel.strip;
        const duration = CONFIG.BASE_SPIN_DURATION + (index * CONFIG.REEL_DELAY);
        const symHeight = reel.el.offsetHeight;
        
        // Update the last symbol to the target
        strip.lastElementChild.textContent = targetSymbol.icon;

        const targetTranslate = -(CONFIG.REEL_SYMBOLS_COUNT - 1) * symHeight;
        
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.25, 1.05)`;
        strip.style.transform = `translateY(${targetTranslate}px)`;

        setTimeout(() => {
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            strip.firstElementChild.textContent = targetSymbol.icon;
            resolve();
        }, duration);
    });
}

async function processOutcome(results) {
    const icons = results.map(r => r.icon);
    const [s1, s2, s3] = icons;

    let winTokens = 0;
    let valBoost = 0;
    let type = 'info';
    let message = "";

    // 3 OF A KIND
    if (s1 === s2 && s2 === s3) {
        const sym = results[0];
        UI.machine.classList.add('win-flash');
        UI.reels.forEach(r => r.el.classList.add('highlight'));
        
        if (s1 === '🦄') {
            winTokens = 1000;
            valBoost = 50000;
            message = "EXIT LIQUIDITY ATTAINED! You are the 0.1% of hallucinations.";
            type = 'win';
        } else if (s1 === '💩' || s1 === '📉') {
            winTokens = 0;
            valBoost = -Math.floor(state.valuation * 0.4) - 1000;
            UI.reels.forEach(r => { r.el.classList.remove('highlight'); r.el.classList.add('critical'); });
            message = s1 === '💩' ? "TOTAL MODEL COLLAPSE. The board is panic-selling." : "MARKET RECESSION. Burn rate exceeded funding.";
            type = 'loss';
        } else {
            winTokens = 250;
            valBoost = sym.value * 15;
            message = getRandom(FLAVOR_TEXT.jackpot);
            type = 'win';
        }
        UI.app.classList.add('shake');
        setTimeout(() => UI.app.classList.remove('shake'), 500);
    } 
    // 2 OF A KIND
    else if (s1 === s2 || s2 === s3 || s1 === s3) {
        const match = (s1 === s2) ? results[0] : results[1];
        winTokens = 20;
        valBoost = Math.max(50, match.value * 2);
        message = "Partial convergence. Investors are cautiously optimistic.";
        type = 'win';
        
        if (s1 === s2) { UI.reels[0].el.classList.add('highlight'); UI.reels[1].el.classList.add('highlight'); }
        else if (s2 === s3) { UI.reels[1].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
        else { UI.reels[0].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
    }
    // LOSS
    else {
        valBoost = -50;
        message = getRandom(FLAVOR_TEXT.loss);
        type = 'loss';
    }

    await sleep(300);
    
    if (winTokens > 0) animateValue(UI.tokenCount, state.tokens, state.tokens + winTokens, 800);
    state.tokens += winTokens;

    const newValuation = Math.max(0, state.valuation + valBoost);
    animateValue(UI.valuation, state.valuation, newValuation, 1000);
    state.valuation = newValuation;
    state.maxValuation = Math.max(state.maxValuation, state.valuation);

    updateMilestone();
    addLog(message, type);
}

// --- UTILS ---
function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        el.textContent = current.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.classList.remove('inc', 'dec');
            void el.offsetWidth;
            el.classList.add(end > start ? 'inc' : 'dec');
            setTimeout(() => el.classList.remove('inc', 'dec'), 1000);
        }
    };
    window.requestAnimationFrame(step);
}

function updateDisplay() {
    UI.tokenCount.textContent = state.tokens;
    UI.valuation.textContent = state.valuation.toLocaleString();
    
    const canSpin = state.tokens >= CONFIG.SPIN_COST && !state.isSpinning;
    UI.spinBtn.disabled = !canSpin;
    
    if (state.tokens < CONFIG.SPIN_COST && !state.isSpinning) {
        UI.spinBtn.querySelector('.btn-text').textContent = "OUT OF COMPUTE";
        UI.resetBtn.classList.remove('hidden');
        UI.status.textContent = "HALTED";
        UI.status.className = 'status-dot idle';
    } else if (!state.isSpinning) {
        UI.spinBtn.querySelector('.btn-text').textContent = "RUN INFERENCE";
        UI.resetBtn.classList.add('hidden');
        UI.status.textContent = "LIVE";
        UI.status.className = 'status-dot live';
    }
}

function updateMilestone() {
    let current = CONFIG.MILESTONES[0];
    let next = CONFIG.MILESTONES[1];
    
    for (let i = 0; i < CONFIG.MILESTONES.length; i++) {
        if (state.valuation >= CONFIG.MILESTONES[i].val) {
            current = CONFIG.MILESTONES[i];
            next = CONFIG.MILESTONES[i+1] || current;
        }
    }

    UI.milestoneText.textContent = `STAGE: ${current.label}`;
    
    const range = next.val - current.val;
    const progress = range === 0 ? 100 : Math.min(100, ((state.valuation - current.val) / range) * 100);
    UI.milestoneProgress.style.width = `${progress}%`;
    UI.milestonePercent.textContent = `${Math.floor(progress)}%`;
}

function addLog(msg, type = 'default') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.textContent = `[${time}] ${msg}`;
    UI.logs.prepend(entry);
    
    if (UI.logs.childNodes.length > 20) {
        UI.logs.removeChild(UI.logs.lastChild);
    }
}

function handleReset() {
    state.tokens = CONFIG.INITIAL_TOKENS;
    state.valuation = 0;
    addLog("Pivot successful! New seed funding secured. Don't waste it.", 'system');
    updateDisplay();
    updateMilestone();
}

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Initialize
init();
