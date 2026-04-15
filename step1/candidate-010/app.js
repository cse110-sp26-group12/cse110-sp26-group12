const SYMBOLS = ['🤖', '🧠', '☁️', '⚡', '💰', '📉'];
const SPIN_COST = 50;
let tokens = 1000;

const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('token-count');
const consoleOutput = document.getElementById('console-output');

const MESSAGES = {
    start: [
        "Initializing neural weights...",
        "Querying the vector database...",
        "Preprocessing prompt tokens...",
        "Allocating H100 GPU resources...",
        "Simulating artificial consciousness..."
    ],
    win: [
        "Insight synthesized! Payout: {n} Tokens. (Actually just rephrased the internet)",
        "AGI achieved! (Note: Just a very complex regex). +{n} Tokens.",
        "Optimization complete. Efficiency gain: {n} Tokens.",
        "Value alignment successful. Rewarding agent with {n} Tokens."
    ],
    loss: [
        "Hallucination detected. Tokens burned.",
        "Safety filter triggered. Context purged.",
        "Context window overflow. Error 404: Logic not found.",
        "Model collapsed. Retraining on your disappointment...",
        "Prompt injection failed. Better luck next inference."
    ]
};

function logMessage(msg) {
    const line = document.createElement('div');
    line.innerHTML = `> ${msg}`;
    consoleOutput.prepend(line);
    if (consoleOutput.children.length > 50) {
        consoleOutput.removeChild(consoleOutput.lastChild);
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (tokens < SPIN_COST) {
        logMessage("CRITICAL ERROR: Insufficient compute credits. Buy more tokens (VC funding required).");
        return;
    }

    tokens -= SPIN_COST;
    updateDisplay();
    spinBtn.disabled = true;

    logMessage(MESSAGES.start[Math.floor(Math.random() * MESSAGES.start.length)]);

    const results = [];
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const finalSymbol = getRandomSymbol();
            results.push(finalSymbol);
            
            // Create a long list of symbols for the "scrolling" effect
            let html = '';
            for (let i = 0; i < 20; i++) {
                html += `<div class="symbol">${getRandomSymbol()}</div>`;
            }
            html += `<div class="symbol">${finalSymbol}</div>`;
            reel.innerHTML = html;

            // Animate
            const duration = 1000 + (index * 500);
            reel.style.transition = `top ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.top = `-${(reel.children.length - 1) * 100}px`;

            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.top = '0px';
                reel.innerHTML = `<div class="symbol">${finalSymbol}</div>`;
                resolve();
            }, duration);
        });
    });

    await Promise.all(spinPromises);
    checkWin(results);
    spinBtn.disabled = false;
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    let payout = 0;

    if (s1 === s2 && s2 === s3) {
        // 3 of a kind
        payout = 500;
        if (s1 === '💰') payout = 1000;
        if (s1 === '🧠') {
            logMessage("FAKE WIN! The AI hallucinated a jackpot. No tokens awarded.");
            payout = 0;
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // 2 of a kind
        payout = 100;
    }

    if (payout > 0) {
        tokens += payout;
        const msg = MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)];
        logMessage(msg.replace('{n}', payout));
    } else {
        logMessage(MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)]);
    }

    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.innerText = tokens;
}

spinBtn.addEventListener('click', spin);
