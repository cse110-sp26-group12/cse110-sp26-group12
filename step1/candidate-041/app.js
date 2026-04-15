const SYMBOLS = [
    { char: '🚀', name: 'Hype', value: 10 },
    { char: '🤖', name: 'Bot', value: 5 },
    { char: '📉', name: 'Dip', value: 2 },
    { char: '🌫️', name: 'Vapor', value: 0 },
    { char: '🦄', name: 'Unicorn', value: 50 },
    { char: '🎭', name: 'Hallucination', value: 1 }
];

const WIN_MESSAGES = [
    "Venture capital secured!",
    "Your hallucination was convincing!",
    "Pivot successful: You're an AI company now.",
    "Stock price manipulated upward.",
    "Unicorn status achieved (temporarily)."
];

const LOSS_MESSAGES = [
    "GPU credits wasted on noise.",
    "Model collapsed into gibberish.",
    "Token limit reached. Please pay more.",
    "The dataset was just reddit comments.",
    "Safety filters blocked your win."
];

class SlotMachine {
    constructor() {
        this.credits = 100.00;
        this.hype = 0;
        this.isSpinning = false;
        this.costPerSpin = 5.00;

        // DOM elements
        this.creditsEl = document.getElementById('credits');
        this.hypeEl = document.getElementById('hype');
        this.promptBtn = document.getElementById('prompt-btn');
        this.statusEl = document.getElementById('status-display');
        
        this.strips = [
            document.getElementById('strip1'),
            document.getElementById('strip2'),
            document.getElementById('strip3')
        ];

        this.init();
    }

    init() {
        // Build initial strips
        this.strips.forEach(strip => {
            this.populateStrip(strip);
        });

        this.promptBtn.addEventListener('click', () => this.spin());
    }

    populateStrip(strip, firstChar = null) {
        strip.innerHTML = '';
        
        // If we want to start with a specific character (the previous result)
        if (firstChar) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = firstChar;
            strip.appendChild(div);
        }

        // Create random symbols for the strip
        for (let i = 0; i < 20; i++) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = sym.char;
            strip.appendChild(div);
        }
    }

    async spin() {
        if (this.isSpinning || this.credits < this.costPerSpin) return;

        this.isSpinning = true;
        this.credits -= this.costPerSpin;
        this.updateUI();
        this.statusEl.textContent = "Processing prompt...";
        this.statusEl.style.color = "#ccc";
        this.promptBtn.disabled = true;

        const results = [];
        const spinPromises = this.strips.map((strip, index) => {
            const delay = index * 200;
            const duration = 1500 + (index * 500);
            
            return new Promise(resolve => {
                setTimeout(() => {
                    strip.classList.add('spinning');
                    
                    setTimeout(() => {
                        strip.classList.remove('spinning');
                        const finalSymbolIndex = Math.floor(Math.random() * SYMBOLS.length);
                        const finalSymbol = SYMBOLS[finalSymbolIndex];
                        results.push(finalSymbol);
                        
                        // Set the final symbol in view
                        strip.innerHTML = `<div class="symbol">${finalSymbol.char}</div>`;
                        resolve();
                    }, duration);
                }, delay);
            });
        });

        await Promise.all(spinPromises);
        this.checkWin(results);
        this.isSpinning = false;
        this.promptBtn.disabled = false;
        
        // Reset strips for next spin (visual only) after a short delay
        setTimeout(() => {
            if (!this.isSpinning) {
                this.strips.forEach((strip, index) => {
                    this.populateStrip(strip, results[index].char);
                });
            }
        }, 1000);
    }

    checkWin(results) {
        const allSame = results.every(val => val.char === results[0].char);
        const winAmount = allSame ? results[0].value * 10 : 0;

        if (winAmount > 0) {
            this.credits += winAmount;
            this.hype = Math.min(100, this.hype + 20);
            this.statusEl.textContent = `WIN! +${winAmount} Credits. ${WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]}`;
            this.statusEl.style.color = "var(--accent-color)";
        } else {
            this.hype = Math.max(0, this.hype - 5);
            this.statusEl.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
            this.statusEl.style.color = "#ccc";
        }
        
        this.updateUI();
    }

    updateUI() {
        this.creditsEl.textContent = this.credits.toFixed(2);
        this.hypeEl.textContent = `${this.hype}%`;
        
        if (this.credits < this.costPerSpin) {
            this.promptBtn.textContent = "OUT OF COMPUTE";
            this.promptBtn.disabled = true;
            this.statusEl.textContent = "Please wait for more funding (Refresh page).";
        }
    }
}

// Start the game
window.addEventListener('DOMContentLoaded', () => {
    new SlotMachine();
});
