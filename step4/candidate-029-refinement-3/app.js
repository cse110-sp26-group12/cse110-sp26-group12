/**
 * AGI-LOT v2.1.0
 * The definitive Venture Capital / GPU burning simulator.
 */

// --- CONFIGURATION ---
const SYMBOLS = [
    { icon: '🤖', name: 'Model', weight: 12 },
    { icon: '🧠', name: 'Neural Net', weight: 10 },
    { icon: '⚡', name: 'Compute', weight: 8 },
    { icon: '💸', name: 'Funding', weight: 6 },
    { icon: '📈', name: 'Growth', weight: 5 },
    { icon: '🦄', name: 'Unicorn', weight: 2 },
    { icon: '📉', name: 'Burn Rate', weight: 4 },
    { icon: '💩', name: 'Hallucination', weight: 3 }
];

const CONFIG = {
    SPIN_COST: 10,
    INITIAL_TOKENS: 100,
    REEL_SYMBOLS_COUNT: 40,
    SYMBOL_HEIGHT: 110, // Adjusted via media query in CSS, but base is 110
    BASE_SPIN_DURATION: 1500,
    REEL_DELAY: 300,
    MILESTONES: [
        { val: 0, label: "STEALTH_MODE" },
        { val: 500, label: "SEED_ROUND" },
        { val: 2000, label: "SERIES_A" },
        { val: 5000, label: "SERIES_B" },
        { val: 10000, label: "UNICORN_STATUS" },
        { val: 50000, label: "SOTA_ACHIEVED" }
    ]
};

