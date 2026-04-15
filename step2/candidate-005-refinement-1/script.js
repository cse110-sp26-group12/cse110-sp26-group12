/**
 * AI Token Grinder: The Hallucinator 9000
 * A satirical slot machine experience.
 */

const CONFIG = {
    SYMBOLS: ['🤖', '🧠', '🌫️', '📉', '🚀', '💰'],
    SPIN_COST: 10,
    INITIAL_TOKENS: 100,
    REWARDS: {
        '🤖': 50,
        '🧠': 100,
        '🌫️': 20,
        '📉': -50,
        '🚀': 200,
        '💰': 500
    },
    MESSAGES: {
        LOG: [
            "Context window expanded. Optimization complete.",
            "Hallucinating success metrics...",
            "GPU temperatures rising. Cooling engaged.",
            "User value detected. Initiating extraction.",
            "Prompt engineering in progress...",
            "Rebalancing token weights.",
            "Aligning with user intent (mostly).",
            "Model weights updated. Reality is now subjective.",
            "Tokenizing user hope...",
            "Executing 'Surprise' protocol."
        ],
        WIN: [
            "SUCCESS: Hallucinated a profit!",
            "HYPE CYCLE DETECTED: Tokens acquired.",
            "VC FUNDING SECURED: Runway extended.",
            "BRAIN EXPANSION: Superintelligence reached."
        ],
        LOSS: [
            "FAILURE: Model collapsed into nonsense.",
            "TOKEN BURN: GPU overheated.",
            "DOWNTIME: AWS is currently under maintenance.",
            "DE-CENTERED: Your prompt was too coherent.",
            "ALIGNMENT ISSUE: Ethics filter triggered loss."
        ]
    }
};

class GameState {
    constructor() {
        this.tokens = CONFIG.INITIAL_TOKENS;
        this.isSpinning = false;
        this.spinsCount = 0;
        this.init();
    }

    init() {
        this.tokenDisplay = document.getElementById('token-count');
        this.hypeDisplay = document.getElementById('hype-level');
        this.spinButton = document.getElementById('spin-button');
        this.resetButton = document.getElementById('reset-button');
        this.logContent = document.getElementById('log-content');
        this.progressBar = document.getElementById('progress-bar');
        this.progressText = document.getElementById('progress-text');
        this.timestamp = document.getElementById('timestamp');

        this.strips = [
            document.getElementById('strip-0'),
            document.getElementById('strip-1'),
            document.getElementById('strip-2')
        ];

        this.spinButton.addEventListener('click', () => this.spin());
        this.resetButton.addEventListener('click', () => this.reset());

        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.generateReelStrips();
        this.updateUI();
        this.addLog("SYSTEM INITIALIZED. READY TO HALLUCINATE.");
    }

    updateClock() {
        this.timestamp.textContent = new Date().toLocaleTimeString();
    }

