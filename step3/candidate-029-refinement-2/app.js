/**
 * AGI-LOT v2.0.0
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
    REEL_SYMBOLS_COUNT: 40, // Length of the animated strip
    SYMBOL_HEIGHT: 110,     // Must match CSS --reel-size
    BASE_SPIN_DURATION: 1800,
    REEL_DELAY: 400
};

const FLAVOR_TEXT = {
    start: [
        "Inference started. Generating hallucinations...",
        "Scraping the open web without permission...",
        "Burning VC cash to warm the data center...",
        "Overclocking H100s. Room temperature rising...",
        "Applying RLHF (Really Liked His Funding)...",
        "Prompting the latent space for profit...",
        "Tokenizing the human experience..."
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
        "Safety filter triggered: No profit found in this prompt.",
        "GPU debt interest higher than revenue.",
        "Chief Scientist left to start a competing stealth startup."
    ]
};

// --- STATE MANAGEMENT ---
let state = {
    tokens: CONFIG.INITIAL_TOKENS,
    valuation: 0,
    isSpinning: false,
    history: []
};

// --- UI ELEMENTS ---
const UI = {
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
    logs: document.getElementById('logs'),
    status: document.getElementById('system-status')
};

// --- INITIALIZATION ---
function init() {
    UI.reels.forEach((reel, i) => {
        reel.strip = reel.el.querySelector('.reel-strip');
        fillReelStrip(reel.strip);
    });

    UI.spinBtn.addEventListener('click', handleSpin);
    UI.resetBtn.addEventListener('click', handleReset);
    
    updateDisplay(true);
}

function fillReelStrip(stripEl, finalSymbol = null) {
    stripEl.innerHTML = '';
    const pool = [];
    SYMBOLS.forEach(s => {
        for (let i = 0; i < s.weight; i++) pool.push(s.icon);
    });

    for (let i = 0; i < CONFIG.REEL_SYMBOLS_COUNT; i++) {
        const div = document.createElement('div');
        div.className = 'reel-symbol';
        // If it's the very first symbol (the one displayed at rest)
        if (i === 0 && finalSymbol) {
            div.textContent = finalSymbol;
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
    
    // Reset UI state
    UI.machine.classList.remove('win-flash');
    UI.reels.forEach(r => r.el.classList.remove('highlight', 'critical'));
    updateDisplay();

    addLog(getRandom(FLAVOR_TEXT.start), 'info');

    // Generate Results
    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Animate
    const animations = UI.reels.map((reel, i) => 
        animateReel(reel, results[i], i)
    );

    await Promise.all(animations);

    // Process Outcome
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
        
        // Set the final symbol at the end of the strip (position it will land on)
        const lastSymbolEl = strip.children[CONFIG.REEL_SYMBOLS_COUNT - 1];
        lastSymbolEl.textContent = targetSymbol.icon;

        // Apply transition
        const targetTranslate = -(CONFIG.REEL_SYMBOLS_COUNT - 1) * CONFIG.SYMBOL_HEIGHT;
        
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.25, 1.25)`;
        strip.style.transform = `translateY(${targetTranslate}px)`;

        setTimeout(() => {
            // Snap back to top with the same symbol
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

    // Win Logic
    if (s1 === s2 && s2 === s3) {
        // JACKPOT
        UI.machine.classList.add('win-flash');
        UI.reels.forEach(r => r.el.classList.add('highlight'));
        UI.app.classList.add('shake');
        setTimeout(() => UI.app.classList.remove('shake'), 500);

        if (s1 === '🦄') {
            winTokens = 1000;
            valBoost = 5000;
            message = "EXIT LIQUIDITY ATTAINED! You are the 0.1% of hallucinations.";
        } else if (s1 === '💩') {
            winTokens = 0;
            valBoost = -state.valuation;
            UI.reels.forEach(r => {
                r.el.classList.remove('highlight');
                r.el.classList.add('critical');
            });
            message = "TOTAL MODEL COLLAPSE. The board has fired you.";
        } else if (s1 === '📉') {
            winTokens = 5;
            valBoost = -100;
            message = "Market downturn. Pivoting to 'Web3 AI on the Blockchain'.";
        } else {
            winTokens = 250;
            valBoost = 1000;
            message = getRandom(FLAVOR_TEXT.jackpot);
        }
        type = (s1 === '💩' || s1 === '📉') ? 'loss' : 'win';
    } 
    else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Partial Match
        winTokens = 25;
        valBoost = 100;
        message = "Partial convergence. Investors are cautiously optimistic.";
        type = 'win';
        
        // Highlight matching reels
        if (s1 === s2) { UI.reels[0].el.classList.add('highlight'); UI.reels[1].el.classList.add('highlight'); }
        else if (s2 === s3) { UI.reels[1].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
        else { UI.reels[0].el.classList.add('highlight'); UI.reels[2].el.classList.add('highlight'); }
    }
    else {
        // No Match
        valBoost = -10;
        message = getRandom(FLAVOR_TEXT.loss);
        type = 'loss';
    }

    // Apply results with a small delay for "pacing"
    await sleep(200);
    
    if (winTokens > 0) animateValue(UI.tokenCount, state.tokens, state.tokens + winTokens, 1000);
    state.tokens += winTokens;

    const newValuation = Math.max(0, state.valuation + valBoost);
    animateValue(UI.valuation, state.valuation, newValuation, 1000, '$', 'M');
    state.valuation = newValuation;

    addLog(message, type);
}

// --- UTILITIES ---
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

function updateDisplay(isInit = false) {
    if (isInit) {
        UI.tokenCount.textContent = state.tokens;
        UI.valuation.textContent = `$${state.valuation}M`;
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

function animateValue(el, start, end, duration, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
        
        // Add visual indicator of change
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
    addLog("Pivot successful! New seed funding secured. Don't waste it.", 'system');
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
