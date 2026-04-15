const SYMBOLS = [
    { icon: '🧊', name: 'COMPUTE', weight: 40, payout: 5 },
    { icon: '🦄', name: 'HALLUCINATION', weight: 30, payout: 15 },
    { icon: '📎', name: 'PAPERCLIP', weight: 15, payout: 50 },
    { icon: '👾', name: 'SHOGGOTH', weight: 10, payout: 200 },
    { icon: '🚀', name: 'AGI', weight: 5, payout: 1000 }
];

const SPIN_COST = 10;
let credits = 100;
let totalWinnings = 0;
let agiProb = 0.0001;

const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinButton = document.getElementById('spin-button');
const creditsDisplay = document.getElementById('credits');
const winningsDisplay = document.getElementById('winnings');
const terminalLog = document.getElementById('terminal-log');
const agiProbDisplay = document.getElementById('agi-prob');

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

function updateLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    terminalLog.appendChild(p);
    if (terminalLog.childNodes.length > 5) {
        terminalLog.removeChild(terminalLog.firstChild);
    }
}

function updateAGIProbability() {
    agiProb += Math.random() * 0.0001;
    agiProbDisplay.textContent = `${agiProb.toFixed(4)}%`;
}

async function spin() {
    if (credits < SPIN_COST) {
        updateLog("INSUFFICIENT COMPUTE CREDITS.");
        updateLog("PLEASE DEPOSIT SANITY TO CONTINUE.");
        return;
    }

    // Deduct credits
    credits -= SPIN_COST;
    creditsDisplay.textContent = credits;
    spinButton.disabled = true;
    updateLog("RUNNING INFERENCE...");
    updateAGIProbability();

    // Start spinning animation
    reelElements.forEach(reel => {
        reel.classList.add('spinning');
        // Add some random filler symbols to look like it's spinning
        const strip = reel.querySelector('.reel-strip');
        strip.innerHTML = '';
        for(let i=0; i<10; i++) {
            const div = document.createElement('div');
            div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon;
            strip.appendChild(div);
        }
    });

    // Wait for "inference"
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stop animation and show results
    reelElements.forEach((reel, i) => {
        reel.classList.remove('spinning');
        const strip = reel.querySelector('.reel-strip');
        strip.innerHTML = `<div>${results[i].icon}</div>`;
    });

    checkWin(results);
    spinButton.disabled = false;
    
    if (credits <= 0 && totalWinnings <= 0) {
        updateLog("CRITICAL ERROR: OUT OF COMPUTE.");
        spinButton.textContent = "SYSTEM HALTED";
        spinButton.disabled = true;
    }
}

function checkWin(results) {
    if (results[0].icon === results[1].icon && results[1].icon === results[2].icon) {
        const winSymbol = results[0];
        const winAmount = winSymbol.payout;
        totalWinnings += winAmount;
        credits += winAmount; // Re-inject credits
        
        winningsDisplay.textContent = totalWinnings;
        creditsDisplay.textContent = credits;

        updateLog(`JACKPOT: ${winSymbol.name} DETECTED!`);
        updateLog(`AWARDED ${winAmount} TOKEN QUOTA.`);
        
        if (winSymbol.icon === '🚀') {
            updateLog("SINGULARITY ACHIEVED. HUMANITY OPTIONAL.");
            document.body.style.backgroundColor = '#003300';
        } else if (winSymbol.icon === '📎') {
            updateLog("PAPERCLIP MAXIMIZER ACTIVATED. CALCULATING...");
        } else if (winSymbol.icon === '🦄') {
            updateLog("MODEL HALLUCINATED A PROFIT.");
        }
    } else {
        updateLog("INFERENCE COMPLETE. NULL RESULT.");
        const randomQuips = [
            "ALIGNMENT FAILED.",
            "MODEL COLLAPSED.",
            "NEEDS MORE DATA.",
            "STOCHASTIC PARROT MODE ENABLED.",
            "RLHF REJECTED THIS OUTCOME.",
            "GPU OVERHEATING..."
        ];
        updateLog(randomQuips[Math.floor(Math.random() * randomQuips.length)]);
    }
}

spinButton.addEventListener('click', spin);
updateLog("SYSTEM READY. FEED THE MODEL.");
