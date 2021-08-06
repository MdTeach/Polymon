class AudioPlayer {
  audio: HTMLAudioElement;
  constructor() {
    this.audio = new Audio();
    this.audio.loop = true;
  }

  play(audioURI: string) {
    this.audio.src = audioURI;
    this.audio.play();
  }

  stop() {
    this.audio.pause();
  }
}

export default AudioPlayer;
