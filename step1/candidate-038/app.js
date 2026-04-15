const symbols = [
    { icon: '🤖', name: 'LLM' },
    { icon: '⚡', name: 'GPU' },
    { icon: '💰', name: 'VC FUND' },
    { icon: '🍄', name: 'HALLUCINATION' },
    { icon: '📉', name: 'TOKEN BURN' },
    { icon: '🧠', name: 'NEURAL NET' }
];

let tokens = 1000;
const spinCost = 50;
const reelContainers = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize Reels with a pool of symbols
function initReels() {
    reelContainers.forEach(container => {
        // We add 30 symbols to each reel to create a scrolling effect
        for(let i = 0; i < 30; i++) {
            const sym = symbols[Math.floor(Math.random() * symbols.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.innerHTML = `${sym.icon}<span>${sym.name}</span>`;
            container.appendChild(div);
        }
    });
}

// Minimalist Web Audio synth
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, duration = 0.1) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

async function spin() {
    if (tokens < spinCost) {
        document.getElementById('status-msg').innerText = "INSUFFICIENT TOKENS. PLEASE PIVOT.";
        return;
    }

    tokens -= spinCost;
    updateUI();
    
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('status-msg').innerText = "Running inference...";
    playBeep(150, 0.2);

    const finalResults = [];
    
    // Animate each reel with a slight delay
    const promises = reelContainers.map((container, i) => {
        return new Promise(resolve => {
            const targetIndex = Math.floor(Math.random() * symbols.length);
            // Move it down by a random multiple + the target offset
            const scrollCount = 10 + (i * 5); 
            const offset = (scrollCount * 120) + (targetIndex * 120);
            
            container.style.transition = `transform ${2 + (i * 0.5)}s cubic-bezier(0.1, 0, 0.1, 1)`;
            container.style.transform = `translateY(-${offset}px)`;
            
            finalResults.push(symbols[targetIndex].name);
            
            setTimeout(() => {
                playBeep(300 + (i * 100));
                resolve();
            }, 2000 + (i * 500));
        });
    });

    await Promise.all(promises);
    evaluateOutcome(finalResults);
    document.getElementById('spin-btn').disabled = false;
}

function evaluateOutcome(results) {
    const msg = document.getElementById('status-msg');
    const [a, b, c] = results;

    if (a === b && b === c) {
        tokens += 1000;
        msg.innerText = "JACKPOT! Artificial General Intelligence Achieved!";
        playBeep(880, 0.5);
        document.getElementById('hype-val').innerText = "Singularity";
    } else if (a === b || b === c || a === c) {
        tokens += 150;
        msg.innerText = "Partial Match: Series B Funding Secured!";
        playBeep(440, 0.3);
        document.getElementById('hype-val').innerText = "Unicorn";
    } else {
        msg.innerText = "Hallucination detected. Tokens wasted.";
        document.getElementById('hype-val').innerText = "Pivot Mode";
    }
    updateUI();
}

function updateUI() {
    document.getElementById('token-count').innerText = tokens;
}

document.getElementById('spin-btn').addEventListener('click', spin);
initReels();