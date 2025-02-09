class SpeechAPI {
    public synth: SpeechSynthesis;
    private lang: string;
    private volume: number;
    private rate: number;
    private pitch: number;
    private voice: SpeechSynthesisVoice;

    constructor() {
        this.synth = window.speechSynthesis;
        this.lang = "fr";
        this.volume = 1;
        this.rate = 1;
        this.pitch = 1;
        this.voice = this.getDefaultVoice();
    }

    public requestSynth(text: string): void {
        if (!this.synth) {
            console.error("Speech synthesis is not supported in this browser");
            return;
        }

        if (!this.voice) {
            console.error(`No voice found for language ${this.lang}`)
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.lang;
        utterance.volume = this.volume;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.voice = this.voice;

        this.synth.speak(utterance);
    }

    public getDefaultVoice(): SpeechSynthesisVoice {
        return speechAPI_voices.find(voice => voice.lang.startsWith(this.lang)) || speechAPI_voices[0] || null;
    }

    public setLanguage(lang: string): void {
        this.lang = lang;
        this.voice = this.getDefaultVoice();
    }

    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    public setRate(rate: number): void {
        this.rate = Math.max(0.1, Math.min(10, rate));
    }

    public setPitch(pitch: number): void {
        this.pitch = Math.max(0, Math.min(2, pitch));
    }

    public setVoice(voice: SpeechSynthesisVoice): void {
        this.voice = voice;
    }
}

export const speechAPI_voices = window.speechSynthesis.getVoices()
export const speechAPI = new SpeechAPI();