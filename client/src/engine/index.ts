import {Camera} from 'engine/camera/camera';

import getPlayer, {Player} from 'engine/player/player';
import {Map, loadMap} from 'engine/maps/Map';
import CrystalTileData from 'engine/maps/tiled_data/crystal_base';
import CrystalTileSprite from 'assets/tilemaps/crystal_min.png';

import engineConfig from './engine_config';

class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  player: Player;
  camera: Camera;
  baseMap: Map | undefined;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;
    this.player = new Player();
    this.camera = new Camera(ctx, engineConfig.camera);
  }

  update() {
    console.log('loop');

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
    // console.log(`place ${tile} to ${tileX},${tileY}`);
    // console.log(`place ${tile} to ${c - startCol},${r - startRow}`);

    if (this.baseMap) {
      this.camera.renderMap(this.baseMap);
    }

    // this.camera.renderMap(
    // render player
    // const ctx = this.ctx;
    // ctx.drawImage(
    //   this.player.playerImg,
    //   16 * 2,
    //   0,
    //   sprite_size,
    //   sprite_size,
    //   player.x * scale_f,
    //   player.y * scale_f,
    //   scale_f,
    //   scale_f,
    // );
  }

  async start(loop = true) {
    this.player = await getPlayer({x: 0, y: 0});
    console.log('playerLoaded');
    this.baseMap = await loadMap(CrystalTileSprite, CrystalTileData);
    console.log('map loaded');

    // inital rendering
    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.imageSmoothingEnabled = false;

    // render map
    if (this.baseMap) {
      this.camera.renderMap(this.baseMap);
    }
    // if (loop) this.update();
  }
}

export default Engine;
