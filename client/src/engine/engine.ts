import {Camera} from 'engine/camera/camera';
import Scene from './scenes/scene';
import AudioPlayer from './audio/AudioPlayer';
import BaseScene from './scenes/base_scene/base_scene';
import {getBattleScene} from './scenes/battle_scene/base_battle_scene';
import {Map} from 'engine/maps/Map';

class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  camera: Camera | undefined;
  secene: Scene | undefined;
  pausedScene: Scene | undefined;
  audioPlayer: AudioPlayer;
  time = {
    now: 10,
    lastFrame: 0,
    delta: 0,
    lastFPS: 0,
    fps: () => Math.floor((1 / this.time.delta) * 1000),
  };

  input = {
    movementKeys: ['a', 'd', 'w', 's', ' '],
    interactKey: ['space'],
    _keys: {} as {[key: string]: boolean},
    _isDown: (key: string) => {
      if (this.input.movementKeys.indexOf(key) > -1) {
        return this.input._keys[key];
      }
      return false;
    },
    _onKeyDown: (e: KeyboardEvent) => {
      const key = e.key;
      if (this.input.movementKeys.indexOf(key) > -1) {
        this.input._keys[key] = true;
      }
    },
    _onKeyUp: (e: KeyboardEvent) => {
      const key = e.key;
      if (this.input.movementKeys.indexOf(key) > -1) {
        this.input._keys[key] = false;
      }
    },
  };
  mapData: Map;

  constructor(ctx: CanvasRenderingContext2D, mapData: Map) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;

    // listen to the input events
    this.input.movementKeys.forEach((el) => {
      this.input._keys[el] = false;
    });
    document.addEventListener('keydown', (e) => {
      this.input._onKeyDown(e);
    });
    document.addEventListener('keyup', (e) => {
      this.input._onKeyUp(e);
    });

    // init audio player
    this.audioPlayer = new AudioPlayer();
    this.mapData = mapData;
  }

  // switch between two scenes
  switchScene(currentScene: Scene, newScene: Scene) {
    //pause the audio
    this.audioPlayer.stop();

    this.pausedScene = currentScene;
    this.secene = newScene;
  }

  async update() {
    window.requestAnimationFrame(() => {
      this.update();
    });

    // time clock
    const currentTime = window.performance.now();
    this.time.delta = (currentTime - this.time.lastFrame) / 1000;
    this.time.lastFrame = currentTime;

    // context setup
    this.ctx.canvas.height = document.documentElement.clientHeight;
    this.ctx.canvas.width = document.documentElement.clientWidth;
    this.ctx.imageSmoothingEnabled = false;

    console.log('loop');
    if (!this.secene) throw new Error('Player not inited');

    this.secene.update_scene();
  }

  async start(loop = true) {
    this.ctx.canvas.height = document.documentElement.clientHeight;
    this.ctx.canvas.width = document.documentElement.clientWidth;
    this.ctx.imageSmoothingEnabled = false;

    // this.secene = await getBaseScene(this);
    this.secene = new BaseScene(this, this.ctx, this.mapData);
    // this.secene = await getBattleScene(this);
    await this.secene.start_scene();

    if (loop) this.update();
  }
}

export default Engine;
