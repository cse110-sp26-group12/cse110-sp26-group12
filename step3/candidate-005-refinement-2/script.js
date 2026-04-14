/**
 * THE HALLUCINATOR 9000 // AI TOKEN GRINDER
 * "Training superintelligence, one spin at a time."
 */

const CONFIG = {
    SYMBOLS: [
        { char: '🤖', weight: 10, value: 50, label: 'MODEL' },
        { char: '🧠', weight: 8, value: 100, label: 'NEURON' },
        { char: '🌫️', weight: 15, value: 20, label: 'CLOUDS' },
        { char: '📉', weight: 5, value: -50, label: 'CRASH' },
        { char: '🚀', weight: 3, value: 250, label: 'HYPE' },
        { char: '💰', weight: 1, value: 1000, label: 'EXIT' },
        { char: '🔥', weight: 12, value: 10, label: 'BURN' }
    ],
    SPIN_COST: 10,
    INITIAL_TOKENS: 100,
    STRIP_SIZE: 40,
    REEL_STOP_DELAY: 600,
    BASE_SPIN_TIME: 1500,
    MESSAGES: {
        SYSTEM: [
            "Optimizing hyperparameters...",
            "Expanding context window to 1M tokens.",
            "Hallucinating emergent properties...",
            "Diverting power from safety filters.",
            "Scraping reddit for training data...",
            "Quantizing model weights to 1-bit.",
            "Injecting synthetic data into pipeline.",
            "Fine-tuning on user preference (gambling).",
            "GPU cooling fans at 100% RPM.",
            "Predicting next token: SUCCESS."
        ],
        WIN: [
            "HYPE LEVEL CRITICAL: Token infusion detected.",
            "MODEL ALIGNED: Payout extracted.",
            "SERIES B SECURED: Runway extended.",
            "Superintelligence reached (briefly)."
        ],
        LOSS: [
            "GRADIENT VANISHING: Tokens lost to entropy.",
            "MODEL COLLAPSE: Reality check failed.",
            "AWS BILL RECEIVED: GPU budget depleted.",
            "Alignment error: Profit not found.",
            "Ethics filter prevented winning."
        ]
    }
};

class Hallucinator9000 {
    constructor() {
        this.tokens = CONFIG.INITIAL_TOKENS;
        this.isSpinning = false;
        this.spinsCount = 0;
        this.temp = 42;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        // DOM Mapping
        this.els = {
            tokenCount: document.getElementById('token-count'),
            hypeLevel: document.getElementById('hype-level'),
            spinBtn: document.getElementById('spin-button'),
            resetBtn: document.getElementById('reset-button'),
            log: document.getElementById('log-content'),
            progress: document.getElementById('progress-bar'),
            progressText: document.getElementById('progress-text'),
            tempValue: document.getElementById('temp-value'),
            tempGauge: document.querySelector('#temp-gauge .gauge-fill'),
            uptime: document.getElementById('uptime-clock'),
            strips: [
                document.getElementById('strip-0'),
                document.getElementById('strip-1'),
                document.getElementById('strip-2')
            ],
            machine: document.querySelector('.machine-frame')
        };

        // Event Listeners
        this.els.spinBtn.addEventListener('click', () => this.spin());
        this.els.resetBtn.addEventListener('click', () => this.requestFunding());

        // Setup
        this.generateStrips();
        this.updateUI();
        this.startClock();
        
        this.addLog("SYSTEM INITIALIZED. BOOTING HALLUCINATOR_V0.9.4...");
        this.addLog("HARDWARE: 8x H100 GPU CLUSTER DETECTED.");
    }

    startClock() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
            const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
            const s = String(elapsed % 60).padStart(2, '0');
            this.els.uptime.textContent = `UPTIME: ${h}:${m}:${s}`;
            
