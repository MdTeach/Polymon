import {Camera} from 'engine/camera/camera';
import Scene from './scenes/scene';
import {getBaseScene} from './scenes/base_scene/base_scene';

class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  camera: Camera | undefined;
  secene: Scene | undefined;
  pausedScene: Scene | undefined;

  time = {
    now: 10,
    lastFrame: 0,
    delta: 0,
    lastFPS: 0,
    fps: () => Math.floor((1 / this.time.delta) * 1000),
  };

  input = {
    movementKeys: ['a', 'd', 'w', 's'],
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

  constructor(ctx: CanvasRenderingContext2D) {
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
  }

  // switch between two scenes
  switchScene(currentScene: Scene, newScene: Scene) {
    //
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

    this.secene = await getBaseScene(this);
    await this.secene.start_scene();

    if (loop) this.update();
  }
}

export default Engine;
