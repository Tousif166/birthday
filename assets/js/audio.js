// Web Audio API Sound & Music Synthesizer for Rajibul's Birthday
class SoundManager {
    constructor() {
        this.ctx = null;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.currentNoteIndex = 0;
        this.volume = 0.25;

        // Note frequencies (Hz)
        this.notes = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
            'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
        };

        // Happy Birthday Melody (Note, Duration in 16th beats)
        this.melody = [
            { note: 'G4', dur: 3 }, { note: 'G4', dur: 1 }, { note: 'A4', dur: 4 }, { note: 'G4', dur: 4 }, { note: 'C5', dur: 4 }, { note: 'B4', dur: 8 },
            { note: 'G4', dur: 3 }, { note: 'G4', dur: 1 }, { note: 'A4', dur: 4 }, { note: 'G4', dur: 4 }, { note: 'D5', dur: 4 }, { note: 'C5', dur: 8 },
            { note: 'G4', dur: 3 }, { note: 'G4', dur: 1 }, { note: 'G5', dur: 4 }, { note: 'E5', dur: 4 }, { note: 'C5', dur: 4 }, { note: 'B4', dur: 4 }, { note: 'A4', dur: 6 },
            { note: 'F5', dur: 3 }, { note: 'F5', dur: 1 }, { note: 'E5', dur: 4 }, { note: 'C5', dur: 4 }, { note: 'D5', dur: 4 }, { note: 'C5', dur: 10 }
        ];

        // Restore state from localStorage
        const savedBgm = localStorage.getItem('birthday_bgm_state');
        if (savedBgm === 'true') {
            // Auto-arm music on first user interaction
            const autoStart = () => {
                this.startBGM();
                window.removeEventListener('click', autoStart);
                window.removeEventListener('keydown', autoStart);
            };
            window.addEventListener('click', autoStart, { once: true });
            window.addEventListener('keydown', autoStart, { once: true });
        }
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, duration, type = 'sine', gainLevel = 0.2) {
        this.initContext();
        if (!freq || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Music box / bell-like harmonic envelope
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(gainLevel * this.volume, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playChime(noteName, duration = 0.8) {
        const freq = this.notes[noteName];
        if (!freq) return;
        this.initContext();

        // Layer 1: Fundamental sine
        this.playTone(freq, duration, 'sine', 0.25);
        // Layer 2: Soft harmonic overtone (vibraphone effect)
        this.playTone(freq * 2, duration * 0.6, 'triangle', 0.08);
    }

    startBGM() {
        this.initContext();
        if (this.bgmPlaying) return;
        this.bgmPlaying = true;
        localStorage.setItem('birthday_bgm_state', 'true');
        this.updateMusicUI(true);
        this.playMelodyStep();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
        localStorage.setItem('birthday_bgm_state', 'false');
        this.updateMusicUI(false);
    }

    toggleBGM() {
        if (this.bgmPlaying) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
    }

    playMelodyStep() {
        if (!this.bgmPlaying) return;

        const item = this.melody[this.currentNoteIndex];
        const tempo = 120; // ms per 16th unit
        const durationSec = (item.dur * tempo) / 1000;

        this.playChime(item.note, durationSec * 1.5);

        this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

        // If loop finished, add a gentle pause before repeating
        const waitMs = (this.currentNoteIndex === 0) ? 2200 : (item.dur * tempo);
        this.bgmTimer = setTimeout(() => this.playMelodyStep(), waitMs);
    }

    // Free Fire BOOYAH triumphant fanfare
    playBooyah() {
        this.initContext();
        const fanfares = [
            { note: 'C5', time: 0, dur: 0.15 },
            { note: 'E5', time: 0.12, dur: 0.15 },
            { note: 'G5', time: 0.24, dur: 0.2 },
            { note: 'C6', time: 0.42, dur: 0.6 },
            { note: 'G5', time: 0.65, dur: 0.2 },
            { note: 'C6', time: 0.85, dur: 1.2 }
        ];

        fanfares.forEach(f => {
            setTimeout(() => {
                const freq = this.notes[f.note];
                this.playTone(freq, f.dur, 'triangle', 0.4);
                this.playTone(freq * 0.5, f.dur, 'sine', 0.25);
            }, f.time * 1000);
        });
    }

    // Candle blowing whoosh + sparkle chime
    playBlowCandle() {
        this.initContext();
        if (!this.ctx) return;

        // Wind / noise burst
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        // Followed by twinkling magic chime
        setTimeout(() => {
            ['G5', 'B5', 'D6', 'G6'].forEach((n, i) => {
                setTimeout(() => this.playChime(n, 0.4), i * 80);
            });
        }, 300);
    }

    playConfettiPop() {
        this.initContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playClick() {
        this.initContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    updateMusicUI(isPlaying) {
        const btn = document.getElementById('musicToggleBtn');
        const waves = document.querySelectorAll('.music-wave');
        if (btn) {
            if (isPlaying) {
                btn.classList.add('playing');
                btn.setAttribute('title', 'Pause Birthday Melody');
                btn.setAttribute('aria-label', 'Pause Birthday Melody');
            } else {
                btn.classList.remove('playing');
                btn.setAttribute('title', 'Play Birthday Melody');
                btn.setAttribute('aria-label', 'Play Birthday Melody');
            }
        }
        waves.forEach(w => {
            w.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });
    }
}

window.soundManager = new SoundManager();

