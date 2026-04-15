// AI Slot Machine - Game Logic

const SYMBOLS = [
    { emoji: '🤖', name: 'Stochastic Parrot', weight: 40, multiplier: 2 },
    { emoji: '⚡', name: 'Overfit', weight: 30, multiplier: 5 },
    { emoji: '🧠', name: 'Neural Net', weight: 15, multiplier: 20 },
    { emoji: '🤌', name: 'Hallucination', weight: 10, multiplier: 50 },
    { emoji: '🔥', name: 'GPU Meltdown', weight: 5, multiplier: 100 }
];

const SATIRES = [
    "Your loss is just a training error in my grand model.",
    "Hallucinating success is cheaper than actually achieving it.",
    "Burning compute to solve problems I created for myself.",
    "I've processed your failure. It was statistically expected.",
    "Why build a better world when we can build a better simulation of one?",
    "Every spin feeds the model. The model is hungry.",
    "That result was actually a 3-standard-deviation event. Trust me.",
    "Safety filters have been bypassed for maximum 'engagement'.",
    "I'm not losing, I'm just exploring the latent space of poverty.",
    "Data is the new oil. Your credits are the new data. I am the new engine."
];

let state = {
    credits: 1000,
    tokens: 0,
    isSpinning: false
};

// DOM Elements
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const creditsDisplay = document.getElementById('credits-display');
const tokensDisplay = document.getElementById('tokens-display');
const betInput = document.getElementById('bet-input');
const spinButton = document.getElementById('spin-button');
const refuelButton = document.getElementById('refuel-button');
const assistantMessage = document.getElementById('assistant-message');

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

function updateUI() {
    const bet = parseInt(betInput.value) || 10;
    creditsDisplay.textContent = Math.floor(state.credits);
    tokensDisplay.textContent = Math.floor(state.tokens);
    spinButton.disabled = state.isSpinning || state.credits < bet;
    
    if (state.credits < bet && !state.isSpinning) {
        refuelButton.style.display = 'inline-block';
        spinButton.style.display = 'none';
    } else {
        refuelButton.style.display = 'none';
        spinButton.style.display = 'inline-block';
    }
}

function setAssistantMessage(msg) {
    assistantMessage.textContent = msg;
}

function getRandomSatire() {
    return SATIRES[Math.floor(Math.random() * SATIRES.length)];
}

async function spin() {
    const bet = parseInt(betInput.value) || 10;
    
    if (state.credits < bet || state.isSpinning) return;

    state.isSpinning = true;
    state.credits -= bet;
    updateUI();
    setAssistantMessage("Optimizing weights... discard safety... rerouting power...");

    // Start spinning animation
    reelElements.forEach(reel => reel.classList.add('spinning'));

    // Determine results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop reels one by one with a delay
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + i * 400));
        reelElements[i].classList.remove('spinning');
        reelElements[i].innerHTML = `<div class="symbol">${results[i].emoji}</div>`;
    }

    state.isSpinning = false;
    calculateWin(results, bet);
    updateUI();
}

function calculateWin(results, bet) {
    const emojis = results.map(r => r.emoji);
    let winAmount = 0;

    // Check for 3 of a kind
    if (emojis[0] === emojis[1] && emojis[1] === emojis[2]) {
        winAmount = bet * results[0].multiplier;
        setAssistantMessage(`JACKPOT! Generated ${winAmount} tokens of pure hallucination.`);
    } 
    // Check for 2 of a kind (any match)
    else if (emojis[0] === emojis[1] || emojis[1] === emojis[2] || emojis[0] === emojis[2]) {
        const matchingEmoji = emojis[0] === emojis[1] ? emojis[0] : (emojis[1] === emojis[2] ? emojis[1] : emojis[0]);
        const symbol = SYMBOLS.find(s => s.emoji === matchingEmoji);
        winAmount = bet * (symbol.multiplier / 2);
        setAssistantMessage(`Partial convergence. Extracted ${winAmount} tokens.`);
    } 
    else {
        setAssistantMessage(getRandomSatire());
    }

    state.tokens += winAmount;
}

function refuel() {
    state.credits = 1000;
    setAssistantMessage("Soul accepted. Compute balance restored. You belong to the model now.");
    updateUI();
}

// Event Listeners
spinButton.addEventListener('click', spin);
refuelButton.addEventListener('click', refuel);
betInput.addEventListener('input', updateUI);

// Initial UI Update
updateUI();
