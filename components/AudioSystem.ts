
class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx!.currentTime, 0.1);
    }
  }

  /**
   * Realistic "fshshshs -> pshshsh" Firework sound.
   * Uses filtered white noise for the sizzle and a resonance-heavy burst.
   */
  public playFirework(isBig: boolean = false) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const vol = isBig ? 0.4 : 0.15;

    // 1. The Burst (psshshsh)
    const burstDuration = isBig ? 1.5 : 0.8;
    const burstBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * burstDuration, this.ctx.sampleRate);
    const burstData = burstBuffer.getChannelData(0);
    for (let i = 0; i < burstBuffer.length; i++) {
      burstData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = burstBuffer;

    const lpFilter = this.ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(isBig ? 1200 : 3000, now);
    lpFilter.frequency.exponentialRampToValueAtTime(40, now + burstDuration);
    lpFilter.Q.setValueAtTime(isBig ? 10 : 2, now);

    const burstGain = this.ctx.createGain();
    burstGain.gain.setValueAtTime(vol, now);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + burstDuration);

    noiseSource.connect(lpFilter);
    lpFilter.connect(burstGain);
    burstGain.connect(this.masterGain!);
    noiseSource.start(now);

    // 2. Extra Low Thump for "Big" ones
    if (isBig) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      g.gain.setValueAtTime(0.3, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  /**
   * The "fshshsh" launch sound
   */
  public playLaunch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const duration = 0.5;
    
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    source.start(now);
  }

  public playNeonFlicker() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500 + Math.random() * 500, now);
    gain.gain.setValueAtTime(0.008, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playClick() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  /**
   * Magical "Grand Exit" whoosh.
   */
  public playWhoosh() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const duration = 1.2;

    const playLayer = (fStart: number, fEnd: number, type: OscillatorType, v: number, detune = 0) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, now);
      osc.frequency.exponentialRampToValueAtTime(fEnd, now + duration);
      osc.detune.setValueAtTime(detune, now);
      g.gain.setValueAtTime(v, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + duration);
    };

    // Layered magical resonance
    playLayer(150, 2000, 'triangle', 0.04);
    playLayer(155, 2050, 'sine', 0.03, 10);
    playLayer(800, 4000, 'sine', 0.02, -5);
    
    // Magical sparkle chime at start of whoosh
    const chime = this.ctx.createOscillator();
    const chimeG = this.ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(3000, now);
    chimeG.gain.setValueAtTime(0.02, now);
    chimeG.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    chime.connect(chimeG);
    chimeG.connect(this.masterGain!);
    chime.start(now);
    chime.stop(now + 0.5);
  }
}

export const audioSystem = new AudioSystem();
