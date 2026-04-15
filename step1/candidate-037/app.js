const SYMBOLS = ['🤖', '📈', '💩', '🧠', '💰', '📉', '⚡', '🤡'];
let tokens = 500;
let isSpinning = false;

// DOM Elements
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('token-count');
const msgDisplay = document.getElementById('status-msg');
const modelStatus = document.getElementById('model-status');
const containers = [
    document.getElementById('con1'),
    document.getElementById('con2'),
    document.getElementById('con3')
];

function createSymbol(char) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = char;
    return div;
}

function init() {
    containers.forEach(con => {
        con.innerHTML = '';
        con.appendChild(createSymbol(SYMBOLS[0]));
    });
}

async function spin() {
    if (isSpinning || tokens < 50) return;

    isSpinning = true;
    spinBtn.disabled = true;
    tokens -= 50;
    tokenDisplay.textContent = tokens;
    
    msgDisplay.textContent = "Scraping private data...";
    modelStatus.textContent = "Training...";

    const results = [];
    const symbolHeight = 120;
    const spinCount = 20; 

    const animations = containers.map((con, i) => {
        // Build the reel strip
        const currentSymbol = con.lastElementChild.textContent;
        con.innerHTML = '';
        con.appendChild(createSymbol(currentSymbol));
        
        for (let j = 0; j < spinCount; j++) {
            con.appendChild(createSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
        }
        
        const finalSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        results.push(finalSymbol);
        con.appendChild(createSymbol(finalSymbol));

        const distance = (con.children.length - 1) * symbolHeight;

        return con.animate([
            { transform: 'translateY(0)' },
            { transform: `translateY(-${distance}px)` }
        ], {
            duration: 2000 + (i * 500),
            easing: 'cubic-bezier(.45,.05,.55,.95)',
            fill: 'forwards'
        }).finished;
    });

    await Promise.all(animations);

    // Calculate Result
    const [r1, r2, r3] = results;
    if (r1 === r2 && r2 === r3) {
        tokens += 1000;
        msgDisplay.textContent = "AGI DISCOVERED! +1000 Credits";
        modelStatus.textContent = "Sentient";
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        tokens += 75;
        msgDisplay.textContent = "Funding Round Closed! +75 Credits";
        modelStatus.textContent = "Converged";
    } else {
        msgDisplay.textContent = "Model Hallucinated. Try again.";
        modelStatus.textContent = "Overfit";
    }

    tokenDisplay.textContent = tokens;
    isSpinning = false;
    if (tokens >= 50) spinBtn.disabled = false;
    else msgDisplay.textContent = "Out of compute. Pivot to Web3?";
}

spinBtn.addEventListener('click', spin);
init();