const FLAVOR_TEXT = {
    start: [
        "Inference started. Generating hallucinations...",
        "Scraping the open web without permission...",
        "Burning VC cash to warm the data center...",
        "Applying RLHF (Really Liked His Funding)...",
        "Tokenizing the human experience...",
        "Optimizing loss function for shareholder value..."
    ],
    jackpot: [
        "SOTA ACHIEVED. Raising Series B at 100x ARR.",
        "Model successfully convinced a VC it is sentient.",
        "Emergent profit detected in latent space!",
        "Acqui-hired by Tech Giant. Everyone wins (except users)."
    ],
    win: [
        "Benchmark scores faked successfully. Valuation up!",
        "Partial convergence achieved. Optimizing weights...",
        "Small funding round closed. Runway extended.",
        "Hired three prompt engineers. Productivity flatlined."
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

// --- STATE MANAGEMENT ---
let state = {
    tokens: CONFIG.INITIAL_TOKENS,
    valuation: 0,
    isSpinning: false,
    hasStarted: false
};

// --- UI ELEMENTS ---
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
    milestoneProgress: document.getElementById('milestone-progress'),
    logs: document.getElementById('logs'),
    status: document.getElementById('system-status')
};

// --- INITIALIZATION ---
function init() {
    // Dynamic Symbol Height Detection
    const updateSymbolHeight = () => {
        const firstReel = document.querySelector('.reel');
        if (firstReel) CONFIG.SYMBOL_HEIGHT = firstReel.offsetHeight;
    };
    window.addEventListener('resize', updateSymbolHeight);
    updateSymbolHeight();

    UI.reels.forEach((reel) => {
        reel.strip = reel.el.querySelector('.reel-strip');
        fillReelStrip(reel.strip);
    });

    UI.spinBtn.addEventListener('click', handleSpin);
    UI.resetBtn.addEventListener('click', handleReset);
    UI.startBtn.addEventListener('click', () => {
        state.hasStarted = true;
        UI.onboarding.classList.add('hidden');
        addLog("Runway initialized. Good luck, Founder.", 'system');
    });
    
    updateDisplay(true);
}

function fillReelStrip(stripEl, finalIcon = null) {
    stripEl.innerHTML = '';
    const pool = [];
    SYMBOLS.forEach(s => {
        for (let i = 0; i < s.weight; i++) pool.push(s.icon);
    });

    for (let i = 0; i < CONFIG.REEL_SYMBOLS_COUNT; i++) {
        const div = document.createElement('div');
        div.className = 'reel-symbol';
        if (i === 0 && finalIcon) {
            div.textContent = finalIcon;
        } else {
            div.textContent = pool[Math.floor(Math.random() * pool.length)];
        }
        stripEl.appendChild(div);
    }
}

// --- CORE LOGIC ---
async function handleSpin() {
    if (state.isSpinning || state.tokens < CONFIG.SPIN_COST) return;

    state.isSpinning = true;
    state.tokens -= CONFIG.SPIN_COST;
    
    UI.machine.classList.remove('win-flash');
    UI.reels.forEach(r => r.el.classList.remove('highlight', 'critical'));
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
    const pool = [];
    SYMBOLS.forEach(s => {
        for (let i = 0; i < s.weight; i++) pool.push(s);
    });
    return pool[Math.floor(Math.random() * pool.length)];
}

function animateReel(reel, targetSymbol, index) {
    return new Promise(resolve => {
        const strip = reel.strip;
        const duration = CONFIG.BASE_SPIN_DURATION + (index * CONFIG.REEL_DELAY);
        
        // Ensure symbol height is correct for current view
        const symHeight = reel.el.offsetHeight;
        
        // Prepare the strip
        const lastSymbolEl = strip.children[CONFIG.REEL_SYMBOLS_COUNT - 1];
        lastSymbolEl.textContent = targetSymbol.icon;

        const targetTranslate = -(CONFIG.REEL_SYMBOLS_COUNT - 1) * symHeight;
        
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.25, 1.15)`;
        strip.style.transform = `translateY(${targetTranslate}px)`;

        setTimeout(() => {
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            strip.children[0].textContent = targetSymbol.icon;
            resolve();
        }, duration);
    });
}

async function processOutcome(results) {
    const icons = results.map(r => r.icon);
    const [s1, s2, s3] = icons;

    let winTokens = 0;
    let valBoost = 0;
    let type = 'default';
    let message = "";

    if (s1 === s2 && s2 === s3) {
        UI.machine.classList.add('win-flash');
        UI.reels.forEach(r => r.el.classList.add('highlight'));
        UI.app.classList.add('shake');
        setTimeout(() => UI.app.classList.remove('shake'), 500);

        if (s1 === '🦄') {
            winTokens = 500;
            valBoost = 5000;
            message = "EXIT LIQUIDITY ATTAINED! You are the 0.1% of hallucinations.";
        } else if (s1 === '💩') {
            winTokens = 0;
            valBoost = -Math.floor(state.valuation * 0.5);
            UI.reels.forEach(r => {
                r.el.classList.remove('highlight');
                r.el.classList.add('critical');
            });
            message = "TOTAL MODEL COLLAPSE. The board is panic-selling.";
        } else if (s1 === '📉') {
            winTokens = 10;
            valBoost = -200;
            message = "Market downturn. Pivoting to 'Enterprise GenAI Middleware'.";
        } else {
            winTokens = 200;
            valBoost = 1000;
            message = getRandom(FLAVOR_TEXT.jackpot);
        }
        type = (s1 === '💩' || s1 === '📉') ? 'loss' : 'win';
    } 
    else if (s1 === s2 || s2 === s3 || s1 === s3) {
        winTokens = 25;
        valBoost = 150;
        message = "Partial convergence. Investors are cautiously optimistic.";
        type = 'win';
        
        if (s1 === s2) { UI.reels[0].el.classList.add('highlight'); UI.reels[1].el.classList.add('highlight'); }
        else if (s2 === s3) { UI.reels[1].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
        else { UI.reels[0].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
    }
    else {
        valBoost = -25;
        message = getRandom(FLAVOR_TEXT.loss);
        type = 'loss';
    }

    await sleep(200);
    
    if (winTokens > 0) animateValue(UI.tokenCount, state.tokens, state.tokens + winTokens, 800);
    state.tokens += winTokens;

    const newValuation = Math.max(0, state.valuation + valBoost);
    animateValue(UI.valuation, state.valuation, newValuation, 800, '$', 'M');
    state.valuation = newValuation;

    updateMilestone();
    addLog(message, type);
}

// --- UTILITIES ---
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

function updateDisplay(isInit = false) {
    if (isInit) {
        UI.tokenCount.textContent = state.tokens;
        UI.valuation.textContent = `$${state.valuation}M`;
        updateMilestone();
    }

    const canSpin = state.tokens >= CONFIG.SPIN_COST && !state.isSpinning;
    UI.spinBtn.disabled = !canSpin;
    
    if (state.tokens < CONFIG.SPIN_COST && !state.isSpinning) {
        UI.spinBtn.textContent = "OUT OF COMPUTE";
        UI.resetBtn.classList.remove('hidden');
        UI.status.textContent = "○ HALTED";
        UI.status.style.color = "var(--neon-red)";
    } else {
        UI.spinBtn.textContent = `RUN INFERENCE (${CONFIG.SPIN_COST} TOKENS)`;
        UI.resetBtn.classList.add('hidden');
        UI.status.textContent = "● LIVE";
        UI.status.style.color = "var(--neon-green)";
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
}

function animateValue(el, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
        
        if (end > start) el.className = 'value inc';
        else if (end < start) el.className = 'value dec';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.className = 'value';
        }
    };
    window.requestAnimationFrame(step);
}

function handleReset() {
    state.tokens = CONFIG.INITIAL_TOKENS;
    state.valuation = 0;
    addLog("Pivot successful! Seed funding secured. Don't waste it.", 'system');
    updateDisplay(true);
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the simulation
init();