            // Subtle temp fluctuation
            if (!this.isSpinning) {
                this.updateTemp(this.temp + (Math.random() - 0.5));
            }
        }, 1000);
    }

    updateTemp(val) {
        this.temp = Math.max(30, Math.min(95, val));
        this.els.tempValue.textContent = `${Math.floor(this.temp)}°C`;
        this.els.tempGauge.style.width = `${(this.temp - 30) / 65 * 100}%`;
        
        if (this.temp > 85) {
            this.els.tempValue.style.color = 'var(--color-red)';
            this.els.tempGauge.style.background = 'var(--color-red)';
        } else if (this.temp > 70) {
            this.els.tempValue.style.color = 'var(--color-orange)';
            this.els.tempGauge.style.background = 'var(--color-orange)';
        } else {
            this.els.tempValue.style.color = 'var(--color-green)';
            this.els.tempGauge.style.background = 'var(--color-green)';
        }
    }

    generateStrips() {
        this.els.strips.forEach(strip => {
            strip.innerHTML = '';
            // Weighted symbol pool
            const pool = [];
            CONFIG.SYMBOLS.forEach(s => {
                for(let i=0; i<s.weight; i++) pool.push(s);
            });

            for (let i = 0; i < CONFIG.STRIP_SIZE; i++) {
                const symbol = pool[Math.floor(Math.random() * pool.length)];
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = symbol.char;
                strip.appendChild(div);
            }
        });
    }

    addLog(msg, type = 'default') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        let color = 'var(--color-text)';
        if (type === 'win') color = 'var(--color-pink)';
        if (type === 'loss') color = 'var(--color-red)';
        if (type === 'info') color = 'var(--color-blue)';
        
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        entry.innerHTML = `<span style="opacity:0.4">[${timestamp}]</span> <span style="color:${color}">${msg}</span>`;
        
        this.els.log.prepend(entry);
        if (this.els.log.childNodes.length > 50) this.els.log.removeChild(this.els.log.lastChild);
    }

    async spin() {
        if (this.isSpinning || this.tokens < CONFIG.SPIN_COST) return;

        this.isSpinning = true;
        this.tokens -= CONFIG.SPIN_COST;
        this.spinsCount++;
        this.updateUI();
        
        this.els.machine.classList.add('spinning');
        this.addLog(`SPIN SEQUENCE INITIATED... COST: ${CONFIG.SPIN_COST} TOKENS.`, 'info');
        this.updateTemp(this.temp + 15);

        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];

        // Animate each reel
        const promises = this.els.strips.map((strip, i) => {
            return new Promise(resolve => {
                const stopIndex = CONFIG.STRIP_SIZE - 5;
                strip.children[stopIndex].textContent = results[i].char;

                strip.style.transition = 'none';
                strip.style.top = '0px';
                
                // Force reflow
                strip.offsetHeight;

                const duration = CONFIG.BASE_SPIN_TIME + (i * CONFIG.REEL_STOP_DELAY);
                strip.style.transition = `top ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.top = `-${stopIndex * 140}px`;

                setTimeout(() => {
                    this.els.machine.classList.add('shake');
                    setTimeout(() => this.els.machine.classList.remove('shake'), 100);
                    resolve();
                }, duration);
            });
        });

        await Promise.all(promises);
        
        this.els.machine.classList.remove('spinning');
        this.isSpinning = false;
        this.checkResult(results);
        this.updateUI();
    }

    getRandomSymbol() {
        const pool = [];
        CONFIG.SYMBOLS.forEach(s => {
            for(let i=0; i<s.weight; i++) pool.push(s);
        });
        return pool[Math.floor(Math.random() * pool.length)];
    }

    checkResult(results) {
        const [r1, r2, r3] = results;
        let payout = 0;
        let winStatus = 'NONE';

        // Win Logic
        if (r1.char === r2.char && r2.char === r3.char) {
            payout = r1.value * 5;
            winStatus = 'JACKPOT';
        } else if (r1.char === r2.char || r2.char === r3.char || r1.char === r3.char) {
            const match = (r1.char === r2.char) ? r1 : r3;
            payout = match.value;
            winStatus = 'PARTIAL';
        }

        if (payout > 0) {
            this.tokens += payout;
            this.addLog(`${winStatus}: +${payout} TOKENS!`, 'win');
            this.addLog(CONFIG.MESSAGES.WIN[Math.floor(Math.random() * CONFIG.MESSAGES.WIN.length)], 'win');
            this.triggerWinEffect();
        } else if (payout < 0) {
            this.tokens += payout; // This handles the negative "CRASH" symbol
            this.addLog(`SYSTEM_CRASH: ${payout} TOKENS VOIDED.`, 'loss');
            this.addLog("Model weights collapsed into singularity.", 'loss');
        } else {
            this.addLog(CONFIG.MESSAGES.LOSS[Math.floor(Math.random() * CONFIG.MESSAGES.LOSS.length)]);
            if (Math.random() > 0.6) {
                this.addLog(CONFIG.MESSAGES.SYSTEM[Math.floor(Math.random() * CONFIG.MESSAGES.SYSTEM.length)], 'info');
            }
        }

        this.updateHype();
    }

    triggerWinEffect() {
        this.els.machine.classList.add('win-flash');
        setTimeout(() => this.els.machine.classList.remove('win-flash'), 1000);
    }

    updateHype() {
        const levels = ['STABLE', 'BULLISH', 'PARABOLIC', 'BUBBLE', 'CRASHING', 'DEATH_SPIRAL'];
        let level = levels[0];

        if (this.tokens > 1000) level = levels[3];
        else if (this.tokens > 500) level = levels[2];
        else if (this.tokens > 200) level = levels[1];
        else if (this.tokens < 50) level = levels[4];
        else if (this.tokens < 20) level = levels[5];

        this.els.hypeLevel.textContent = level;
        this.els.hypeLevel.style.color = (this.tokens < 50) ? 'var(--color-red)' : 'var(--color-green)';
    }

    updateUI() {
        // Smooth token counter (if we wanted to animate it, but simple update is fine for now)
        this.els.tokenCount.textContent = Math.max(0, this.tokens);

        // Progress = training completion
        const progress = Math.min(100, (this.spinsCount / 100) * 100);
        this.els.progress.style.width = `${progress}%`;
        this.els.progressText.textContent = `${Math.floor(progress)}%`;

        if (this.tokens < CONFIG.SPIN_COST && !this.isSpinning) {
            this.els.spinBtn.disabled = true;
            this.els.spinBtn.querySelector('.btn-text').textContent = "INSOLVENT";
            this.els.resetBtn.classList.remove('hidden');
            this.addLog("CRITICAL: RUNWAY DEPLETED. VC FUNDING REQUIRED.", 'loss');
        } else {
            this.els.spinBtn.disabled = this.isSpinning;
            this.els.spinBtn.querySelector('.btn-text').textContent = this.isSpinning ? "COMPUTING..." : "INITIALIZE SPIN";
            this.els.resetBtn.classList.add('hidden');
        }
    }

    requestFunding() {
        this.addLog("NEGOTIATING WITH ANDREESSEN HOROWITZ...", "info");
        this.els.resetBtn.disabled = true;
        this.els.resetBtn.textContent = "PITCHING DECK...";
        
        setTimeout(() => {
            this.tokens = CONFIG.INITIAL_TOKENS;
            this.addLog("SERIES A CLOSED. $100M VALUATION (VAPORWARE).", "win");
            this.els.resetBtn.disabled = false;
            this.els.resetBtn.textContent = "REQUEST SERIES A FUNDING";
            this.updateUI();
        }, 2000);
    }
}

// Entry Point
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Hallucinator9000();
});
