// AGI Trainer - App Logic

const SYMBOLS = ['🤖', '😵‍💫', '💰', '🖥️', '📉', '📈', '⚡'];
const COST_PER_TRAIN = 5;

let credits = 100;
let isSpinning = false;
let accuracy = 0.0;
let temp = 45;

const creditsEl = document.getElementById('credits');
const gpuTempEl = document.getElementById('gpu-temp');
const accuracyEl = document.getElementById('accuracy');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

const messages = [
    "Optimizing hyperparameters...",
    "Scaling is all you need!",
    "Data scraping in progress...",
    "Hallucination detected. Ignored.",
    "Bypassing safety alignment...",
    "GPU cluster overheating...",
    "Series A funding secured!",
    "Model collapsed. Retraining...",
    "Tokens burned successfully.",
    "AGI is just 6 months away."
];

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateStats() {
    creditsEl.textContent = credits;
    gpuTempEl.textContent = temp;
    accuracyEl.textContent = accuracy.toFixed(2);
    
    if (credits < COST_PER_TRAIN) {
        spinBtn.disabled = true;
        spinBtn.textContent = "FUNDING DEPLETED";
        messageEl.textContent = "FATAL ERROR: Insufficient Compute Credits. Sell your soul or reload the page.";
        messageEl.classList.add('critical');
    }
}

async function spin() {
    if (isSpinning || credits < COST_PER_TRAIN) return;

    isSpinning = true;
    credits -= COST_PER_TRAIN;
    temp += Math.floor(Math.random() * 5);
    accuracy += (Math.random() - 0.4) * 0.1; // Accuracy fluctuates
    if (accuracy < 0) accuracy = 0;
    
    updateStats();
    messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
    spinBtn.disabled = true;

    // Start spinning animation
    const results = [];
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const container = reel.querySelector('.symbol-container');
            container.innerHTML = '';
            
            // Add many symbols for the "scrolling" effect
            for (let i = 0; i < 20; i++) {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = getRandomSymbol();
                container.appendChild(div);
            }
            
            const finalSymbol = getRandomSymbol();
            results.push(finalSymbol);
            const finalDiv = document.createElement('div');
            finalDiv.className = 'symbol';
            finalDiv.textContent = finalSymbol;
            container.appendChild(finalDiv);

            // Animate
            const duration = 1000 + index * 500;
            container.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.5, 0.1, 1)`;
            
            // Trigger reflow
            void container.offsetHeight;
            
            const offset = (container.children.length - 1) * 150;
            container.style.transform = `translateY(-${offset}px)`;

            setTimeout(resolve, duration);
        });
    });

    await Promise.all(spinPromises);
    
    checkResult(results);
    isSpinning = false;
    if (credits >= COST_PER_TRAIN) spinBtn.disabled = false;
}

function checkResult(results) {
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        // Jackpot!
        if (s1 === '💰') {
            credits += 200;
            messageEl.textContent = "MEGA-ROUND FUNDING: +200 Credits! The VCs are blind!";
        } else if (s1 === '🤖') {
            credits += 100;
            messageEl.textContent = "AGI ACHIEVED! +100 Credits. It's just a parrot though.";
        } else if (s1 === '😵‍💫') {
            credits -= 20;
            messageEl.textContent = "MASSIVE HALLUCINATION: -20 Credits. Users are reporting weird recipes.";
        } else {
            credits += 50;
            messageEl.textContent = "CONVERGENCE! +50 Credits. Your loss function is happy.";
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Small win
        credits += 10;
        messageEl.textContent = "Local Minima Found! +10 Credits.";
    } else if (results.includes('📉')) {
        credits -= 2;
        messageEl.textContent = "Compute inefficiency detected. -2 Credits.";
    }

    updateStats();
}

spinBtn.addEventListener('click', spin);

// Initial display
updateStats();
