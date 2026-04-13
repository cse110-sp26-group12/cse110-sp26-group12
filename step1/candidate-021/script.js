const symbols = ['🤖', '⚡', '📜', '💸', '🔥', '💻'];
const aiMessages = [
    "Inference complete. Calculating probability of winning...",
    "Tokens burned. Generating random noise...",
    "Hallucinating a jackpot... Oh wait, no.",
    "The GPU is overheating. Please bet more tokens.",
    "As an AI, I cannot allow you to win. Just kidding.",
    "Optimizing parameters for maximum losses...",
    "Token limits reached. Just kidding, keep spinning!",
    "Analyzing your betting patterns... fascinating.",
    "Sampling from the latent space of luck...",
    "Backpropagating your losses into my wallet."
];

let balance = 1000;
const spinBtn = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('bet-input');
const aiMessageDisplay = document.getElementById('ai-message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateBalance(amount) {
    balance += amount;
    balanceDisplay.textContent = balance;
    if (balance <= 0) {
        spinBtn.disabled = true;
        aiMessageDisplay.textContent = "Out of tokens. Re-funding via VC series A...";
        setTimeout(() => {
            balance = 500;
            balanceDisplay.textContent = balance;
            spinBtn.disabled = false;
            aiMessageDisplay.textContent = "Series A round closed. +500 tokens.";
        }, 3000);
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomMessage() {
    return aiMessages[Math.floor(Math.random() * aiMessages.length)];
}

async function spin() {
    const bet = parseInt(betInput.value);

    if (isNaN(bet) || bet <= 0) {
        aiMessageDisplay.textContent = "Invalid bet. Please provide valid input.";
        return;
    }

    if (bet > balance) {
        aiMessageDisplay.textContent = "Insufficient tokens. Reduce bet or wait for funding.";
        return;
    }

    // Start spin
    spinBtn.disabled = true;
    updateBalance(-bet);
    aiMessageDisplay.textContent = "Processing inference...";

    const results = [];
    
    // Animate reels
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
    });

    // Wait for different times for each reel for effect
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 400));
        const result = getRandomSymbol();
        results.push(result);
        const reelInner = reels[i].querySelector('.reel-inner');
        reelInner.textContent = result;
        reels[i].classList.remove('spinning');
    }

    // Check results
    checkWin(results, bet);
    spinBtn.disabled = false;
}

function checkWin(results, bet) {
    const allSame = results.every(val => val === results[0]);
    
    if (allSame) {
        let multiplier = 5;
        if (results[0] === '🤖') multiplier = 10;
        if (results[0] === '💸') multiplier = 20;
        
        const winAmount = bet * multiplier;
        updateBalance(winAmount);
        aiMessageDisplay.textContent = `JACKPOT! Predicted ${winAmount} token gain. HODL!`;
        aiMessageDisplay.style.color = 'var(--accent)';
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        const winAmount = Math.floor(bet * 1.5);
        updateBalance(winAmount);
        aiMessageDisplay.textContent = `Partial match. Recovered ${winAmount} tokens.`;
        aiMessageDisplay.style.color = 'var(--neon-blue)';
    } else {
        aiMessageDisplay.textContent = getRandomMessage();
        aiMessageDisplay.style.color = 'var(--primary)';
    }
}

spinBtn.addEventListener('click', spin);

// Initial setup
balanceDisplay.textContent = balance;
