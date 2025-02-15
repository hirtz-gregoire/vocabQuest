class SpeechAPI {
    public synth: SpeechSynthesis;
    private lang: string;
    private volume: number;
    private rate: number;
    private pitch: number;
    private voice: SpeechSynthesisVoice;
    public recognition: any | null;
    private isRecognizing: boolean;

    constructor() {
        this.synth = window.speechSynthesis;
        this.lang = "fr";
        this.volume = 1;
        this.rate = 1;
        this.pitch = 1;
        this.voice = this.getDefaultVoice();
        this.recognition = this.initRecognition();
        this.isRecognizing = false;
    }

    private initRecognition(): any | null {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            console.warn("Speech recognition is not supported in this browser");
            return null;
        }

        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = this.lang;

        recognition.onstart = () => {
            this.isRecognizing = true;
        };

        recognition.onend = () => {
            this.isRecognizing = false;
            speechAPI.startRecognition();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Recognized text:", transcript);
        };

        return recognition;
    }

    public requestSynth(text: string): void {
        if (!this.synth) {
            console.error("Speech synthesis is not supported in this browser");
            return;
        }

        if (!this.voice) {
            console.error(`No voice found for language ${this.lang}`);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.lang;
        utterance.volume = this.volume;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.voice = this.voice;

        this.synth.speak(utterance);
    }

    public startRecognition(): void {
        if (this.recognition && !this.isRecognizing) {
            this.recognition.start();
        }
    }

    public stopRecognition(): void {
        if (this.recognition && this.isRecognizing) {
            this.recognition.stop();
        }
    }

    public getDefaultVoice(): SpeechSynthesisVoice {
        return speechAPI_voices.find(voice => voice.lang.startsWith(this.lang)) || speechAPI_voices[0] || null;
    }

    public setLanguage(lang: string): void {
        this.lang = lang;
        this.voice = this.getDefaultVoice();
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    public getLanguage(): string {
        return this.lang;
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

    public setOnRecognitionResult(funct: (event) => void) {
        if(this.recognition) {
            this.recognition.onresult = funct;
        }
    }
}

export let speechAPI_voices: SpeechSynthesisVoice[] = [];
export const speechAPI = new SpeechAPI();

const loadVoices = () => {
    speechAPI_voices = window.speechSynthesis.getVoices();
    speechAPI.setLanguage(speechAPI.getLanguage())
};
loadVoices();
window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
