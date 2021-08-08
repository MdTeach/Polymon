import Engine from 'engine/engine';
import Scene from '../scene';

import getPlayer, {Player} from 'engine/player/player';
import PlayerSprite from 'assets/player/player.png';
import {Map, loadMap} from 'engine/maps/Map';
import CrystalTileData from 'engine/maps/tiled_data/crystal_base';
import CrystalTileSprite from 'assets/tilemaps/crystal_min.png';
import {Camera} from 'engine/camera/camera';
import engineConfig from 'engine/engine_config';
import {Position} from 'types/Common';
import {getBattleScene} from '../battle_scene/base_battle_scene';

class BaseScene extends Scene {
  camera: Camera | undefined;
  player: Player | undefined;
  baseMap: Map | undefined;

  // TODOS
  constructor(engine: Engine, ctx: CanvasRenderingContext2D, baseMap: Map) {
    super(engine);
    this.baseMap = baseMap;
  }

  // pokemon on enter grass
  async pokemon_on_enter_grass() {
    if (!this.player) throw new Error('Player not loaded');
    if (!this.baseMap) throw new Error('Map not loaded');
    if (
      this.checkLocationEvent(
        this.player.position,
        this.baseMap.tileData.catchArea,
      ) &&
      this.player.isMoving
    ) {
      if (Math.random() < 0.01) {
        console.log('pokemon');
        // Invoke the secene transfer event
        // 1) save the current scene
        // 2) change the scene
        const battleScene = await getBattleScene(this.engine);
        this.engine.switchScene(this, battleScene);
      }
    }
  }

  checkMapCollider(pos: Position) {
    if (!this.baseMap) throw new Error('Basemap not inited');
    if (!this.camera) throw new Error('Camera not inited');

    let x = Math.floor(pos.x);
    let y = Math.floor(pos.y);
    const tile = this.baseMap.getTile(x, y);

    if (this.baseMap.tileData.colliders.indexOf(tile) > -1) {
      return true;
    }
    return false;
  }

  checkLocationEvent(pos: Position, tile: number) {
    if (!this.baseMap) throw new Error('Basemap not inited');
    if (!this.camera) throw new Error('Camera not inited');

    let x = Math.floor(pos.x);
    let y = Math.floor(pos.y);
    return tile === this.baseMap.getTile(x, y);
  }

  async start_scene() {
    this.player = await getPlayer(this, {x: 0, y: 0}, PlayerSprite);
    // this.baseMap = await loadMap(CrystalTileSprite, CrystalTileData);

    // music start
    if (!this.baseMap) throw new Error('Basemap not inited');
    this.engine.audioPlayer.play(this.baseMap?.tileData.music);

    this.camera = new Camera(
      this.engine.ctx,
      engineConfig.camera,
      this.baseMap,
    );

    console.log('playerLoaded');
    console.log('map loaded');

    this.player.position = {
      x: this.camera.config.width / 2,
      y: this.camera.config.height / 2,
    };

    this.camera.x = this.player.position.x - this.camera.config.width / 2;
    this.camera.y = this.player.position.y - this.camera.config.height / 2;
  }

  async update_scene() {
    if (!this.player) throw new Error('Player not inited');
    if (!this.baseMap) throw new Error('Basemap not inited');
    if (!this.camera) throw new Error('Camera not inited');

    this.player.update();
    // this.pokemon_on_enter_grass();
    this.camera.follow(this.player);

    this.camera.renderMap(this.baseMap);
    this.camera.renderObject(this.player);
  }
}

export default BaseScene;
