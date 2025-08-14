class StachieTamagotchi {
    constructor() {
        this.stats = {
            hunger: 70,
            hygiene: 80,
            energy: 60,
            health: 90
        };

        this.state = {
            mood: 'content',
            isSleeping: false,
            isSick: false,
            hasWaste: false,
            lastFed: Date.now(),
            lastCleaned: Date.now(),
            lastSlept: Date.now(),
            lastPlayed: Date.now()
        };

        this.canvas = document.getElementById('petCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.animations = {
            idle: { frame: 0, maxFrames: 2, speed: 500 },
            eating: { frame: 0, maxFrames: 3, speed: 200 },
            sleeping: { frame: 0, maxFrames: 2, speed: 1000 },
            playing: { frame: 0, maxFrames: 4, speed: 150 }
        };

        this.currentAnimation = 'idle';
        this.lastAnimationTime = Date.now();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startGameLoop();
        this.updateDisplay();
        this.drawStachie();

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(console.error);
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.performAction(action);
            });
        });
    }

    performAction(action) {
        if (this.state.isSleeping && action !== 'sleep') {
            this.showNotification("Stachie is sleeping! 😴");
            return;
        }

        switch(action) {
            case 'feed':
                this.feed();
                break;
            case 'clean':
                this.clean();
                break;
            case 'sleep':
                this.toggleSleep();
                break;
            case 'play':
                this.play();
                break;
            case 'medicine':
                this.giveMedicine();
                break;
            case 'litter':
                this.cleanLitter();
                break;
        }
    }

    feed() {
        if (this.stats.hunger > 80) {
            this.showNotification("Stachie is full! 😊");
            return;
        }

        this.stats.hunger = Math.min(100, this.stats.hunger + 30);
        this.state.lastFed = Date.now();
        this.currentAnimation = 'eating';
        this.showThought('😋');
        this.showNotification("Yummy! 🍖");

        setTimeout(() => {
            this.currentAnimation = 'idle';
            this.hideThought();
            if (Math.random() > 0.7) {
                this.state.hasWaste = true;
                this.showWaste();
            }
        }, 2000);

        this.updateDisplay();
    }

    clean() {
        if (this.stats.hygiene > 80) {
            this.showNotification("Stachie is already clean! ✨");
            return;
        }

        this.stats.hygiene = Math.min(100, this.stats.hygiene + 25);
        this.state.lastCleaned = Date.now();
        this.showThought('🧼');
        this.showNotification("All clean! 🧹");

        setTimeout(() => this.hideThought(), 2000);
        this.updateDisplay();
    }

    toggleSleep() {
        this.state.isSleeping = !this.state.isSleeping;

        if (this.state.isSleeping) {
            this.currentAnimation = 'sleeping';
            this.showNotification("Sweet dreams! 😴");
            this.showThought('💤');
            document.querySelector('.pet-area').style.filter = 'brightness(0.7)';
        } else {
            this.currentAnimation = 'idle';
            this.stats.energy = Math.min(100, this.stats.energy + 40);
            this.state.lastSlept = Date.now();
            this.showNotification("Good morning! ☀️");
            this.hideThought();
            document.querySelector('.pet-area').style.filter = 'brightness(1)';
        }

        this.updateDisplay();
    }

    play() {
        if (this.stats.energy < 20) {
            this.showNotification("Stachie is too tired! 😫");
            return;
        }

        this.currentAnimation = 'playing';
        this.stats.energy = Math.max(0, this.stats.energy - 15);
        this.state.lastPlayed = Date.now();
        this.showThought('🧶');
        this.showNotification("So fun! 🎉");

        if (this.state.mood === 'anxious') {
            this.state.mood = 'happy';
        }

        setTimeout(() => {
            this.currentAnimation = 'idle';
            this.hideThought();
        }, 3000);

        this.updateDisplay();
    }

    giveMedicine() {
        if (!this.state.isSick) {
            this.showNotification("Stachie is healthy! 💪");
            return;
        }

        this.state.isSick = false;
        this.stats.health = Math.min(100, this.stats.health + 30);
        this.showThought('💊');
        this.showNotification("Feeling better! 💕");

        setTimeout(() => this.hideThought(), 2000);
        this.updateDisplay();
    }

    cleanLitter() {
        if (!this.state.hasWaste) {
            this.showNotification("Litter box is clean! 🚽");
            return;
        }

        this.state.hasWaste = false;
        this.hideWaste();
        this.stats.hygiene = Math.min(100, this.stats.hygiene + 10);
        this.showNotification("Litter box cleaned! ✨");
        this.updateDisplay();
    }

    startGameLoop() {
        setInterval(() => {
            this.updateStats();
            this.checkHealth();
            this.updateMood();
            this.updateDisplay();
            this.animate();
        }, 1000);

        setInterval(() => {
            this.saveGame();
        }, 5000);
    }

    updateStats() {
        if (!this.state.isSleeping) {
            this.stats.hunger = Math.max(0, this.stats.hunger - 0.5);
            this.stats.energy = Math.max(0, this.stats.energy - 0.3);
        } else {
            this.stats.energy = Math.min(100, this.stats.energy + 0.8);
        }

        this.stats.hygiene = Math.max(0, this.stats.hygiene - 0.2);

        if (this.state.hasWaste) {
            this.stats.hygiene = Math.max(0, this.stats.hygiene - 0.3);
        }
    }

    checkHealth() {
        if (this.stats.hunger < 20 || this.stats.hygiene < 20) {
            this.stats.health = Math.max(0, this.stats.health - 0.5);
        } else if (this.stats.hunger > 60 && this.stats.hygiene > 60) {
            this.stats.health = Math.min(100, this.stats.health + 0.1);
        }

        if (this.stats.health < 40 && !this.state.isSick) {
            this.state.isSick = true;
            this.showNotification("Stachie is feeling sick! 🤒");
        } else if (this.stats.health > 60 && this.state.isSick) {
            this.state.isSick = false;
        }
    }

    updateMood() {
        const avgStats = (this.stats.hunger + this.stats.hygiene + this.stats.energy + this.stats.health) / 4;

        if (this.state.isSick) {
            this.state.mood = 'sick';
        } else if (avgStats < 30) {
            this.state.mood = 'sad';
        } else if (avgStats < 50) {
            this.state.mood = 'anxious';
        } else if (avgStats < 70) {
            this.state.mood = 'content';
        } else {
            this.state.mood = 'happy';
        }
    }

    updateDisplay() {
        document.getElementById('hungerBar').style.width = `${this.stats.hunger}%`;
        document.getElementById('hygieneBar').style.width = `${this.stats.hygiene}%`;
        document.getElementById('energyBar').style.width = `${this.stats.energy}%`;
        document.getElementById('healthBar').style.width = `${this.stats.health}%`;

        const moodEmojis = {
            happy: '😊 Happy',
            content: '😌 Content',
            anxious: '😰 Anxious',
            sad: '😢 Sad',
            sick: '🤒 Sick'
        };

        document.getElementById('moodDisplay').textContent = `Mood: ${moodEmojis[this.state.mood]}`;

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.toggle('disabled', this.state.isSleeping && btn.dataset.action !== 'sleep');
        });
    }

    drawStachie() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const pixelSize = 8;
        const startX = 60;
        const startY = 100;

        this.ctx.imageSmoothingEnabled = false;

        // Pixel art representation of Stachie in loaf position
        const stachiePixels = [
            // Ears row
            [0,0,0,0,2,1,0,0,0,0,0,0,0,0,1,2,0,0,0,0],
            [0,0,0,2,3,3,1,0,0,0,0,0,0,1,3,3,2,0,0,0],
            [0,0,0,1,3,3,3,1,1,1,1,1,1,3,3,3,1,0,0,0],
            // Head
            [0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
            [0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
            [0,0,1,3,4,4,3,3,3,3,3,3,3,4,4,3,3,1,0,0],
            [0,0,1,3,5,4,3,3,3,6,3,3,3,5,4,3,3,1,0,0],
            [0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0],
            [0,0,1,3,3,3,3,7,7,7,7,7,3,3,3,3,3,1,0,0],
            // Body start
            [0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
            [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
            [1,3,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
            [1,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
            [1,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
            // Paws and bottom
            [1,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,2,2,2,1],
            [0,1,4,4,1,1,3,3,3,3,3,3,3,3,1,1,2,2,1,0],
            [0,0,1,1,0,0,1,1,1,1,1,1,1,1,0,0,1,1,0,0],
        ];

        // Tail addition (extends to the right)
        const tailPixels = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,2,0,0],
            [0,0,0,0,1,2,3,3,2,0],
            [0,0,0,1,3,3,3,3,2,0],
            [0,0,1,3,3,3,3,2,1,0],
            [0,1,3,3,3,3,2,1,0,0],
            [1,3,3,3,2,2,1,0,0,0],
            [1,2,2,2,1,1,0,0,0,0],
            [0,1,1,1,0,0,0,0,0,0],
        ];

        // Color palette
        const colors = {
            0: null, // transparent
            1: '#2C2C2C', // dark outline
            2: '#505050', // medium gray
            3: '#808080', // light gray (main body)
            4: '#A0A0A0', // lighter gray (chest/paws)
            5: '#000000', // black (eyes)
            6: '#FFB6C1', // pink (nose)
            7: '#606060', // mustache gray
        };

        // Add subtle breathing animation
        const breathOffset = Math.sin(Date.now() / 200) * 0.5;

        // Draw main body
        for (let y = 0; y < stachiePixels.length; y++) {
            for (let x = 0; x < stachiePixels[y].length; x++) {
                const colorIndex = stachiePixels[y][x];
                if (colors[colorIndex]) {
                    this.ctx.fillStyle = colors[colorIndex];
                    const yOffset = y > 8 ? breathOffset : 0; // Only animate body, not head
                    this.ctx.fillRect(
                        startX + x * pixelSize,
                        startY + y * pixelSize + yOffset,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }

        // Draw tail
        for (let y = 0; y < tailPixels.length; y++) {
            for (let x = 0; x < tailPixels[y].length; x++) {
                const colorIndex = tailPixels[y][x];
                if (colors[colorIndex]) {
                    this.ctx.fillStyle = colors[colorIndex];
                    this.ctx.fillRect(
                        startX + (stachiePixels[0].length + x - 2) * pixelSize,
                        startY + y * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }

        // Draw sleeping Z's if sleeping
        if (this.state.isSleeping) {
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = '#4A90E2';
            const zOffset = Math.sin(Date.now() / 500) * 5;
            this.ctx.fillText('Z', startX + 180, startY - 10 + zOffset);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('z', startX + 200, startY - 20 + zOffset);
            this.ctx.font = '12px Arial';
            this.ctx.fillText('z', startX + 215, startY - 28 + zOffset);
        }

        // Draw mood indicators
        if (this.state.mood === 'happy' && !this.state.isSleeping) {
            // Draw hearts around Stachie
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#FF69B4';
            const heartFloat = Math.sin(Date.now() / 800) * 3;
            this.ctx.fillText('💕', startX - 20, startY + 40 + heartFloat);
            this.ctx.fillText('💕', startX + 180, startY + 40 - heartFloat);
        } else if (this.state.mood === 'sick') {
            // Draw sweat drops
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillText('💧', startX + 30, startY + 10);
            this.ctx.fillText('💧', startX + 140, startY + 10);
        } else if (this.state.mood === 'anxious') {
            // Draw worry lines
            this.ctx.strokeStyle = '#666666';
            this.ctx.lineWidth = 2;
            const wobble = Math.sin(Date.now() / 300) * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(startX - 10 + wobble, startY + 20);
            this.ctx.lineTo(startX - 20 + wobble, startY + 15);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(startX + 170 - wobble, startY + 20);
            this.ctx.lineTo(startX + 180 - wobble, startY + 15);
            this.ctx.stroke();
        }
    }

    animate() {
        const now = Date.now();
        if (now - this.lastAnimationTime > this.animations[this.currentAnimation].speed) {
            this.lastAnimationTime = now;
            this.drawStachie();
        }
    }

    showThought(emoji) {
        const bubble = document.getElementById('thoughtBubble');
        bubble.textContent = emoji;
        bubble.style.display = 'block';
    }

    hideThought() {
        document.getElementById('thoughtBubble').style.display = 'none';
    }

    showWaste() {
        const indicator = document.getElementById('wasteIndicator');
        indicator.textContent = '💩';
        indicator.style.display = 'block';
        indicator.style.left = Math.random() * 200 + 50 + 'px';
    }

    hideWaste() {
        document.getElementById('wasteIndicator').style.display = 'none';
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    saveGame() {
        const gameData = {
            stats: this.stats,
            state: this.state,
            timestamp: Date.now()
        };
        localStorage.setItem('stachieGame', JSON.stringify(gameData));
    }

    loadGame() {
        const saved = localStorage.getItem('stachieGame');
        if (saved) {
            const gameData = JSON.parse(saved);
            const timePassed = (Date.now() - gameData.timestamp) / 1000 / 60;

            this.stats = gameData.stats;
            this.state = gameData.state;

            this.stats.hunger = Math.max(0, this.stats.hunger - timePassed * 0.5);
            this.stats.energy = Math.max(0, this.stats.energy - timePassed * 0.3);
            this.stats.hygiene = Math.max(0, this.stats.hygiene - timePassed * 0.2);

            this.showNotification(`Welcome back! Stachie missed you! 💕`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new StachieTamagotchi();
    game.loadGame();
});