import getPlayer, {Player} from 'engine/player/player';
import {Camera} from 'engine/camera/camera';

import EngineConfig from './engine_config';

class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  player: Player;
  camera: Camera;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;
    this.player = new Player();
    this.camera = new Camera(ctx, 10, 8, 2);
  }

  update() {
    window.requestAnimationFrame(() => {
      this.update();
    });

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.imageSmoothingEnabled = false;

    let sprite_size = 16;
    let scale_f = 3 * sprite_size;
    let player = {
      x: 1,
      y: 1,
    };

    this.ctx.drawImage(
      this.player.playerImg,
      16 * 2,
      0,
      sprite_size,
      sprite_size,
      player.x * scale_f,
      player.y * scale_f,
      scale_f,
      scale_f,
    );
  }

  async start(loop = true) {
    this.player = await getPlayer({x: 0, y: 0});
    console.log('playerLoaded');

    if (loop) this.update();
  }
}

export default Engine;