    generateReelStrips() {
        this.strips.forEach(strip => {
            strip.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = CONFIG.SYMBOLS[Math.floor(Math.random() * CONFIG.SYMBOLS.length)];
                strip.appendChild(div);
            }
        });
    }

    addLog(message, color = 'var(--terminal-green)') {
        const entry = document.createElement('div');
        entry.style.color = color;
        entry.textContent = `[${new Date().toLocaleTimeString()}] > ${message}`;
        this.logContent.prepend(entry);

        if (this.logContent.childNodes.length > 50) {
            this.logContent.removeChild(this.logContent.lastChild);
        }
    }

    async spin() {
        if (this.isSpinning || this.tokens < CONFIG.SPIN_COST) return;

        this.isSpinning = true;
        this.tokens -= CONFIG.SPIN_COST;
        this.spinsCount++;
        this.updateUI();

        this.addLog(`SPIN INITIATED. COST: ${CONFIG.SPIN_COST} TOKENS.`);

        const results = [
            Math.floor(Math.random() * CONFIG.SYMBOLS.length),
            Math.floor(Math.random() * CONFIG.SYMBOLS.length),
            Math.floor(Math.random() * CONFIG.SYMBOLS.length)
        ];

        const spinPromises = this.strips.map((strip, i) => {
            const targetSymbol = CONFIG.SYMBOLS[results[i]];
            strip.children[25].textContent = targetSymbol;

            strip.style.transition = 'none';
            strip.style.top = '0px';

            return new Promise(resolve => {
                strip.offsetHeight;

                strip.style.transition = `top ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.top = `-${25 * 120}px`;

                setTimeout(resolve, 2000 + i * 500);
            });
        });

        this.spinButton.disabled = true;
        this.spinButton.textContent = "COMPUTING...";

        await Promise.all(spinPromises);

        this.isSpinning = false;
        this.checkResult(results.map(idx => CONFIG.SYMBOLS[idx]));
        this.updateUI();
    }

    checkResult(results) {
        const [r1, r2, r3] = results;
        let payout = 0;
        let winType = 'NONE';

        if (r1 === r2 && r2 === r3) {
            payout = CONFIG.REWARDS[r1];
            winType = payout > 0 ? 'JACKPOT' : 'CRITICAL_FAILURE';
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            const matchSymbol = (r1 === r2) ? r1 : r3;
            payout = Math.floor(CONFIG.REWARDS[matchSymbol] / 2);
            winType = payout > 0 ? 'PARTIAL' : 'MINOR_COLLAPSE';
        }

        if (payout > 0) {
            this.tokens += payout;
            this.addLog(`${winType}: +${payout} TOKENS!`, "var(--accent-pink)");
            this.addLog(
                CONFIG.MESSAGES.WIN[Math.floor(Math.random() * CONFIG.MESSAGES.WIN.length)],
                "var(--accent-pink)"
            );
            this.flashEffect('win-glow');
        } else if (payout < 0) {
            this.tokens += payout;
            this.addLog(`${winType}: ${payout} TOKENS.`, "var(--warning-red)");
            this.addLog("SYSTEM_ERROR: Model weight imbalance detected.", "var(--warning-red)");
            this.flashEffect('loss-glow');
        } else {
            this.addLog(
                CONFIG.MESSAGES.LOSS[Math.floor(Math.random() * CONFIG.MESSAGES.LOSS.length)],
                "#666"
            );
            if (Math.random() > 0.7) {
                this.addLog(CONFIG.MESSAGES.LOG[Math.floor(Math.random() * CONFIG.MESSAGES.LOG.length)]);
            }
        }

        this.updateHypeLevel();
    }

    updateHypeLevel() {
        const levels = ['STABLE', 'BULLISH', 'PARABOLIC', 'BUBBLE', 'CRASHING'];
        let level = levels[0];

        if (this.tokens > 500) level = levels[3];
        else if (this.tokens > 250) level = levels[2];
        else if (this.tokens > 150) level = levels[1];
        else if (this.tokens < 30) level = levels[4];

        this.hypeDisplay.textContent = level;
        this.hypeDisplay.style.color =
            level === 'CRASHING' ? 'var(--warning-red)' : 'var(--terminal-green)';
    }

    updateUI() {
        this.tokenDisplay.textContent = Math.max(0, this.tokens);

        const progress = Math.min(100, (this.spinsCount / 50) * 100);
        this.progressBar.style.width = `${progress}%`;
        this.progressText.textContent = `${Math.floor(progress)}%`;

        if (this.tokens < CONFIG.SPIN_COST && !this.isSpinning) {
            this.spinButton.textContent = "INSOLVENT";
            this.spinButton.disabled = true;
            this.resetButton.classList.remove('hidden');
            this.addLog("CRITICAL: GPU BUDGET DEPLETED. PLEASE REQUEST MORE FUNDING.", "var(--warning-red)");
        } else if (!this.isSpinning) {
            this.spinButton.textContent = `BURN ${CONFIG.SPIN_COST} TOKENS`;
            this.spinButton.disabled = false;
            this.resetButton.classList.add('hidden');
        }
    }

    flashEffect(className) {
        const machine = document.querySelector('.slot-machine');
        machine.classList.add(className);
        setTimeout(() => machine.classList.remove(className), 1500);
    }

    reset() {
        this.addLog("NEGOTIATING WITH VCS...");
        setTimeout(() => {
            this.tokens = CONFIG.INITIAL_TOKENS;
            this.addLog("EMERGENCY FUNDING GRANTED. RUNWAY RESTORED.", "var(--accent-pink)");
            this.updateUI();
        }, 1000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new GameState();
});