const SYMBOLS = [
    { emoji: '🪙', name: 'Token', weight: 10, payout: 2 },
    { emoji: '🤖', name: 'Chatbot', weight: 7, payout: 5 },
    { emoji: '🧠', name: 'Galaxy Brain', weight: 4, payout: 20 },
    { emoji: '🦜', name: 'Stochastic Parrot', weight: 2, payout: 50 },
    { emoji: '⚠️', name: 'Hallucination', weight: 3, payout: -10 }
];

const STATUS_MESSAGES = {
    idle: "AWAITING PROMPT...",
    spinning: "PROCESSING REQUEST...",
    win: "RESPONSE VALIDATED! +{n} TOKENS",
    loss: "TOKEN LIMIT EXCEEDED. TRY AGAIN.",
    hallucination: "CRITICAL ERROR: HALLUCINATION DETECTED!",
    broke: "INSUFFICIENT COMPUTE. PLEASE RECHARGE."
};

let computeBudget = 1000;
let isSpinning = false;
const SYMBOL_HEIGHT = 120; // Must match CSS --symbol-height

// DOM Elements
const balanceDisplay = document.getElementById('token-balance');
const systemStatus = document.getElementById('system-status');
const spinButton = document.getElementById('spin-button');
const vcButton = document.getElementById('vc-button');
const betSelect = document.getElementById('bet-amount');
const strips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];

// Initialize reels with some symbols
function initReels() {
    strips.forEach(strip => {
        for (let i = 0; i < 5; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.emoji;
            strip.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning) return;
    
    const bet = parseInt(betSelect.value);
    if (computeBudget < bet) {
        updateStatus('broke');
        return;
    }

    // Deduct tokens
    computeBudget -= bet;
    updateUI();
    
    isSpinning = true;
    spinButton.disabled = true;
    updateStatus('spinning');

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const spinDurations = [2000, 2500, 3000]; // Staggered stop

    const spinPromises = strips.map((strip, i) => {
        return animateReel(strip, results[i], spinDurations[i]);
    });

    await Promise.all(spinPromises);

    isSpinning = false;
    spinButton.disabled = false;
    calculateResults(results, bet);
}

function animateReel(strip, finalSymbol, duration) {
    return new Promise(resolve => {
        const extraSymbols = 20 + Math.floor(Math.random() * 10);
        const totalSymbols = extraSymbols + 1;
        
        // Add temporary symbols for the spin
        const tempSymbols = [];
        for (let i = 0; i < extraSymbols; i++) {
            tempSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji);
        }
        tempSymbols.push(finalSymbol.emoji);

        // Prepend to strip
        tempSymbols.reverse().forEach(emoji => {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = emoji;
            strip.insertBefore(div, strip.firstChild);
        });

        // Set initial position (offset by new symbols)
        const offset = totalSymbols * SYMBOL_HEIGHT;
        strip.style.transition = 'none';
        strip.style.transform = `translateY(-${offset}px)`;

        // Trigger animation
        strip.offsetHeight; // Force reflow
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        strip.style.transform = 'translateY(0px)';
        strip.classList.add('blur');

        setTimeout(() => {
            strip.classList.remove('blur');
            // Clean up: Keep only the last symbol and some padding
            while (strip.children.length > 5) {
                strip.removeChild(strip.lastChild);
            }
            resolve();
        }, duration);
    });
}

function calculateResults(results, bet) {
    const emojis = results.map(r => r.emoji);
    const uniqueCount = new Set(emojis).size;
    
    let winAmount = 0;
    let state = 'loss';

    if (uniqueCount === 1) {
        // All three match
        const symbol = results[0];
        if (symbol.emoji === '⚠️') {
            winAmount = symbol.payout * bet; // Negative win = loss
            state = 'hallucination';
            document.querySelector('.reels-container').classList.add('hallucination-shake');
            setTimeout(() => {
                document.querySelector('.reels-container').classList.remove('hallucination-shake');
            }, 1000);
        } else {
            winAmount = symbol.payout * bet;
            state = 'win';
            balanceDisplay.classList.add('win-animation');
            setTimeout(() => balanceDisplay.classList.remove('win-animation'), 2000);
        }
    } else if (uniqueCount === 2 && emojis.includes('🦜')) {
        // Two match and one is a parrot (Wildcard)
        // Find the other symbol
        const otherEmoji = emojis.find(e => e !== '🦜') || '🦜';
        const otherSymbol = SYMBOLS.find(s => s.emoji === otherEmoji);
        winAmount = otherSymbol.payout * bet * 2; // Wildcard bonus
        state = 'win';
    }

    computeBudget += winAmount;
    updateUI();
    updateStatus(state, Math.abs(winAmount));
}

function updateUI() {
    balanceDisplay.textContent = computeBudget;
}

function updateStatus(state, n = 0) {
    let msg = STATUS_MESSAGES[state] || STATUS_MESSAGES.idle;
    if (state === 'win') msg = msg.replace('{n}', n);
    
    systemStatus.textContent = msg;
    
    if (state === 'hallucination') {
        systemStatus.style.color = 'var(--error-red)';
    } else if (state === 'win') {
        systemStatus.style.color = 'var(--terminal-green)';
    } else {
        systemStatus.style.color = 'var(--neon-purple)';
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);
vcButton.addEventListener('click', () => {
    if (isSpinning) return;
    computeBudget += 1000;
    updateUI();
    systemStatus.textContent = "SERIES A FUNDING SECURED! +1000 TOKENS";
    systemStatus.style.color = 'var(--accent-blue)';
});

// Initialize
initReels();
updateUI();
updateStatus('idle');
