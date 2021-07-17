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
  camera: Camera;
  player: Player | undefined;
  baseMap: Map | undefined;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;
    this.camera = new Camera(ctx, engineConfig.camera);
    this.baseMap = new Map('', CrystalTileData);
  }

  checkMapCollider(pos: Position) {
    if (!this.baseMap) throw new Error('Basemap not inited');
    const nextTile = this.baseMap.getTile(pos.x, pos.y);

    if (this.baseMap.tileData.colliders.indexOf(nextTile) > -1) return true;
    return false;
  }

  update() {
    if (!this.player) throw new Error('Player not inited');
    if (!this.baseMap) throw new Error('Basemap not inited');

    window.requestAnimationFrame(() => {
      this.update();
    });

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;
    this.ctx.canvas.height = height;
    this.ctx.canvas.width = width;
    this.ctx.imageSmoothingEnabled = false;
    this.camera.renderMap(this.baseMap);

    this.camera.renderObject(this.player);
  }

  async start(loop = true) {
    this.player = await getPlayer(this, {x: 0, y: 0}, PlayerSprite);
    console.log('playerLoaded');
    this.baseMap = await loadMap(CrystalTileSprite, CrystalTileData);
    console.log('map loaded');

    this.player.position = {x: 3, y: 3};

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

    if (loop) this.update();
  }
}

export default Engine;