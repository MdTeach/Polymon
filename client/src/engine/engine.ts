import {Camera} from 'engine/camera/camera';

import getPlayer, {Player} from 'engine/player/player';
import PlayerSprite from 'assets/player/player.png';
import {Map, loadMap} from 'engine/maps/Map';
import CrystalTileData from 'engine/maps/tiled_data/crystal_base';
import CrystalTileSprite from 'assets/tilemaps/crystal_min.png';

import engineConfig from './engine_config';
import {Position} from 'types/Common';

class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  camera: Camera | undefined;
  player: Player | undefined;
  baseMap: Map | undefined;

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

  checkMapCollider(pos: Position) {
    if (!this.baseMap) throw new Error('Basemap not inited');
    if (!this.camera) throw new Error('Camera not inited');

    pos.x += this.camera.x;
    pos.y += this.camera.y;
    const nextTile = this.baseMap.getTile(pos.x, pos.y);

    if (this.baseMap.tileData.colliders.indexOf(nextTile) > -1) return true;
    return false;
  }

  update() {
    if (!this.player) throw new Error('Player not inited');
    if (!this.baseMap) throw new Error('Basemap not inited');
    if (!this.camera) throw new Error('Camera not inited');

    // time clock
    const currentTime = window.performance.now();
    this.time.delta = (currentTime - this.time.lastFrame) / 1000;
    this.time.lastFrame = currentTime;
    // console.log('fps', this.time.fps());

    window.requestAnimationFrame(() => {
      this.update();
    });

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.imageSmoothingEnabled = false;

    this.player.update();
    this.camera.follow(this.player);

    this.camera.renderMap(this.baseMap);
    this.camera.renderObject(this.player);

    // render text
    // let ctx = this.ctx;
    // ctx.font = 'bold 50px serif';
    // ctx.fillStyle = '#008000';
    // if (Math.floor(window.performance.now()) % 5 === 0) {
    //   this.time.lastFPS = this.time.fps();
    // }
    // ctx.fillText(`FPS ${this.time.lastFPS}`, 200, 500);
  }

  async start(loop = true) {
    this.player = await getPlayer(this, {x: 0, y: 0}, PlayerSprite);
    this.baseMap = await loadMap(CrystalTileSprite, CrystalTileData);
    this.camera = new Camera(this.ctx, engineConfig.camera, this.baseMap);
    console.log('playerLoaded');
    console.log('map loaded');

    this.player.position = {
      x: this.camera.config.width / 2,
      y: this.camera.config.height / 2,
    };

    this.camera.x = this.player.position.x - this.camera.config.width / 2;
    this.camera.y = this.player.position.y - this.camera.config.height / 2;

    // inital rendering
    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.imageSmoothingEnabled = false;

    // render map
    this.camera.renderMap(this.baseMap);

    // player render
    this.camera.renderObject(this.player);
    console.log(this.camera.x, this.camera.y);

    this.update();
  }
}

export default Engine;
