const SYMBOLS = ['🤖', '⚡', '🧠', '📉', '💾', '🌐', '🔋'];
const SYMBOL_HEIGHT = 160; // Matches CSS
const REEL_COUNT = 3;
const SPIN_DURATION = 3000;
const TOKEN_COST = 10;
const PROMPT_OPTIMIZE_COST = 50;

let tokens = 1000;
let isSpinning = false;

const aiMessages = [
    "Thinking... (consuming 1.2 jigawatts)",
    "Hallucinating a jackpot for you...",
    "Optimizing weights for maximum user retention.",
    "Data scraped. Ethics bypassed. Ready.",
    "I'm not gambling, I'm 'predicting future states'.",
    "Your tokens are better off in my GPU cluster.",
    "Error 418: I'm a teapot, but I still want your money.",
    "Scaling compute... please hold your breath.",
    "Aligning with your interests (mostly financial)."
];

const winMessages = [
    "CRITICAL SUCCESS: You've outsmarted the algorithm.",
    "JACKPOT: Synthetic tokens generated successfully.",
    "REWARD GRANTED: Your dopamine levels have been logged.",
    "SUCCESS: Model weights adjusted in your favor (temporarily)."
];

const lossMessages = [
    "MODEL COLLAPSE: Better luck in the next epoch.",
    "INSUFFICIENT COMPUTE: Try adding more tokens.",
    "PREDICTION ERROR: I meant for you to lose.",
    "BIAS DETECTED: The house always wins in this dataset."
];

// Initialize Reels
const reels = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

function initReels() {
    reels.forEach(reel => {
        // Create a long strip of symbols for spinning effect
        let content = '';
        for (let i = 0; i < 30; i++) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            content += `<div class="symbol">${sym}</div>`;
        }
        reel.innerHTML = content;
    });
}

function updateDisplays() {
    document.getElementById('token-count').textContent = tokens;
}

function log(msg, type = 'info') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString().split(' ')[0];
    entry.style.color = type === 'win' ? 'var(--win-color)' : (type === 'loss' ? 'var(--loss-color)' : '#3fb950');
    entry.textContent = `[${timestamp}] ${msg}`;
    logContent.prepend(entry);
    
    // Keep log short
    if (logContent.childNodes.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
}

async function spin() {
    if (isSpinning || tokens < TOKEN_COST) return;

    isSpinning = true;
    tokens -= TOKEN_COST;
    updateDisplays();
    
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('prompt-btn').disabled = true;
    document.getElementById('status-light').style.backgroundColor = 'var(--loss-color)';
    document.getElementById('status-light').style.boxShadow = '0 0 10px var(--loss-color)';
    
    const message = aiMessages[Math.floor(Math.random() * aiMessages.length)];
    document.getElementById('ai-message').textContent = message;
    log(`Initializing generation... Cost: ${TOKEN_COST}T`);

    const results = [];
    const spinPromises = reels.map((reel, i) => {
        const targetIndex = Math.floor(Math.random() * SYMBOLS.length);
        results.push(SYMBOLS[targetIndex]);
        
        // Calculate offset to land on the symbol
        // We add extra full rotations for effect
        const extraRotations = 5 + i * 2;
        const totalSymbols = reel.querySelectorAll('.symbol').length;
        const targetPos = (extraRotations * SYMBOLS.length + targetIndex) * SYMBOL_HEIGHT;
        
        reel.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.transform = `translateY(-${targetPos}px)`;

        return new Promise(resolve => setTimeout(resolve, 2000 + i * 500));
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    
    isSpinning = false;
    document.getElementById('spin-btn').disabled = false;
    document.getElementById('prompt-btn').disabled = false;
    document.getElementById('status-light').style.backgroundColor = 'var(--win-color)';
    document.getElementById('status-light').style.boxShadow = '0 0 10px var(--win-color)';

    // Reset reel position visually without animation for next spin
    // This is a trick: move it to the base range of symbols
    reels.forEach((reel, i) => {
        const currentIdx = Math.floor(Math.random() * SYMBOLS.length); // Random start for next time
        reel.style.transition = 'none';
        // Logic here would normally reset to top, but for simplicity we just leave it
    });
}

function checkWin(results) {
    const unique = new Set(results);
    let winAmount = 0;

    if (unique.size === 1) {
        // 3 of a kind
        const symbol = results[0];
        if (symbol === '🤖') winAmount = 500;
        else if (symbol === '⚡') winAmount = 300;
        else if (symbol === '🧠') winAmount = 200;
        else if (symbol === '📉') {
            winAmount = 0;
            log("MODEL COLLAPSE: Negative gain detected.", "loss");
        }
        else winAmount = 100;
    } else if (unique.size === 2) {
        // 2 of a kind
        winAmount = 20;
    }

    if (winAmount > 0) {
        tokens += winAmount;
        document.getElementById('last-win').textContent = winAmount;
        document.getElementById('ai-message').textContent = winMessages[Math.floor(Math.random() * winMessages.length)];
        log(`Reward generated: +${winAmount} tokens`, "win");
        document.querySelector('.machine-container').classList.add('win-anim');
        setTimeout(() => document.querySelector('.machine-container').classList.remove('win-anim'), 1000);
    } else {
        document.getElementById('ai-message').textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        log("Generation failed to produce value.", "loss");
    }

    updateDisplays();
}

document.getElementById('spin-btn').addEventListener('click', spin);

document.getElementById('prompt-btn').addEventListener('click', () => {
    if (tokens < PROMPT_OPTIMIZE_COST) {
        log("Error: Insufficient tokens for prompt engineering.", "loss");
        return;
    }
    
    tokens -= PROMPT_OPTIMIZE_COST;
    updateDisplays();
    log(`Optimizing prompt... Infrastructure fee: ${PROMPT_OPTIMIZE_COST}T`);
    document.getElementById('ai-message').textContent = "Prompt optimized. (I lied, but thanks for the tokens)";
    
    // Fake benefit: shake the machine
    document.querySelector('.slot-machine').style.animation = 'shake 0.5s';
    setTimeout(() => {
        document.querySelector('.slot-machine').style.animation = '';
    }, 500);
});

// Start
initReels();
updateDisplays();
log("System initialized. Token extraction starting...");
