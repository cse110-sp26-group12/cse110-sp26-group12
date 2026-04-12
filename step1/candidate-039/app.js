const symbols = ['🤖', '🚀', '📉', '🧠', '💰', '⚡', '🥑'];

const winMessages = [
    "Series A funding secured!",
    "Model successfully converged!",
    "Viral growth detected!",
    "Equity value skyrocketed!"
];

const lossMessages = [
    "Server costs exceeded revenue.",
    "Hallucination detected. Reroll.",
    "Safety filter blocked the output.",
    "Hardware failure in the cloud."
];

let hallucinations = 10;
let credits = 100;
let isSpinning = false;

const reelEls = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
const spinBtn = document.getElementById('spin-btn');
const hallEl = document.getElementById('hallucinations');
const credEl = document.getElementById('credits');
const msgEl = document.getElementById('message');

function playSynthSound(freq) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

function updateStats() {
    hallEl.textContent = hallucinations;
    credEl.textContent = credits;
    spinBtn.disabled = hallucinations <= 0 || isSpinning;
}

function spin() {
    if (hallucinations <= 0 || isSpinning) return;

    hallucinations--;
    isSpinning = true;
    msgEl.textContent = "Adjusting neural weights...";
    msgEl.style.color = "var(--neon-blue)";
    updateStats();

    reelEls.forEach(el => el.classList.add('spinning'));

    setTimeout(() => {
        const results = reelEls.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        
        reelEls.forEach((el, i) => {
            el.classList.remove('spinning');
            el.textContent = results[i];
            setTimeout(() => playSynthSound(150 + (i * 50)), i * 150);
        });

        evaluateResults(results);
        isSpinning = false;
        updateStats();
    }, 1200);
}

function evaluateResults(results) {
    const isJackpot = results[0] === results[1] && results[1] === results[2];
    const isPair = results[0] === results[1] || results[1] === results[2] || results[0] === results[2];

    if (isJackpot) {
        credits += 500;
        hallucinations += 3;
        msgEl.textContent = `JACKPOT: ${winMessages[Math.floor(Math.random() * winMessages.length)]}`;
        msgEl.style.color = "var(--gold)";
    } else if (isPair) {
        credits += 25;
        msgEl.textContent = "Soft convergence. Minor gains.";
        msgEl.style.color = "white";
    } else {
        msgEl.textContent = lossMessages[Math.floor(Math.random() * lossMessages.length)];
        msgEl.style.color = "var(--error-red)";
    }
}

spinBtn.addEventListener('click', spin);